#!/usr/bin/env python3

import os
from dotenv import load_dotenv
from tavily import TavilyClient
from mistralai.client import Mistral

load_dotenv()

def main():
    tavily_key = os.getenv('TAVILY_API_KEY')
    mistral_key = os.getenv('MISTRAL_API_KEY')
    
    if not tavily_key:
        print("Error: TAVILY_API_KEY environment variable not set")
        return
    if not mistral_key:
        print("Error: MISTRAL_API_KEY environment variable not set")
        return
    
    tavily_client = TavilyClient(api_key=tavily_key)
    mistral_client = Mistral(api_key=mistral_key)
    
    print("Tech News AI Agent - Enter your query (type 'end_turn' to exit)")
    print("=" * 60)
    
    while True:
        try:
            user_question = input("> ").strip()
            if user_question.lower() == 'end_turn': break
            if not user_question: continue
            
            print(f"User Question: {user_question}")
            print("Tool Called: Tavily Search")
            result = tavily_client.search(query=f"latest tech news {user_question}", search_depth="basic", max_results=5)
            
            print(f"Data Returned: {len(result.get('results', []))} results found")
            if result.get('results'):
                print("Tool Called: Mistral AI")
                news_content = ""
                for item in result['results'][:3]:
                    news_content += f"Title: {item.get('title', '')}\n"
                    news_content += f"Content: {item.get('content', '')}\n\n"
                
                prompt = f"""Summarize the following tech news about "{user_question}" in a clear, concise paragraph that answers the user's query:

{news_content}

Provide a comprehensive but brief summary that captures the key developments."""
                
                response = mistral_client.chat.complete(
                    model="mistral-small-latest",
                    messages=[{"role": "user", "content": prompt}]
                )
                
                print(f"Final Answer: {response.choices[0].message.content}")
            else:
                print("Final Answer: No tech news found.")
            print()
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    main()
