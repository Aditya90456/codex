@echo off
echo ========================================
echo Automatic GitHub Integration Setup
echo ========================================
echo.

echo Step 1: Installing dependencies...
cd backend
call npm install @octokit/rest
echo.

echo ========================================
echo Step 2: Setup Instructions
echo ========================================
echo.
echo 1. Get GitHub Token:
echo    https://github.com/settings/tokens
echo    - Click "Generate new token (classic)"
echo    - Check "repo" scope
echo    - Copy the token
echo.
echo 2. Add token to backend/.env:
echo    GITHUB_TOKEN=ghp_your_token_here
echo.
echo 3. Start backend:
echo    cd backend
echo    npm start
echo.
echo 4. Connect in app:
echo    - Open http://localhost:5173/playground
echo    - Click GitHub button
echo    - Enter your GitHub username
echo.
echo 5. Test:
echo    - Solve a problem
echo    - Submit
echo    - Watch it sync automatically!
echo.
echo ========================================
echo Opening .env file for you...
echo ========================================
echo.

if exist .env (
    notepad .env
) else (
    echo Creating .env file...
    echo GEMINI_API_KEY=AIzaSyDPblUGrO9vgzKfSNP4uDbt6htpr9_zxTc > .env
    echo PORT=3001 >> .env
    echo FRONTEND_URL=http://localhost:5173 >> .env
    echo NODE_ENV=development >> .env
    echo. >> .env
    echo # Add your GitHub token below: >> .env
    echo GITHUB_TOKEN=ghp_your_token_here >> .env
    notepad .env
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next: Add your GitHub token to .env and restart backend
echo.
pause
