# Tech News AI Agent

A production-ready API that provides latest tech news updates using Tavily web search and Mistral AI for intelligent summarization.

## Quick Start

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up API keys in `.env`:
   - Get Tavily API key from [Tavily](https://tavily.com/)
   - Get Mistral API key from [Mistral AI](https://console.mistral.ai/)
   - Add both API keys to the `.env` file

3. Run the API server:
   ```bash
   python -m app.main
   ```

## API Usage

### Main Endpoint
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

### Health Check
```bash
curl "http://localhost:8000/health"
```

## Features

- **🚀 Production-ready API** with FastAPI
- **🔍 Real-time tech news search** via Tavily API
- **🤖 AI-powered summarization** using Mistral AI
- **⚡ In-memory caching** to reduce API costs
- **🛡️ Rate limiting** to prevent abuse
- **📝 Comprehensive logging** for monitoring
- **🔧 Modular architecture** for easy extension
- **📦 Deployment ready** with Docker/Render support

## Architecture

```
app/
├── main.py              # FastAPI entrypoint
├── config/
│   └── settings.py      # Configuration management
├── tools/
│   ├── tavily.py        # Tavily search logic
│   └── mistral.py       # Mistral AI logic
└── services/
    └── agent.py         # Pipeline orchestration
```

## Pipeline

1. **Query Processing**: User query received via API
2. **Tavily Search**: Fetches latest tech news from web sources
3. **Content Formatting**: Structures results for AI processing
4. **Mistral Summarization**: Analyzes and summarizes the news
5. **Response**: Returns JSON with summary and metadata

## Deployment

See [README_DEPLOYMENT.md](./README_DEPLOYMENT.md) for detailed deployment instructions including:
- Local development setup
- Render deployment
- Docker deployment
- Production configuration

## Legacy CLI Version

The original CLI version is preserved as `tech_news_agent.py` for reference.
