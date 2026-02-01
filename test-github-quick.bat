@echo off
echo.
echo ========================================
echo   GitHub Integration Quick Test
echo ========================================
echo.

echo Checking if backend is running...
curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ❌ Backend is NOT running!
    echo.
    echo Starting backend now...
    echo.
    start cmd /k "cd backend && npm start"
    echo Waiting 5 seconds for backend to start...
    timeout /t 5 /nobreak >nul
)

echo.
echo ✅ Backend is running!
echo.
echo Testing GitHub integration...
echo.

node test-github-integration.js

echo.
echo ========================================
echo   Test Complete!
echo ========================================
echo.
pause
