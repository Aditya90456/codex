@echo off
echo Cleaning cache and restarting development server...
echo.

REM Kill any existing dev server
taskkill /f /im node.exe 2>nul

REM Clear npm cache
echo Clearing npm cache...
npm cache clean --force

REM Remove node_modules and reinstall (optional - uncomment if needed)
REM echo Removing node_modules...
REM rmdir /s /q node_modules
REM echo Reinstalling dependencies...
REM npm install

REM Clear Vite cache
echo Clearing Vite cache...
rmdir /s /q node_modules\.vite 2>nul

echo.
echo Starting development server with clean cache...
echo Press Ctrl+C to stop the server
echo.
npm run dev