@echo off
echo ========================================
echo Starting Complete Blog Platform
echo ========================================
echo.

echo This will start:
echo 1. Backend Server (Port 3001)
echo 2. Frontend Dev Server (Port 5173)
echo.
echo Press any key to continue...
pause > nul

echo.
echo ========================================
echo Starting Backend Server...
echo ========================================
echo.

cd backend
start "Backend Server" cmd /k "echo Backend Server Running on http://localhost:3001 && node server.js"
cd ..

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo ========================================
echo Starting Frontend Dev Server...
echo ========================================
echo.

start "Frontend Dev Server" cmd /k "echo Frontend Running on http://localhost:5173 && npm run dev"

echo.
echo ========================================
echo SERVERS STARTED!
echo ========================================
echo.
echo Backend:  http://localhost:3001
echo Frontend: http://localhost:5173
echo Blogs:    http://localhost:5173/blogs
echo.
echo Two command windows have opened:
echo 1. Backend Server (Port 3001)
echo 2. Frontend Dev Server (Port 5173)
echo.
echo To stop servers: Close both command windows
echo.
echo ========================================
echo.
echo Opening browser in 5 seconds...
timeout /t 5 /nobreak > nul

start http://localhost:5173/blogs

echo.
echo Done! Check the browser.
echo.
pause
