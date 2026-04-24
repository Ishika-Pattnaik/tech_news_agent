#!/usr/bin/env python3

import os
import asyncio
from typing import Dict, List, Optional
try:
    from tavily import TavilyClient
except ImportError:
    # Fallback mock implementation for development/testing
    import requests
    import json
    
    class TavilyClient:
        def __init__(self, api_key: str):
            self.api_key = api_key
        
        def search(self, query: str, search_depth: str = "basic", max_results: int = 5):
            # Mock implementation - in production this would use actual Tavily API
            return {
                "results": [
                    {
                        "title": f"Sample Tech News: {query}",
                        "content": f"This is sample content about {query}. In a real implementation, this would be actual search results from Tavily API.",
                        "url": "https://example.com/news"
                    }
                ]
            }
import logging

logger = logging.getLogger(__name__)

class TavilyTool:
    def __init__(self, api_key: str):
        self.client = TavilyClient(api_key=api_key)
    
    async def search_tech_news(self, query: str, max_results: int = 5, include_images: bool = False) -> Dict:
        """
        Search for latest tech news using Tavily API.
        
        Args:
            query: Search query
            max_results: Maximum number of results to return
            
        Returns:
            Dictionary containing search results
            
        Raises:
            Exception: If API call fails
        """
        try:
            search_query = f"{query} site:reuters.com OR site:bbc.com OR site:techcrunch.com OR site:theverge.com OR site:wired.com OR site:arstechnica.com OR site:bloomberg.com OR site:ft.com OR site:wsj.com OR site:nytimes.com OR site:theguardian.com OR site:forbes.com OR site:businessinsider.com OR site:zdnet.com OR site:cnet.com OR site:engadget.com OR site:venturebeat.com OR site:thenextweb.com OR site:mashable.com OR site:gizmodo.com OR site:fastcompany.com OR site:mit.edu OR site:nature.com OR site:newscientist.com OR site:apnews.com OR site:axios.com OR site:technologyreview.com OR site:scientificamerican.com OR site:ieee.org OR site:acm.org OR site:informationweek.com OR site:computerworld.com OR site:openai.com OR site:deepmind.google OR site:anthropic.com"
            logger.info(f"Searching Tavily for: {search_query}")
            
            # Run the synchronous Tavily call in an executor
            loop = asyncio.get_event_loop()
            search_params = {
                "query": search_query, 
                "search_depth": "basic", 
                "max_results": max_results
            }
            if include_images:
                search_params["include_images"] = True
                
            result = await loop.run_in_executor(
                None, 
                lambda: self.client.search(**search_params)
            )
            
            logger.info(f"Tavily returned {len(result.get('results', []))} results")
            return result
            
        except Exception as e:
            logger.error(f"Tavily search failed: {str(e)}")
            raise Exception(f"Tavily search error: {str(e)}")
    
    def format_results(self, results: Dict, max_items: int = 3) -> str:
        """
        Format Tavily search results into a string for processing.
        
        Args:
            results: Tavily search results
            max_items: Maximum number of items to format
            
        Returns:
            Formatted string of news content
        """
        if not results.get('results'):
            return ""
        
        news_content = ""
        for item in results['results'][:max_items]:
            news_content += f"Title: {item.get('title', '')}\n"
            news_content += f"Content: {item.get('content', '')}\n\n"
        
        return news_content
