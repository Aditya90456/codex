#!/bin/bash

# Deployment Fix Script for Codex Playground
# Run this script to fix common deployment issues

echo "🔧 Codex Playground - Deployment Fix Script"
echo "==========================================="
echo ""

# Check Node version
echo "📦 Checking Node.js version..."
node_version=$(node -v)
echo "Current Node version: $node_version"

if [[ "$node_version" < "v18" ]]; then
    echo "⚠️  Warning: Node.js 18+ recommended"
fi
echo ""

# Clean install
echo "🧹 Cleaning old dependencies..."
rm -rf node_modules
rm -f package-lock.json
echo "✅ Cleaned"
echo ""

# Install dependencies
echo "📥 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Check for environment variables
echo "🔍 Checking environment variables..."
if [ -f .env ]; then
    echo "✅ .env file found"
    
    # Check for required variables
    if grep -q "VITE_CLERK_PUBLISHABLE_KEY" .env; then
        echo "✅ VITE_CLERK_PUBLISHABLE_KEY found"
    else
        echo "⚠️  VITE_CLERK_PUBLISHABLE_KEY missing"
    fi
    
    if grep -q "VITE_BACKEND_URL" .env; then
        echo "✅ VITE_BACKEND_URL found"
    else
        echo "⚠️  VITE_BACKEND_URL missing"
    fi
else
    echo "⚠️  .env file not found"
    echo "Creating .env from .env.example..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Created .env file - please fill in your values"
    fi
fi
echo ""

# Test build
echo "🏗️  Testing production build..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "📊 Build output:"
    ls -lh dist/
    echo ""
    echo "🎉 Deployment ready!"
    echo ""
    echo "Next steps:"
    echo "1. Push to GitHub"
    echo "2. Deploy to Vercel"
    echo "3. Set environment variables in Vercel dashboard"
    echo "4. Test all routes after deployment"
else
    echo "❌ Build failed!"
    echo "Check the error messages above"
    exit 1
fi
