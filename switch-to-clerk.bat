@echo off
echo Switching to Clerk-based App...

REM Backup current App.jsx
copy src\App.jsx src\App-Backup.jsx

REM Replace with Clerk version
copy src\App-ClerkNew.jsx src\App.jsx

echo ✅ Switched to Clerk-based authentication app
echo 📝 Original app backed up as App-Backup.jsx
echo 🔐 This version includes:
echo    - User authentication with Clerk
echo    - Protected routes
echo    - Sign in/Sign up pages
echo    - Resume creator (protected)
echo.
echo To switch back, run: switch-to-regular.bat
pause