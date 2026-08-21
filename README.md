# Pega MCP Client for Railway

A Node.js MCP (Model Context Protocol) client application that connects Claude AI with your Pega MCP server, deployable on Railway.

## 🎯 Overview

This application:
- ✅ Runs as a web service on Railway
- ✅ Connects to your Pega MCP server via OAuth
- ✅ Exposes REST API endpoints for MCP operations
- ✅ Integrates with Claude via Anthropic API
- ✅ Handles OAuth callbacks from Pega

## 📋 Prerequisites

1. **Railway Account** - https://railway.app
2. **Anthropic API Key** - Get from https://console.anthropic.com
3. **Pega MCP Configuration**:
   - MCP Server URL: `https://airbus25.pegademo.com/prweb/app/air-bus/api/service/v1/mcp/pxCommon`
   - OAuth Token (valid access token)
   - Client ID & Client Secret

## 🚀 Quick Start on Railway

### Step 1: Create Repository

Create a GitHub repository with these files:
- `package.json`
- `server.js`
- `Dockerfile`
- `.env.example`
- `README.md`

### Step 2: Deploy to Railway

1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Connect your repository
5. Railway will auto-detect and deploy

### Step 3: Configure Environment Variables

In Railway Dashboard:
1. Go to your project
2. Click **"Variables"**
3. Add these variables:

```
PEGA_MCP_URL=https://airbus25.pegademo.com/prweb/app/air-bus/api/service/v1/mcp/pxCommon
PEGA_MCP_TOKEN=<your-access-token>
ANTHROPIC_API_KEY=<your-anthropic-api-key>
```

### Step 4: Get Your Public URL

Railway assigns a public URL automatically:
```
https://your-project-xxx.railway.app
```

### Step 5: Register OAuth Callback in Pega

In your Pega admin panel, register this redirect URI:
```
https://your-project-xxx.railway.app/oauth/callback
```

## 📡 API Endpoints

### Health Check
```bash
curl https://your-project-xxx.railway.app/health
```

### Get Configuration
```bash
curl https://your-project-xxx.railway.app/api/config
```

### List Pega MCP Tools
```bash
curl https://your-project-xxx.railway.app/api/mcp/tools
```

### Initialize MCP Session
```bash
curl -X POST https://your-project-xxx.railway.app/api/mcp/initialize
```

### Query via Claude
```bash
curl -X POST https://your-project-xxx.railway.app/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "List all available Pega resources"}'
```

### OAuth Callback
```
https://your-project-xxx.railway.app/oauth/callback?code=<auth-code>&state=<state>
```

## 🔧 Local Development

### Setup
```bash
npm install
```

### Environment Setup
```bash
cp .env.example .env
# Edit .env with your actual values
```

### Run Locally
```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Test Endpoints
```bash
# Health check
curl http://localhost:3000/health

# List tools
curl http://localhost:3000/api/mcp/tools

# Query
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What tools are available?"}'
```

## 📦 Docker Build (Optional)

```bash
docker build -t pega-mcp-client .
docker run -p 3000:3000 \
  -e PEGA_MCP_URL=<url> \
  -e PEGA_MCP_TOKEN=<token> \
  -e ANTHROPIC_API_KEY=<key> \
  pega-mcp-client
```

## 🔐 Security Considerations

⚠️ **Important:**
- Never commit `.env` files with real tokens
- Use Railway's secret variables for sensitive data
- Rotate tokens regularly
- Use HTTPS only (Railway provides this automatically)
- Add authentication/authorization to API endpoints in production

## 📊 Monitoring

Railway provides built-in monitoring:
- **Logs** - View in Railway dashboard
- **Metrics** - CPU, memory, network usage
- **Deployments** - Track all deployments

View logs:
```bash
# Via Railway CLI
railway logs
```

## 🐛 Troubleshooting

### Token Expired
If you get "token expired" errors:
1. Generate a new OAuth token from Pega
2. Update `PEGA_MCP_TOKEN` in Railway variables
3. Restart the app

### Connection Issues
Check the logs for details:
- Railway dashboard → Logs tab
- Look for error messages
- Verify all environment variables are set

### MCP Session Errors
If session creation fails:
1. Verify token is valid
2. Check Pega server is accessible
3. Ensure redirect URI is registered in Pega
4. Review Pega server logs

## 📚 Architecture

```
┌─────────────────────┐
│   Claude AI API     │
│  (Anthropic)        │
└──────────┬──────────┘
           │
           │ (via Anthropic SDK)
           │
┌──────────▼──────────────────────┐
│  Railway MCP Client (Node.js)   │
│  - REST API                      │
│  - OAuth Callback Handler        │
│  - MCP Protocol Handler          │
└──────────┬──────────────────────┘
           │
           │ (OAuth + JSON-RPC)
           │
┌──────────▼──────────────────────┐
│   Pega MCP Server                │
│  (airbus25.pegademo.com)         │
│  - Tools & Resources             │
│  - OAuth Provider                │
└──────────────────────────────────┘
```

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PEGA_MCP_URL` | Yes | URL of Pega MCP server |
| `PEGA_MCP_TOKEN` | Yes | OAuth access token |
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |
| `PORT` | No | Server port (default: 3000) |
| `NODE_ENV` | No | Environment (development/production) |

## 🤝 Support

For issues:
1. Check Railway logs
2. Verify environment variables
3. Test endpoints manually with curl
4. Check Pega server logs

## 📄 License

MIT

---

**Ready to deploy?** Push this code to GitHub and link it in Railway! 🚀
