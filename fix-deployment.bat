@echo off
REM Deployment Fix Script for Codex Playground (Windows)
REM Run this script to fix common deployment issues

echo ========================================
echo Codex Playground - Deployment Fix Script
echo ========================================
echo.

REM Check Node version
echo Checking Node.js version...
node -v
echo.

REM Clean install
echo Cleaning old dependencies...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
echo Cleaned
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
echo Dependencies installed
echo.

REM Check for environment variables
echo Checking environment variables...
if exist .env (
    echo .env file found
    findstr "VITE_CLERK_PUBLISHABLE_KEY" .env >nul
    if %errorlevel% equ 0 (
        echo VITE_CLERK_PUBLISHABLE_KEY found
    ) else (
        echo WARNING: VITE_CLERK_PUBLISHABLE_KEY missing
    )
    
    findstr "VITE_BACKEND_URL" .env >nul
    if %errorlevel% equ 0 (
        echo VITE_BACKEND_URL found
    ) else (
        echo WARNING: VITE_BACKEND_URL missing
    )
) else (
    echo WARNING: .env file not found
    if exist .env.example (
        echo Creating .env from .env.example...
        copy .env.example .env
        echo Created .env file - please fill in your values
    )
)
echo.

REM Test build
echo Testing production build...
call npm run build

if %errorlevel% equ 0 (
    echo Build successful!
    echo.
    echo Build output:
    dir dist
    echo.
    echo Deployment ready!
    echo.
    echo Next steps:
    echo 1. Push to GitHub
    echo 2. Deploy to Vercel
    echo 3. Set environment variables in Vercel dashboard
    echo 4. Test all routes after deployment
) else (
    echo Build failed!
    echo Check the error messages above
    exit /b 1
)

pause
