@echo off
echo ========================================
echo Vercel Deployment Helper
echo ========================================
echo.

echo This script will help you deploy to Vercel
echo.

echo Step 1: Check if Vercel CLI is installed...
where vercel >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Vercel CLI not found!
    echo.
    echo Installing Vercel CLI...
    npm install -g vercel
    echo.
)

echo ✅ Vercel CLI is installed
echo.

echo Step 2: Check environment variables...
if not exist .env.production (
    echo ⚠️ .env.production not found!
    echo Creating template...
    echo VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key > .env.production
    echo VITE_API_URL=https://your-backend.onrender.com >> .env.production
    echo VITE_GEMINI_API_KEY=your_gemini_key >> .env.production
    echo.
    echo ⚠️ Please edit .env.production with your actual values!
    echo.
    pause
)

echo.
echo ========================================
echo DEPLOYMENT CHECKLIST
echo ========================================
echo.
echo Before deploying, make sure:
echo.
echo Backend:
echo [ ] Backend deployed to Render/Railway
echo [ ] Backend URL copied
echo [ ] CORS configured with Vercel domain
echo.
echo Environment Variables:
echo [ ] VITE_CLERK_PUBLISHABLE_KEY ready
echo [ ] VITE_API_URL ready (backend URL)
echo [ ] VITE_GEMINI_API_KEY ready (optional)
echo.
echo Clerk:
echo [ ] Vercel domain added to Clerk
echo [ ] Redirect URLs updated
echo.

echo ========================================
echo DEPLOYMENT OPTIONS
echo ========================================
echo.
echo 1. Deploy to Preview (test deployment)
echo 2. Deploy to Production
echo 3. Add Environment Variables
echo 4. View Deployment Logs
echo 5. Cancel
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" goto preview
if "%choice%"=="2" goto production
if "%choice%"=="3" goto envvars
if "%choice%"=="4" goto logs
if "%choice%"=="5" goto end

:preview
echo.
echo ========================================
echo Deploying to Preview...
echo ========================================
echo.
vercel
goto end

:production
echo.
echo ========================================
echo Deploying to Production...
echo ========================================
echo.
echo ⚠️ This will deploy to your production domain!
echo.
set /p confirm="Are you sure? (y/n): "
if /i "%confirm%"=="y" (
    vercel --prod
) else (
    echo Deployment cancelled.
)
goto end

:envvars
echo.
echo ========================================
echo Adding Environment Variables
echo ========================================
echo.
echo Adding VITE_CLERK_PUBLISHABLE_KEY...
vercel env add VITE_CLERK_PUBLISHABLE_KEY
echo.
echo Adding VITE_API_URL...
vercel env add VITE_API_URL
echo.
echo Adding VITE_GEMINI_API_KEY...
vercel env add VITE_GEMINI_API_KEY
echo.
echo ✅ Environment variables added!
echo.
echo Remember to select all environments:
echo - Production
echo - Preview
echo - Development
echo.
goto end

:logs
echo.
echo ========================================
echo Viewing Deployment Logs
echo ========================================
echo.
vercel logs
goto end

:end
echo.
echo ========================================
echo NEXT STEPS
echo ========================================
echo.
echo 1. Go to Vercel Dashboard: https://vercel.com/dashboard
echo 2. Check your deployment status
echo 3. Add environment variables if not done
echo 4. Test your site
echo 5. Update Clerk with Vercel domain
echo.
echo ========================================
echo USEFUL COMMANDS
echo ========================================
echo.
echo vercel                  - Deploy to preview
echo vercel --prod           - Deploy to production
echo vercel env add NAME     - Add environment variable
echo vercel logs             - View logs
echo vercel domains          - Manage domains
echo.
echo For detailed guide, see: VERCEL_DEPLOYMENT_GUIDE.md
echo.
pause
