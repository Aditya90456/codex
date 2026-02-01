@echo off
echo.
echo ========================================
echo   C++ Compiler Setup Helper
echo ========================================
echo.

echo Checking if g++ is already installed...
g++ --version >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo ✅ g++ is already installed!
    echo.
    g++ --version
    echo.
    echo You're all set! Restart your backend server.
    pause
    exit /b 0
)

echo.
echo ❌ g++ is NOT installed
echo.
echo 📥 Installation Options:
echo.
echo 1. MinGW-w64 (Recommended - Lightweight)
echo    Download: https://sourceforge.net/projects/mingw-w64/
echo    Or: https://github.com/niXman/mingw-builds-binaries/releases
echo.
echo 2. MSYS2 (Easier)
echo    Download: https://www.msys2.org/
echo    Then run: pacman -S mingw-w64-x86_64-gcc
echo.
echo 3. Chocolatey (If you have it)
echo    Run: choco install mingw
echo.
echo 4. Visual Studio Build Tools (Full Featured)
echo    Download: https://visualstudio.microsoft.com/downloads/
echo.
echo ========================================
echo.

choice /C 123 /M "Which option do you want to try"

if errorlevel 3 goto vs
if errorlevel 2 goto msys2
if errorlevel 1 goto mingw

:mingw
echo.
echo Opening MinGW-w64 download page...
start https://github.com/niXman/mingw-builds-binaries/releases
echo.
echo 📝 After downloading:
echo 1. Extract to C:\mingw64
echo 2. Add C:\mingw64\bin to PATH
echo 3. Restart terminal
echo 4. Run this script again to verify
echo.
echo See CPP_COMPILER_SETUP.md for detailed instructions
pause
exit /b 0

:msys2
echo.
echo Opening MSYS2 download page...
start https://www.msys2.org/
echo.
echo 📝 After installing MSYS2:
echo 1. Open MSYS2 terminal
echo 2. Run: pacman -Syu
echo 3. Run: pacman -S mingw-w64-x86_64-gcc
echo 4. Add C:\msys64\mingw64\bin to PATH
echo 5. Restart terminal
echo 6. Run this script again to verify
echo.
echo See CPP_COMPILER_SETUP.md for detailed instructions
pause
exit /b 0

:vs
echo.
echo Opening Visual Studio Build Tools page...
start https://visualstudio.microsoft.com/downloads/
echo.
echo 📝 After downloading:
echo 1. Run installer
echo 2. Select "Desktop development with C++"
echo 3. Install (requires ~7GB)
echo 4. Use Developer Command Prompt
echo.
echo Note: This requires backend code modification to use 'cl' instead of 'g++'
echo.
echo See CPP_COMPILER_SETUP.md for detailed instructions
pause
exit /b 0
