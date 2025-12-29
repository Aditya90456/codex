@echo off
echo Starting Codex Playground...
echo.

echo Installing frontend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Starting backend server...
start "Codex Backend" cmd /k "npm run dev"

echo.
echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

cd ..
echo Starting frontend development server...
start "Codex Frontend" cmd /k "npm run dev"

echo.
echo Codex Playground is starting up!
echo Frontend: http://localhost:5173
echo Backend: http://localhost:3001
echo.
echo Press any key to exit this window...
pause > nul