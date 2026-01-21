@echo off
echo ========================================
echo   Backend Server Health Check
echo ========================================
echo.

echo Checking if backend is running on port 3001...
echo.

curl -s http://localhost:3001/health

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Backend is running!
    echo.
) else (
    echo.
    echo ✗ Backend is NOT running!
    echo.
    echo To start the backend:
    echo   1. Open a new terminal
    echo   2. Run: cd backend-new
    echo   3. Run: npm start
    echo.
)

echo.
echo Testing AI Generator endpoint...
echo.

curl -s -X POST http://localhost:3001/api/ai/generate ^
  -H "Content-Type: application/json" ^
  -d "{\"prompt\":\"test\",\"outputType\":\"web\"}"

echo.
echo.
pause
