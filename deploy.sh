#!/bin/bash

# Bot Builder Deployment Script
echo "🚀 Deploying Bot Builder to production..."

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Copy built files to production directory
    echo "📁 Copying files to production..."
    sudo cp -r dist/* /var/www/bot-builder/
    
    # Set proper permissions
    echo "🔐 Setting permissions..."
    sudo chown -R www-data:www-data /var/www/bot-builder/
    sudo chmod -R 755 /var/www/bot-builder/
    
    echo "✅ Deployment complete!"
    echo "🌐 Your Bot Builder is now live at https://builder.flossly.ai"
    
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
