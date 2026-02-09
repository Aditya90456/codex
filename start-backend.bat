@echo off
echo ========================================
echo Starting Backend Server for Blog Platform
echo ========================================
echo.

cd backend

echo Checking if server.js exists...
if not exist server.js (
    echo ERROR: server.js not found in backend folder!
    pause
    exit /b 1
)

echo.
echo Starting server on port 3001...
echo.
echo Backend will be available at: http://localhost:3001
echo Blog API endpoint: http://localhost:3001/api/blogs
echo.
echo Press Ctrl+C to stop the server
echo.
echo ========================================
echo.

node server.js

pause
