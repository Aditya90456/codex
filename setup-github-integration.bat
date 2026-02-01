@echo off
echo ========================================
echo GitHub Integration Setup
echo ========================================
echo.

echo Installing backend dependencies...
cd backend
call npm install @octokit/rest
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Get your GitHub Personal Access Token from:
echo    https://github.com/settings/tokens
echo.
echo 2. Add it to backend/.env:
echo    GITHUB_TOKEN=your_token_here
echo.
echo 3. Start the backend:
echo    cd backend
echo    npm start
echo.
echo 4. Connect GitHub in the app:
echo    - Open /playground
echo    - Click Settings
echo    - Connect GitHub
echo.
echo See GITHUB_INTEGRATION_GUIDE.md for full instructions
echo.
pause
