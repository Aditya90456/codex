@echo off
echo ========================================
echo   Starting Codex Mobile App
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting Expo development server...
echo.
echo Options:
echo - Press 'a' to open on Android emulator
echo - Press 'i' to open on iOS simulator
echo - Scan QR code with Expo Go app on your phone
echo.

call npm start

pause
