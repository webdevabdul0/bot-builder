const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors({
  origin: ['https://builder.flossly.ai', 'http://localhost:5173'],
  credentials: true
}));

// Parse JSON bodies so we can read req.body in the router
app.use(express.json());

// Proxy API requests - dynamically route based on token environment
app.use('/api', createProxyMiddleware({
  target: 'https://dev.flossly.ai', // Default fallback
  changeOrigin: true,
  secure: true,
  headers: {
    // Ensure Authorization and other headers are forwarded
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  router: (req) => {
    // For auth/exchangeShortToken, decode the SHORT token to determine environment
    if (req.url.includes('/auth/exchangeShortToken') && req.body?.shortToken) {
      try {
        // Decode JWT without verification (just to read the payload)
        const payload = JSON.parse(
          Buffer.from(req.body.shortToken.split('.')[1], 'base64').toString()
        );
        
        // Route based on environment field in token
        if (payload.environment === 'production') {
          console.log('🔵 Routing to PRODUCTION API: https://app.flossly.ai');
          return 'https://app.flossly.ai';
        } else {
          console.log('🟢 Routing to DEV API: https://dev.flossly.ai');
          return 'https://dev.flossly.ai';
        }
      } catch (error) {
        console.error('Failed to decode short token, using default dev.flossly.ai:', error.message);
      }
    }
    
    // For other auth requests (like /auth/profile), decode the ACCESS token from Authorization header
    if (req.url.includes('/auth/') && req.headers.authorization) {
      try {
        // Extract token from "Bearer <token>"
        const accessToken = req.headers.authorization.replace('Bearer ', '');
        
        // Decode JWT without verification (just to read the payload)
        const payload = JSON.parse(
          Buffer.from(accessToken.split('.')[1], 'base64').toString()
        );
        
        // Route based on environment field in token
        if (payload.environment === 'production') {
          console.log('🔵 Routing to PRODUCTION API (from access token): https://app.flossly.ai');
          return 'https://app.flossly.ai';
        } else {
          console.log('🟢 Routing to DEV API (from access token): https://dev.flossly.ai');
          return 'https://dev.flossly.ai';
        }
      } catch (error) {
        console.error('Failed to decode access token, using default dev.flossly.ai:', error.message);
      }
    }
    
    // For other requests, use environment variable or default to dev
    const apiBase = process.env.FLOSSLY_API_BASE || 'https://dev.flossly.ai';
    console.log(`🔄 Routing to: ${apiBase}`);
    return apiBase;
  },
  onProxyReq: (proxyReq, req, res) => {
    // Forward Authorization header if present
    if (req.headers.authorization) {
      proxyReq.setHeader('Authorization', req.headers.authorization);
    }
    console.log(`Proxying ${req.method} ${req.url} to ${proxyReq.getHeader('host')}${proxyReq.path}`);
    console.log(`Headers: Authorization=${req.headers.authorization ? 'present' : 'missing'}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Response: ${proxyRes.statusCode} for ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error(`Proxy error for ${req.url}:`, err.message);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  }
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 CORS Proxy Server running on port ${PORT}`);
  console.log(`📡 Proxying API requests to https://dev.flossly.ai`);
  console.log(`🌐 Accessible from: https://builder.flossly.ai`);
});
