@echo off
title Multi-Language Code Execution - Quick Start
color 0A

echo.
echo ========================================
echo   Multi-Language Code Execution
echo   Quick Start Script
echo ========================================
echo.

echo [STEP 1] Checking backend server...
echo.

curl -s http://localhost:3001/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend server is already running!
    echo.
) else (
    echo [INFO] Backend server is not running.
    echo [INFO] Please start it manually:
    echo.
    echo   cd backend
    echo   node server.js
    echo.
    echo Press any key to continue after starting backend...
    pause >nul
)

echo.
echo [STEP 2] Running comprehensive tests...
echo.

node test-all-languages.js

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Make sure backend is running (cd backend ^&^& node server.js)
echo   2. Start frontend (npm run dev)
echo   3. Open http://localhost:5173/codex-editor
echo   4. Select a language and start coding!
echo.
echo Documentation:
echo   - START_HERE_LANGUAGES.md (Quick start)
echo   - VERIFICATION_CHECKLIST.md (Verify setup)
echo   - MULTI_LANGUAGE_COMPLETE.md (Full docs)
echo.
echo ========================================
echo.
pause
