@echo off
echo ========================================
echo Starting Original Codex Backend
echo ========================================
echo.

cd backend

echo Checking if node_modules exists...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting backend server on port 3001...
echo.
echo Backend will be available at: http://localhost:3001
echo Health check: http://localhost:3001/health
echo.
echo Press Ctrl+C to stop the server
echo.

call npm start
