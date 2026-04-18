#!/usr/bin/env python3

import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # API Keys
    TAVILY_API_KEY: str = os.getenv('TAVILY_API_KEY', '')
    MISTRAL_API_KEY: str = os.getenv('MISTRAL_API_KEY', '')
    
    # Server Settings
    HOST: str = os.getenv('HOST', '0.0.0.0')
    PORT: int = int(os.getenv('PORT', '8000'))
    DEBUG: bool = os.getenv('DEBUG', 'False').lower() == 'true'
    
    # Rate Limiting
    RATE_LIMIT_REQUESTS: int = int(os.getenv('RATE_LIMIT_REQUESTS', '10'))
    RATE_LIMIT_WINDOW: int = int(os.getenv('RATE_LIMIT_WINDOW', '60'))  # seconds
    
    # Caching
    CACHE_TTL: int = int(os.getenv('CACHE_TTL', '300'))  # seconds
    
    def validate_api_keys(self) -> None:
        """Validate that required API keys are present."""
        if not self.TAVILY_API_KEY:
            raise ValueError("TAVILY_API_KEY environment variable not set")
        if not self.MISTRAL_API_KEY:
            raise ValueError("MISTRAL_API_KEY environment variable not set")

settings = Settings()
