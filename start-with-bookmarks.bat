@echo off
echo ========================================
echo   Starting Codex with Bookmarks
echo ========================================
echo.

echo [1/3] Checking backend setup...
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

echo [2/3] Starting backend server...
start "Codex Backend" cmd /k "cd backend && npm start"
timeout /t 3 /nobreak >nul

echo [3/3] Starting frontend...
echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo   Backend:  http://localhost:3001
echo   Frontend: http://localhost:5173
echo ========================================
echo.
echo   Bookmarks Feature:
echo   - Articles: http://localhost:5173/articles
echo   - Bookmarks: http://localhost:5173/bookmarks
echo ========================================
echo.
call npm run dev
