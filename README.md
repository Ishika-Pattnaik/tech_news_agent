# Tech News AI Agent

A production-ready API that provides latest tech news updates using Tavily web search and Mistral AI for intelligent summarization.

## Quick Start

### Backend Setup
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

### Frontend Setup
1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

4. Open `http://localhost:3000` in your browser

### Complete Development Setup
```bash
# Terminal 1 - Backend
cd /path/to/tech_news_agent
python -m app.main

# Terminal 2 - Frontend
cd /path/to/tech_news_agent/frontend
npm start
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
- **⚛️ Modern React frontend** with dark theme UI
- **🔍 Real-time tech news search** via Tavily API
- **🤖 AI-powered summarization** using Mistral AI
- **⚡ In-memory caching** to reduce API costs
- **🛡️ Rate limiting** to prevent abuse
- **📝 Comprehensive logging** for monitoring
- **🔧 Modular architecture** for easy extension
- **� Markdown rendering** for formatted AI responses

## Architecture

```
tech_news_agent/
├── app/                  # FastAPI backend
│   ├── main.py          # FastAPI entrypoint
│   ├── config/
│   │   └── settings.py  # Configuration management
│   ├── tools/
│   │   ├── tavily.py    # Tavily search logic
│   │   └── mistral.py   # Mistral AI logic
│   └── services/
│       └── agent.py      # Pipeline orchestration
└── frontend/            # React frontend
    ├── src/
    │   ├── components/   # React components
    │   └── App.jsx      # Main app component
    └── public/          # Static assets
```

## Pipeline

1. **User Query**: User enters query in React frontend
2. **API Request**: Frontend sends request to backend API
3. **Tavily Search**: Fetches latest tech news from web sources
4. **Content Formatting**: Structures results for AI processing
5. **Mistral Summarization**: Analyzes and summarizes the news
6. **Response**: Returns JSON with formatted summary and metadata
7. **Frontend Display**: React renders markdown-formatted response

## Access Points

- **Frontend UI**: `http://localhost:3000` - Dark themed React interface
- **Backend API**: `http://localhost:8000` - FastAPI with interactive docs
- **API Documentation**: `http://localhost:8000/docs` - Swagger UI
