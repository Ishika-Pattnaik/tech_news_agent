#!/usr/bin/env python3

import logging
from typing import Dict, Optional
from ..tools.tavily import TavilyTool
from ..tools.mistral import MistralTool

logger = logging.getLogger(__name__)

class TechNewsAgent:
    def __init__(self, tavily_api_key: str, mistral_api_key: str):
        self.tavily_tool = TavilyTool(tavily_api_key)
        self.mistral_tool = MistralTool(mistral_api_key)
    
    async def process_query(self, query: str) -> Dict:
        """
        Process a tech news query through the complete pipeline:
        Tavily search → format results → Mistral summarization
        
        Args:
            query: User query about tech news
            
        Returns:
            Dictionary containing the summary and metadata
            
        Raises:
            Exception: If any step in the pipeline fails
        """
        try:
            logger.info(f"Processing query: {query}")
            
            # Step 1: Search for tech news using Tavily
            search_results = await self.tavily_tool.search_tech_news(query)
            
            # Step 2: Format the results
            formatted_content = self.tavily_tool.format_results(search_results)
            
            # Step 3: Summarize using Mistral
            summary = await self.mistral_tool.summarize_news(query, formatted_content)
            
            result = {
                "query": query,
                "summary": summary,
                "sources_count": len(search_results.get('results', [])),
                "success": True
            }
            
            logger.info(f"Successfully processed query: {query}")
            return result
            
        except Exception as e:
            logger.error(f"Pipeline failed for query '{query}': {str(e)}")
            return {
                "query": query,
                "summary": None,
                "error": str(e),
                "success": False
            }
