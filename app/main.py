#!/usr/bin/env python3

import time
import logging
from datetime import datetime, timedelta
from typing import Dict, Optional
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from .config.settings import settings
from .services.agent import TechNewsAgent

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Tech News AI Agent",
    description="Production-ready API for tech news summarization",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory cache
cache: Dict[str, Dict] = {}

# Rate limiting storage (in production, use Redis or similar)
rate_limits: Dict[str, Dict] = {}

# Initialize the agent
try:
    settings.validate_api_keys()
    agent = TechNewsAgent(settings.TAVILY_API_KEY, settings.MISTRAL_API_KEY)
    logger.info("Tech News Agent initialized successfully")
except ValueError as e:
    logger.error(f"Failed to initialize agent: {str(e)}")
    agent = None

def get_client_ip(request: Request) -> str:
    """Extract client IP from request."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host

def check_rate_limit(ip: str) -> bool:
    """Check if IP is within rate limits."""
    now = time.time()
    
    if ip not in rate_limits:
        rate_limits[ip] = {"count": 0, "reset_time": now + settings.RATE_LIMIT_WINDOW}
    
    # Reset window if expired
    if now > rate_limits[ip]["reset_time"]:
        rate_limits[ip] = {"count": 0, "reset_time": now + settings.RATE_LIMIT_WINDOW}
    
    # Check limit
    if rate_limits[ip]["count"] >= settings.RATE_LIMIT_REQUESTS:
        return False
    
    rate_limits[ip]["count"] += 1
    return True

def get_cache_key(query: str) -> str:
    """Generate cache key for query."""
    return f"query_{hash(query.lower().strip())}"

def is_cache_valid(timestamp: float) -> bool:
    """Check if cache entry is still valid."""
    return time.time() - timestamp < settings.CACHE_TTL

@app.on_event("startup")
async def startup_event():
    """Initialize application."""
    if not agent:
        logger.error("Application cannot start: Agent not initialized")
        raise Exception("Agent initialization failed")

@app.get("/")
async def root():
    """Health check endpoint."""
    return {"status": "healthy", "message": "Tech News AI Agent API"}

@app.get("/summarize")
async def summarize_news(
    request: Request,
    query: str = Query(..., min_length=1, max_length=500, description="Tech news query to summarize")
):
    """
    Summarize latest tech news based on query.
    
    - **query**: Search query for tech news (1-500 characters)
    
    Returns JSON with summary and metadata.
    """
    try:
        # Rate limiting
        client_ip = get_client_ip(request)
        if not check_rate_limit(client_ip):
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            raise HTTPException(
                status_code=429,
                detail=f"Rate limit exceeded. Maximum {settings.RATE_LIMIT_REQUESTS} requests per {settings.RATE_LIMIT_WINDOW} seconds."
            )
        
        # Check cache
        cache_key = get_cache_key(query)
        if cache_key in cache and is_cache_valid(cache[cache_key]["timestamp"]):
            logger.info(f"Cache hit for query: {query}")
            cached_result = cache[cache_key]["data"]
            cached_result["cached"] = True
            return cached_result
        
        # Process query
        logger.info(f"Processing query from IP {client_ip}: {query}")
        result = await agent.process_query(query)
        
        # Cache successful results
        if result.get("success"):
            cache[cache_key] = {
                "data": result,
                "timestamp": time.time()
            }
            result["cached"] = False
        
        # Return appropriate HTTP status
        if result.get("success"):
            return result
        else:
            raise HTTPException(
                status_code=500,
                detail=result.get("error", "Unknown error occurred")
            )
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error processing query '{query}': {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error occurred while processing your request"
        )

@app.get("/health")
async def health_check():
    """Detailed health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "agent_initialized": agent is not None,
        "cache_size": len(cache),
        "rate_limit_ips": len(rate_limits)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )
