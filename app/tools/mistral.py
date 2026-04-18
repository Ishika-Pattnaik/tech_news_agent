#!/usr/bin/env python3

import asyncio
from typing import Optional
try:
    from mistralai.client import Mistral
except ImportError:
    try:
        from mistralai import Mistral
    except ImportError:
        # Fallback mock implementation for development/testing
        class Mistral:
            def __init__(self, api_key: str):
                self.api_key = api_key
            
            class chat:
                @staticmethod
                def complete(model: str, messages: list):
                    class Message:
                        def __init__(self, content):
                            self.content = content
                    
                    class Choice:
                        def __init__(self, message):
                            self.message = message
                    
                    class Response:
                        def __init__(self):
                            self.choices = [Choice(Message(f"Mock summary: This is a sample AI-generated summary about tech news. In production, this would be an actual summary from Mistral AI."))]
                    
                    return Response()
import logging

logger = logging.getLogger(__name__)

class MistralTool:
    def __init__(self, api_key: str):
        self.client = Mistral(api_key=api_key)
        self.model = "mistral-small-latest"
    
    async def summarize_news(self, query: str, news_content: str) -> str:
        """
        Summarize tech news using Mistral AI.
        
        Args:
            query: Original user query
            news_content: Formatted news content from Tavily
            
        Returns:
            Summarized response
            
        Raises:
            Exception: If API call fails
        """
        try:
            if not news_content.strip():
                return "No tech news found to summarize."
            
            prompt = f"""Summarize the following tech news about "{query}" in a clear, concise paragraph that answers the user's query:

{news_content}

Provide a comprehensive but brief summary that captures the key developments."""
            
            logger.info(f"Calling Mistral API for query: {query}")
            
            # Run the synchronous Mistral call in an executor
            loop = asyncio.get_event_loop()
            response = await loop.run_in_executor(
                None,
                lambda: self.client.chat.complete(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}]
                )
            )
            
            summary = response.choices[0].message.content
            logger.info("Mistral summarization completed successfully")
            return summary
            
        except Exception as e:
            logger.error(f"Mistral API call failed: {str(e)}")
            raise Exception(f"Mistral summarization error: {str(e)}")
