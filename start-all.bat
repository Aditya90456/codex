@echo off
echo ========================================
echo   Codex Playground - Full Stack Startup
echo ========================================
echo.
echo Starting Backend Server...
echo.

cd backend-new

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing backend dependencies...
    call npm install
    echo.
)

echo Backend will run on http://localhost:3001
echo.
echo Starting server...
echo.

start cmd /k "node server.js"

echo.
echo Backend started in new window!
echo.
echo Now start the frontend with: npm run dev
echo.
pause
