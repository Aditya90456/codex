@echo off
echo ========================================
echo Multi-Language Execution Quick Test
echo ========================================
echo.

echo Checking if backend is running...
curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Backend server is NOT running!
    echo.
    echo Please start the backend server first:
    echo   cd backend
    echo   node server.js
    echo.
    pause
    exit /b 1
)

echo [OK] Backend server is running!
echo.
echo Running comprehensive language tests...
echo.

node test-all-languages.js

echo.
echo ========================================
echo Test Complete!
echo ========================================
echo.
pause
