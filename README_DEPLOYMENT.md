# Tech News AI Agent - Deployment Guide

## Production Deployment Instructions

### Environment Setup

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Set environment variables:**
```bash
# Required API Keys
export TAVILY_API_KEY="your_tavily_api_key"
export MISTRAL_API_KEY="your_mistral_api_key"

# Optional Configuration
export HOST="0.0.0.0"
export PORT="8000"
export DEBUG="false"
export RATE_LIMIT_REQUESTS="10"
export RATE_LIMIT_WINDOW="60"
export CACHE_TTL="300"
```

### Local Development

```bash
# Run the development server
python -m app.main

# Or use uvicorn directly
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Production Deployment (Render)

1. **Create `render.yaml`:**
```yaml
services:
  - type: web
    name: tech-news-agent
    env: python
    plan: free
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: TAVILY_API_KEY
        sync: false
      - key: MISTRAL_API_KEY
        sync: false
      - key: HOST
        value: 0.0.0.0
      - key: PORT
        value: 8000
      - key: DEBUG
        value: false
```

2. **Deploy to Render:**
- Push your code to GitHub
- Connect your GitHub repository to Render
- Add environment variables in Render dashboard
- Deploy

### Production Deployment (Docker)

1. **Create `Dockerfile`:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

2. **Build and run:**
```bash
docker build -t tech-news-agent .
docker run -p 8000:8000 --env-file .env tech-news-agent
```

### API Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health status
- `GET /summarize?query=<search_term>` - Main endpoint

### Example API Usage

```bash
curl "http://localhost:8000/summarize?query=artificial%20intelligence"
```

Response:
```json
{
  "query": "artificial intelligence",
  "summary": "Latest AI developments include...",
  "sources_count": 5,
  "success": true,
  "cached": false
}
```

### Monitoring

- Check logs for API calls and errors
- Monitor `/health` endpoint for service status
- Rate limiting prevents abuse (10 requests/minute per IP)
- Caching reduces API costs (5-minute TTL)

### Scaling Considerations

- **Caching**: Replace in-memory cache with Redis for distributed deployments
- **Rate Limiting**: Use Redis or dedicated rate limiting service for multi-instance deployments
- **Logging**: Add structured logging and log aggregation
- **Monitoring**: Add metrics collection (Prometheus) and health checks
