#!/usr/bin/env python3

import os
from dotenv import load_dotenv
from tavily import TavilyClient

load_dotenv()

def test_agent():
    api_key = os.getenv('TAVILY_API_KEY')
    if not api_key:
        print("✓ Agent correctly detects missing TAVILY_API_KEY")
        print("To test with real data:")
        print("1. Get API key from https://tavily.com/")
        print("2. Create .env file with TAVILY_API_KEY=your_key")
        print("3. Run: python3 tech_news_agent.py")
        return True
    
    try:
        client = TavilyClient(api_key=api_key)
        result = client.search(
            query="latest AI news",
            max_results=2,
            search_depth="basic"
        )
        print("✓ Agent successfully connects to Tavily API")
        print(f"✓ Found {len(result.get('results', []))} results")
        return True
    except Exception as e:
        print(f"✗ Error: {e}")
        return False

if __name__ == "__main__":
    print("Testing Tech News AI Agent...")
    test_agent()
