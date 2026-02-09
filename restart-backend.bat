@echo off
echo ========================================
echo   Restarting Backend Server
echo ========================================
echo.

echo Stopping any running backend processes...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":3001" ^| find "LISTENING"') do (
    echo Killing process %%a
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo Starting backend server...
cd backend
start "Codex Backend" cmd /k "npm start"

echo.
echo ========================================
echo   Backend Server Restarted!
echo ========================================
echo   URL: http://localhost:3001
echo   Health: http://localhost:3001/health
echo   Bookmarks API: http://localhost:3001/api/bookmarks
echo ========================================
echo.
echo Test the bookmarks API:
echo   node test-bookmarks-api.js
echo.
pause
