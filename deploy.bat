@echo off
echo 🚀 Starting Codex deployment process...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    exit /b 1
)

REM Install dependencies for frontend
echo 📦 Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Error: Failed to install frontend dependencies
    exit /b 1
)

REM Install dependencies for backend
echo 📦 Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ❌ Error: Failed to install backend dependencies
    exit /b 1
)
cd ..

REM Build frontend
echo 🏗️ Building frontend...
call npm run build
if errorlevel 1 (
    echo ❌ Error: Frontend build failed
    exit /b 1
)

REM Check if build was successful
if not exist "dist" (
    echo ❌ Error: Frontend build failed. dist directory not found.
    exit /b 1
)

echo ✅ Build completed successfully!

REM Create production environment file for backend
echo ⚙️ Setting up production environment...
(
echo NODE_ENV=production
echo PORT=^%PORT^%
echo FRONTEND_URL=^%FRONTEND_URL^%
echo JWT_SECRET=^%JWT_SECRET^%
echo BCRYPT_ROUNDS=12
echo RATE_LIMIT_POINTS=100
echo RATE_LIMIT_DURATION=60
echo CODE_TIMEOUT=5000
echo MAX_CODE_LENGTH=10000
) > backend\.env.production

echo 📋 Deployment checklist:
echo ✅ Frontend dependencies installed
echo ✅ Backend dependencies installed
echo ✅ Frontend built successfully
echo ✅ Production environment configured

echo.
echo 🌐 Next steps for Render.com deployment:
echo 1. Push your code to GitHub/GitLab
echo 2. Connect your repository to Render.com
echo 3. Create two services:
echo.
echo 📱 Frontend Service:
echo    - Type: Static Site
echo    - Build Command: npm install ^&^& npm run build
echo    - Publish Directory: dist
echo.
echo 🔧 Backend Service:
echo    - Type: Web Service
echo    - Root Directory: backend
echo    - Build Command: npm install
echo    - Start Command: node server.js
echo    - Environment Variables:
echo      * NODE_ENV=production
echo      * JWT_SECRET=[generate-secure-key]
echo      * FRONTEND_URL=[your-frontend-url]
echo.
echo 🎉 Deployment preparation completed!
echo ✨ Ready for deployment to Render.com!

pause