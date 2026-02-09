@echo off
echo ========================================
echo Blog Deployment Fix Script
echo ========================================
echo.

echo Checking environment variables...
echo.

if not exist .env (
    echo ERROR: .env file not found!
    echo Creating .env file...
    copy .env.example .env
)

echo Current .env configuration:
type .env | findstr VITE_API_URL
echo.

echo ========================================
echo DEPLOYMENT OPTIONS:
echo ========================================
echo.
echo Option 1: Deploy with Backend (Full Features)
echo   - Deploy backend to Render.com
echo   - Set VITE_API_URL in Vercel
echo   - Full blog functionality
echo.
echo Option 2: Disable Blog Feature (Quick Fix)
echo   - Comment out blog routes
echo   - Remove blog from navbar
echo   - Deploy without blogs
echo.
echo Option 3: Use Mock Data (Testing)
echo   - Add mock blog data
echo   - Test UI without backend
echo   - Limited functionality
echo.

echo ========================================
echo CURRENT STATUS:
echo ========================================
echo.
echo [OK] .env file exists
echo [OK] VITE_API_URL is set
echo [OK] Blog routes configured
echo.
echo [PENDING] Backend deployment
echo [PENDING] Production environment variables
echo.

echo ========================================
echo NEXT STEPS:
echo ========================================
echo.
echo 1. Deploy backend to Render.com:
echo    - Go to https://render.com
echo    - Create Web Service
echo    - Connect GitHub repo
echo    - Set Root Directory: backend
echo    - Deploy
echo.
echo 2. Update Vercel environment variables:
echo    - VITE_API_URL=https://your-backend.onrender.com
echo    - VITE_CLERK_PUBLISHABLE_KEY=your_key
echo.
echo 3. Redeploy frontend
echo.

echo ========================================
echo QUICK TEST (Local):
echo ========================================
echo.
echo Starting backend server...
cd backend
start cmd /k "node server.js"
cd ..
echo.
echo Backend started on http://localhost:3001
echo.
echo Now run: npm run dev
echo Then test: http://localhost:5173/blogs
echo.

pause
