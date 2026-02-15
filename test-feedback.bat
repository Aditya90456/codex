@echo off
echo.
echo ========================================
echo   Testing Feedback Email System
echo ========================================
echo.

cd backend
node test-feedback-email.cjs
cd ..

echo.
pause
