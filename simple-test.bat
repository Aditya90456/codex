@echo off
echo ========================================
echo   BACKEND AI TEST
echo ========================================
echo.

echo Testing Health Check...
curl -s http://localhost:3001/health
echo.
echo.

echo Testing AI Health...
curl -s http://localhost:3001/api/ai/health
echo.
echo.

echo Testing AI Chat...
curl -s -X POST http://localhost:3001/api/ai/chat -H "Content-Type: application/json" -d "{\"message\":\"Hello!\"}"
echo.
echo.

echo ========================================
echo   TESTS COMPLETE
echo ========================================
pause
