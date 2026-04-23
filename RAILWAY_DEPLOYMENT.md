# Railway Deployment Guide for Techno AI News App

## 🚀 Quick Deploy to Railway

### Prerequisites
- Railway account (https://railway.app)
- GitHub repository with your code
- Railway CLI installed (`npm install -g @railway/cli`)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Deploy to Railway"
git push origin main
```

### Step 2: Deploy to Railway
```bash
# Login to Railway
railway login

# Deploy your project
railway up
```

### Step 3: Configure Environment Variables
In Railway dashboard, set these environment variables:

**Required:**
- `MISTRAL_API_KEY` - Your Mistral AI API key
- `TAVILY_API_KEY` - Your Tavily search API key

**Optional:**
- `PORT=8000` - Default port
- `RAILWAY_ENVIRONMENT=production` - Environment setting

### Step 4: Verify Deployment
1. Railway will automatically detect `railway.toml` configuration
2. Two services will be created:
   - **API Service**: Backend FastAPI server
   - **Frontend Service**: React frontend
3. Your app will be available at `https://your-app-name.railway.app`

### Configuration Files Created
- ✅ `railway.toml` - Railway deployment configuration
- ✅ `Dockerfile` - Backend container setup
- ✅ `frontend/Dockerfile` - Frontend container setup  
- ✅ `.env.example` - Environment variables template

### Service URLs After Deployment
- **API**: `https://your-app-name.railway.app/api/`
- **Frontend**: `https://your-app-name.railway.app/`
- **Health Check**: `https://your-app-name.railway.app/health`

### Troubleshooting
- Check logs in Railway dashboard
- Verify environment variables are set correctly
- Ensure both services are running
- API should be accessible on port 8000 internally
- Frontend should proxy API calls to Railway API URL

### Frontend Configuration Update
Update `frontend/src/constants.js` (or create it):
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-name.railway.app' 
  : 'http://localhost:8000';
```

That's it! Your Techno AI News app will be live on Railway.
