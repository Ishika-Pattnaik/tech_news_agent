# Render Deployment Guide for Techno AI News App

## 🚀 Quick Deploy to Render

### Prerequisites
- Render account (https://render.com)
- GitHub repository with your code
- Your API keys ready

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Deploy to Render"
git push origin main
```

### Step 2: Deploy to Render
1. Go to [dashboard.render.com](https://dashboard.render.com)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Select the root directory
5. Render will automatically detect `render.yaml`

### Step 3: Configure Environment Variables
In Render dashboard, set these environment variables for the **API service**:

**Required:**
- `MISTRAL_API_KEY` - Your Mistral AI API key
- `TAVILY_API_KEY` - Your Tavily search API key

**Optional (already set in render.yaml):**
- `PYTHON_VERSION=3.11` - Python version
- `PORT=8000` - Port for the API

### Step 4: Verify Deployment
1. Render will create two services:
   - **API Service**: `tech-news-api.onrender.com`
   - **Frontend Service**: `tech-news-frontend.onrender.com`
2. Your app will be available at your frontend URL
3. API calls will be proxied to the backend service

### Configuration Files Created
- ✅ `render.yaml` - Render deployment configuration
- ✅ `Dockerfile` - Backend container setup
- ✅ `frontend/Dockerfile` - Frontend container setup  
- ✅ `.env.example` - Environment variables template

### Service URLs After Deployment
- **API**: `https://tech-news-api.onrender.com/api/`
- **Frontend**: `https://tech-news-frontend.onrender.com/`
- **Health Check**: `https://tech-news-api.onrender.com/health`

### Frontend Configuration
The frontend is configured to proxy API calls to the backend service automatically through the rewrite rule in `render.yaml`.

### Troubleshooting
- Check logs in Render dashboard
- Verify environment variables are set correctly
- Ensure both services are running
- API should be accessible on port 8000 internally
- Frontend should build and serve static files

### Environment Variables Setup
1. Go to your API service in Render dashboard
2. Click "Environment" tab
3. Add your API keys:
   - `MISTRAL_API_KEY`: Your Mistral AI key
   - `TAVILY_API_KEY`: Your Tavily search key
4. Click "Save Changes"
5. Trigger a new deployment

### Deployment Flow
1. **Backend**: Python FastAPI with Gunicorn
2. **Frontend**: React app built to static files
3. **API Proxy**: Frontend rewrites `/api/*` to backend service
4. **Health Checks**: `/health` endpoint for monitoring

That's it! Your Techno AI News app will be live on Render with automatic HTTPS, CI/CD, and monitoring.
