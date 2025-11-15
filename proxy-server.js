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

// Proxy API requests to dev.flossly.ai
app.use('/api', createProxyMiddleware({
  target: 'https://dev.flossly.ai',
  changeOrigin: true,
  secure: true,
  headers: {
    // Ensure Authorization and other headers are forwarded
    'Accept': 'application/json',
    'Content-Type': 'application/json',
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
