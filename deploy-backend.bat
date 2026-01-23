@echo off
REM Backend Deployment Helper Script for Windows
REM This script helps you deploy the backend to various platforms

echo.
echo ========================================
echo Codex Playground - Backend Deployment
echo ========================================
echo.

REM Check if backend-new directory exists
if not exist "backend-new" (
    echo Error: backend-new directory not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

echo Select deployment platform:
echo 1. Render.com (Recommended - Free tier available)
echo 2. Railway.app (Fast deployment)
echo 3. Manual setup instructions
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto render
if "%choice%"=="2" goto railway
if "%choice%"=="3" goto manual
goto invalid

:render
echo.
echo ========================================
echo Deploying to Render.com
echo ========================================
echo.
echo Steps to deploy:
echo 1. Go to https://render.com and sign up/login
echo 2. Click 'New +' -^> 'Web Service'
echo 3. Connect your GitHub repository
echo 4. Configure:
echo    - Name: codex-backend
echo    - Root Directory: backend-new
echo    - Build Command: npm install
echo    - Start Command: npm start
echo.
echo 5. Add Environment Variables:
echo    GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
echo    NODE_ENV=production
echo    PORT=3001
set /p frontend_url="   FRONTEND_URL="
echo.
echo 6. Click 'Create Web Service'
echo 7. Wait for deployment (2-3 minutes)
echo 8. Copy the service URL and update VITE_API_BASE_URL in Vercel
goto end

:railway
echo.
echo ========================================
echo Deploying to Railway.app
echo ========================================
echo.
echo Steps to deploy:
echo 1. Go to https://railway.app and sign up/login
echo 2. Click 'New Project' -^> 'Deploy from GitHub repo'
echo 3. Select your repository
echo 4. Add environment variables:
echo    GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
echo    NODE_ENV=production
set /p frontend_url="   FRONTEND_URL="
echo.
echo 5. Railway will auto-deploy
echo 6. Copy the generated URL and update VITE_API_BASE_URL in Vercel
goto end

:manual
echo.
echo ========================================
echo Manual Setup Instructions
echo ========================================
echo.
echo 1. Choose a hosting platform (Render, Railway, Heroku, etc.)
echo 2. Create a new web service/app
echo 3. Connect your GitHub repository
echo 4. Set root directory to: backend-new
echo 5. Set build command to: npm install
echo 6. Set start command to: npm start
echo.
echo 7. Add these environment variables:
echo    GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc
echo    NODE_ENV=production
echo    PORT=3001
echo    FRONTEND_URL=^<your-vercel-url^>
echo.
echo 8. Deploy and copy the backend URL
echo 9. Add VITE_API_BASE_URL=^<backend-url^> to Vercel environment variables
echo 10. Redeploy your frontend
goto end

:invalid
echo.
echo Error: Invalid choice!
pause
exit /b 1

:end
echo.
echo ========================================
echo Next Steps:
echo ========================================
echo 1. Copy your backend URL
echo 2. Go to Vercel dashboard -^> Your Project -^> Settings -^> Environment Variables
echo 3. Add: VITE_API_BASE_URL = ^<your-backend-url^>
echo 4. Redeploy your frontend
echo 5. Test the AI features!
echo.
echo Need help? Check AI_DEPLOYMENT_FIX.md for detailed instructions.
echo ========================================
echo.
pause
