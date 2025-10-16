#!/bin/bash

# Bot Builder Deployment Script with Proxy Server
echo "🚀 Deploying Bot Builder with CORS Proxy to production..."

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Create logs directory
    echo "📁 Creating logs directory..."
    mkdir -p logs
    
    # Install production dependencies
    echo "📦 Installing production dependencies..."
    npm install --production
    
    # Start/restart the server with PM2
    echo "🔄 Starting/restarting server..."
    pm2 stop bot-builder 2>/dev/null || true
    pm2 start ecosystem.config.js
    pm2 save
    
    echo "✅ Deployment complete!"
    echo "🌐 Your Bot Builder is now live at https://builder.flossly.ai"
    echo "📡 API requests are proxied to https://dev.flossly.ai"
    echo "🔍 Check logs with: pm2 logs bot-builder"
    echo "🔍 Check status with: pm2 status"
    
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
