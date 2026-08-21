import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Configuration
const PEGA_MCP_URL = process.env.PEGA_MCP_URL;
const PEGA_MCP_TOKEN = process.env.PEGA_MCP_TOKEN;

// MCP Server configuration
const mcpServers = {
  pega: {
    url: PEGA_MCP_URL,
    auth: {
      type: "bearer",
      token: PEGA_MCP_TOKEN,
    },
  },
};

/**
 * Initialize MCP Session with Pega
 */
async function initializePegaMCP() {
  try {
    console.log("🔄 Initializing Pega MCP Server...");

    const response = await axios.post(
      PEGA_MCP_URL,
      {
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {
            sampling: {},
          },
          clientInfo: {
            name: "Railway-MCP-Client",
            version: "1.0.0",
          },
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PEGA_MCP_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
        },
      }
    );

    console.log("✅ Pega MCP initialized:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Failed to initialize Pega MCP:",
      error.response?.data || error.message
    );
    throw error;
  }
}

/**
 * List tools available from Pega MCP
 */
async function listPegaTools() {
  try {
    const response = await axios.post(
      PEGA_MCP_URL,
      {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/list",
        params: {},
      },
      {
        headers: {
          Authorization: `Bearer ${PEGA_MCP_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
        },
      }
    );

    console.log("📦 Available tools:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Failed to list tools:",
      error.response?.data || error.message
    );
    return null;
  }
}

/**
 * List resources available from Pega MCP
 */
async function listPegaResources() {
  try {
    const response = await axios.post(
      PEGA_MCP_URL,
      {
        jsonrpc: "2.0",
        id: 3,
        method: "resources/list",
        params: {},
      },
      {
        headers: {
          Authorization: `Bearer ${PEGA_MCP_TOKEN}`,
          "Content-Type": "application/json",
          Accept: "application/json, text/event-stream",
        },
      }
    );

    console.log("📚 Available resources:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Failed to list resources:",
      error.response?.data || error.message
    );
    return null;
  }
}

/**
 * Health check endpoint
 */
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Pega MCP Client is running on Railway",
    pegaMcpUrl: PEGA_MCP_URL,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Endpoint to initialize Pega MCP
 */
app.post("/api/mcp/initialize", async (req, res) => {
  try {
    const result = await initializePegaMCP();
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Endpoint to list Pega MCP tools
 */
app.get("/api/mcp/tools", async (req, res) => {
  try {
    const tools = await listPegaTools();
    res.json({
      success: true,
      data: tools,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * Endpoint to list Pega MCP resources
 */
app.get("/api/mcp/resources", async (req, res) => {
  try {
    const resources = await listPegaResources();
    res.json({
      success: true,
      data: resources,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * OAuth Callback endpoint
 */
app.get("/oauth/callback", (req, res) => {
  const { code, state, error } = req.query;

  if (error) {
    return res.status(400).json({
      success: false,
      error: error,
      error_description: req.query.error_description,
    });
  }

  if (!code) {
    return res.status(400).json({
      success: false,
      error: "Missing authorization code",
    });
  }

  // Log the authorization code (in production, exchange it for a token)
  console.log("🔐 OAuth callback received:");
  console.log("  Authorization Code:", code);
  console.log("  State:", state);

  res.json({
    success: true,
    message: "Authorization code received",
    code: code,
    state: state,
    instruction:
      "Use this code with your token endpoint to exchange for an access token",
  });
});

/**
 * Configuration endpoint
 */
app.get("/api/config", (req, res) => {
  res.json({
    mcpServers: {
      pega: {
        url: PEGA_MCP_URL,
        configured: !!PEGA_MCP_TOKEN,
      },
    },
    environment: {
      node_env: process.env.NODE_ENV || "production",
      port: PORT,
    },
  });
});

/**
 * Root endpoint with API documentation
 */
app.get("/", (req, res) => {
  res.json({
    name: "Pega MCP Client",
    version: "1.0.0",
    status: "running",
    documentation: {
      health: "GET /health",
      config: "GET /api/config",
      tools: "GET /api/mcp/tools",
      resources: "GET /api/mcp/resources",
      initialize: "POST /api/mcp/initialize",
      oauth_callback: "GET /oauth/callback",
    },
    timestamp: new Date().toISOString(),
  });
});

/**
 * Start the server
 */
app.listen(PORT, () => {
  console.log(`\n🚀 Pega MCP Client running on port ${PORT}`);
  console.log(`📍 Endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/`);
  console.log(`   GET  http://localhost:${PORT}/health`);
  console.log(`   GET  http://localhost:${PORT}/api/config`);
  console.log(`   GET  http://localhost:${PORT}/api/mcp/tools`);
  console.log(`   GET  http://localhost:${PORT}/api/mcp/resources`);
  console.log(`   POST http://localhost:${PORT}/api/mcp/initialize`);
  console.log(`   GET  http://localhost:${PORT}/oauth/callback\n`);

  // Test configuration on startup
  if (!PEGA_MCP_URL || !PEGA_MCP_TOKEN) {
    console.warn(
      "⚠️  Warning: Missing required environment variables. Please check your configuration."
    );
    console.warn(`   PEGA_MCP_URL: ${PEGA_MCP_URL ? "✓" : "✗"}`);
    console.warn(`   PEGA_MCP_TOKEN: ${PEGA_MCP_TOKEN ? "✓" : "✗"}`);
  } else {
    console.log("✅ All required environment variables are configured\n");
  }
});
