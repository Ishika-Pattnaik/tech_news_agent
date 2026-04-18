#!/usr/bin/env python3

import asyncio
import aiohttp
import time
from typing import List

async def test_endpoint(session: aiohttp.ClientSession, query: str) -> dict:
    """Test a single API call."""
    start_time = time.time()
    try:
        async with session.get(f"http://localhost:8000/summarize?query={query}") as response:
            result = await response.json()
            end_time = time.time()
            return {
                "query": query,
                "status": response.status,
                "success": result.get("success", False),
                "cached": result.get("cached", False),
                "response_time": end_time - start_time
            }
    except Exception as e:
        return {
            "query": query,
            "status": "error",
            "success": False,
            "cached": False,
            "response_time": time.time() - start_time,
            "error": str(e)
        }

async def run_tests():
    """Run comprehensive API tests."""
    base_url = "http://localhost:8000"
    
    async with aiohttp.ClientSession() as session:
        print("=== API Testing Suite ===\n")
        
        # Test 1: Health checks
        print("1. Health Checks:")
        try:
            async with session.get(f"{base_url}/") as response:
                print(f"   Basic health: {response.status}")
            async with session.get(f"{base_url}/health") as response:
                health_data = await response.json()
                print(f"   Detailed health: {response.status}")
                print(f"   Agent initialized: {health_data.get('agent_initialized')}")
                print(f"   Cache size: {health_data.get('cache_size')}")
        except Exception as e:
            print(f"   Health check failed: {e}")
        
        # Test 2: Basic functionality
        print("\n2. Basic Functionality:")
        queries = ["artificial intelligence", "blockchain", "quantum computing"]
        results = await asyncio.gather(*[test_endpoint(session, query) for query in queries])
        
        for result in results:
            status = "SUCCESS" if result["success"] else "FAILED"
            print(f"   {result['query']}: {status} ({result['response_time']:.2f}s)")
        
        # Test 3: Caching
        print("\n3. Caching Test:")
        first_call = await test_endpoint(session, "artificial intelligence")
        second_call = await test_endpoint(session, "artificial intelligence")
        
        print(f"   First call cached: {first_call['cached']}")
        print(f"   Second call cached: {second_call['cached']}")
        print(f"   First call time: {first_call['response_time']:.2f}s")
        print(f"   Second call time: {second_call['response_time']:.2f}s")
        
        # Test 4: Rate limiting
        print("\n4. Rate Limiting Test:")
        rate_test_results = []
        for i in range(12):  # More than the limit of 10
            result = await test_endpoint(session, f"rate_test_{i}")
            rate_test_results.append(result)
            if result["status"] == 429:
                print(f"   Rate limit triggered at request {i+1}")
                break
        
        successful_requests = sum(1 for r in rate_test_results if r["status"] == 200)
        print(f"   Successful requests before rate limit: {successful_requests}")
        
        # Test 5: Error handling
        print("\n5. Error Handling:")
        error_tests = [
            ("empty_query", ""),
            ("long_query", "a" * 501),
            ("invalid_endpoint", "http://localhost:8000/invalid")
        ]
        
        for test_name, test_value in error_tests:
            try:
                if test_name == "invalid_endpoint":
                    async with session.get(test_value) as response:
                        print(f"   {test_name}: {response.status}")
                else:
                    async with session.get(f"{base_url}/summarize?query={test_value}") as response:
                        print(f"   {test_name}: {response.status}")
            except Exception as e:
                print(f"   {test_name}: Error - {str(e)[:50]}")
        
        print("\n=== Test Complete ===")

if __name__ == "__main__":
    asyncio.run(run_tests())
