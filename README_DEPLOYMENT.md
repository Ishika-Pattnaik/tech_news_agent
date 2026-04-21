# Tech News AI Agent - Deployment Guide

This guide covers multiple free deployment options for your Tech News AI application.

## 🚀 Quick Deployment Options

### 1. Railway (Recommended - Easiest)

**Free Tier**: $5/month credit (sufficient for small projects)

**Steps**:
1. Push your code to GitHub
2. Sign up at [Railway](https://railway.app/)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect your stack using `railway.toml`
6. Add environment variables in Railway dashboard:
   - `TAVILY_API_KEY`: Your Tavily API key
   - `MISTRAL_API_KEY`: Your Mistral API key

**Features**:
- Automatic deployments on git push
- Built-in CI/CD
- Free SSL certificates
- Custom domains

### 2. Render (Alternative)

**Free Tier**: 750 hours/month (sufficient for small projects)

**Steps**:
1. Push your code to GitHub
2. Sign up at [Render](https://render.com/)
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Render will use `render.yaml` for configuration
6. Set environment variables:
   - `TAVILY_API_KEY`: Your Tavily API key
   - `MISTRAL_API_KEY`: Your Mistral API key

**Services Created**:
- Backend API: `tech-news-api`
- Frontend: `tech-news-frontend`

### 3. Docker + Fly.io (Advanced)

**Free Tier**: Shared CPU, 160GB outbound/month

**Steps**:
1. Install [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/)
2. Run: `fly launch`
3. Set environment variables: `fly secrets set TAVILY_API_KEY=xxx MISTRAL_API_KEY=xxx`
4. Deploy: `fly deploy`

## 📋 Prerequisites

### Required API Keys
1. **Tavily API Key**: Get from [Tavily](https://tavily.com/)
2. **Mistral API Key**: Get from [Mistral AI](https://console.mistral.ai/)

### Environment Variables
```bash
TAVILY_API_KEY=your_tavily_key_here
MISTRAL_API_KEY=your_mistral_key_here
```

## 🛠️ Local Development Setup

### Backend
```bash
# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys

# Run development server
python -m app.main
```

### Frontend
```bash
cd frontend
npm install
npm start
```

### Docker (Local)
```bash
# Build and run all services
docker-compose up --build

# Or run individual services
docker-compose up backend
docker-compose up frontend
```

## 📊 Deployment Comparison

| Platform | Free Tier | Ease of Use | Features | Best For |
|----------|-----------|-------------|----------|----------|
| Railway | $5/month credit | ⭐⭐⭐⭐⭐ | Auto-deploy, SSL, Custom domains | Beginners |
| Render | 750h/month | ⭐⭐⭐⭐ | Separate services, Static hosting | Scalability |
| Fly.io | 160GB/month | ⭐⭐⭐ | Global deployment, Docker | Advanced users |

## 🔧 Configuration Files

- `railway.toml`: Railway deployment configuration
- `render.yaml`: Render deployment configuration  
- `Dockerfile`: Backend container configuration
- `frontend/Dockerfile`: Frontend container configuration
- `docker-compose.yml`: Local development with Docker

## 🌐 Access Points

Once deployed:

- **Frontend**: Main web interface
- **Backend API**: `/summarize` endpoint
- **Health Check**: `/health` endpoint
- **API Docs**: `/docs` (FastAPI auto-docs)

## 🔍 Monitoring

All platforms provide:
- Application logs
- Health monitoring
- Error tracking
- Performance metrics

## 🚨 Troubleshooting

### Common Issues

1. **API Key Errors**
   - Ensure environment variables are set correctly
   - Check API key validity

2. **Build Failures**
   - Verify `requirements.txt` is complete
   - Check Node.js version compatibility

3. **CORS Issues**
   - Backend allows all origins in development
   - Update CORS settings for production domains

4. **Memory Issues**
   - Free tiers have memory limits
   - Monitor cache size and rate limiting

### Health Checks

All deployments include health checks:
- Backend: `/health` endpoint
- Frontend: Root path `/`

## 📈 Scaling

When you need to scale beyond free tiers:

1. **Database**: Add Redis for caching
2. **Monitoring**: Add APM tools
3. **Load Balancing**: Multiple instances
4. **CDN**: Static asset delivery

## 🆘 Support

- Platform documentation: Railway, Render, Fly.io
- GitHub Issues: For application bugs
- Community forums: Platform-specific support
