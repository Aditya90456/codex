#!/bin/bash

# Backend Deployment Helper Script
# This script helps you deploy the backend to various platforms

echo "🚀 Codex Playground - Backend Deployment Helper"
echo "================================================"
echo ""

# Check if backend-new directory exists
if [ ! -d "backend-new" ]; then
    echo "❌ Error: backend-new directory not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo "Select deployment platform:"
echo "1) Render.com (Recommended - Free tier available)"
echo "2) Railway.app (Fast deployment)"
echo "3) Heroku (Paid only)"
echo "4) Manual setup instructions"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "📦 Deploying to Render.com"
        echo "=========================="
        echo ""
        echo "Steps to deploy:"
        echo "1. Go to https://render.com and sign up/login"
        echo "2. Click 'New +' → 'Web Service'"
        echo "3. Connect your GitHub repository"
        echo "4. Configure:"
        echo "   - Name: codex-backend"
        echo "   - Root Directory: backend-new"
        echo "   - Build Command: npm install"
        echo "   - Start Command: npm start"
        echo ""
        echo "5. Add Environment Variables:"
        echo "   GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc"
        echo "   NODE_ENV=production"
        echo "   PORT=3001"
        read -p "   FRONTEND_URL=" frontend_url
        echo ""
        echo "6. Click 'Create Web Service'"
        echo "7. Wait for deployment (2-3 minutes)"
        echo "8. Copy the service URL and update VITE_API_BASE_URL in Vercel"
        ;;
    2)
        echo ""
        echo "🚂 Deploying to Railway.app"
        echo "==========================="
        echo ""
        echo "Steps to deploy:"
        echo "1. Go to https://railway.app and sign up/login"
        echo "2. Click 'New Project' → 'Deploy from GitHub repo'"
        echo "3. Select your repository"
        echo "4. Add environment variables:"
        echo "   GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc"
        echo "   NODE_ENV=production"
        read -p "   FRONTEND_URL=" frontend_url
        echo ""
        echo "5. Railway will auto-deploy"
        echo "6. Copy the generated URL and update VITE_API_BASE_URL in Vercel"
        ;;
    3)
        echo ""
        echo "🔷 Deploying to Heroku"
        echo "====================="
        echo ""
        
        # Check if Heroku CLI is installed
        if ! command -v heroku &> /dev/null; then
            echo "❌ Heroku CLI not found!"
            echo "Install it from: https://devcenter.heroku.com/articles/heroku-cli"
            exit 1
        fi
        
        echo "Heroku CLI found ✅"
        echo ""
        read -p "Enter your app name (e.g., codex-backend): " app_name
        read -p "Enter your frontend URL: " frontend_url
        
        echo ""
        echo "Creating Heroku app..."
        heroku create $app_name
        
        echo "Setting environment variables..."
        heroku config:set GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc -a $app_name
        heroku config:set NODE_ENV=production -a $app_name
        heroku config:set FRONTEND_URL=$frontend_url -a $app_name
        
        echo ""
        echo "Deploying to Heroku..."
        cd backend-new
        git init
        heroku git:remote -a $app_name
        git add .
        git commit -m "Deploy backend to Heroku"
        git push heroku main
        
        echo ""
        echo "✅ Deployment complete!"
        echo "Your backend URL: https://$app_name.herokuapp.com"
        ;;
    4)
        echo ""
        echo "📖 Manual Setup Instructions"
        echo "============================"
        echo ""
        echo "1. Choose a hosting platform (Render, Railway, Heroku, etc.)"
        echo "2. Create a new web service/app"
        echo "3. Connect your GitHub repository"
        echo "4. Set root directory to: backend-new"
        echo "5. Set build command to: npm install"
        echo "6. Set start command to: npm start"
        echo ""
        echo "7. Add these environment variables:"
        echo "   GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc"
        echo "   NODE_ENV=production"
        echo "   PORT=3001"
        echo "   FRONTEND_URL=<your-vercel-url>"
        echo ""
        echo "8. Deploy and copy the backend URL"
        echo "9. Add VITE_API_BASE_URL=<backend-url> to Vercel environment variables"
        echo "10. Redeploy your frontend"
        ;;
    *)
        echo "❌ Invalid choice!"
        exit 1
        ;;
esac

echo ""
echo "================================================"
echo "📝 Next Steps:"
echo "1. Copy your backend URL"
echo "2. Go to Vercel dashboard → Your Project → Settings → Environment Variables"
echo "3. Add: VITE_API_BASE_URL = <your-backend-url>"
echo "4. Redeploy your frontend"
echo "5. Test the AI features!"
echo ""
echo "Need help? Check AI_DEPLOYMENT_FIX.md for detailed instructions."
echo "================================================"
