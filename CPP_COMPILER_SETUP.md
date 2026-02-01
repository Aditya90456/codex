# 🔧 C++ Compiler Setup for Windows

## ❌ Error You're Seeing

```
Compilation Error: 'g++' is not recognized as an internal or external command
```

This means you don't have a C++ compiler installed on your Windows system.

## ✅ Quick Fix - Use JavaScript or Python Instead!

While you install C++, you can use these languages that work right now:
- ✅ **JavaScript** - Already working
- ✅ **Python** - Already working  
- ✅ **Java** - Already working (if JDK installed)
- ❌ **C++** - Needs g++ compiler (see below)

## 📥 Installing C++ Compiler on Windows

### Option 1: MinGW-w64 (Recommended - Lightweight)

**Step 1: Download**
- Go to: https://sourceforge.net/projects/mingw-w64/files/
- Download: `x86_64-posix-seh` (latest version)
- Or direct link: https://github.com/niXman/mingw-builds-binaries/releases

**Step 2: Install**
1. Extract the downloaded file (e.g., to `C:\mingw64`)
2. You should have: `C:\mingw64\bin\g++.exe`

**Step 3: Add to PATH**
1. Press `Win + X` → System
2. Click "Advanced system settings"
3. Click "Environment Variables"
4. Under "System variables", find "Path"
5. Click "Edit" → "New"
6. Add: `C:\mingw64\bin`
7. Click OK on all windows

**Step 4: Verify**
```bash
# Open NEW terminal (important!)
g++ --version
```

You should see:
```
g++ (x86_64-posix-seh-rev0, Built by MinGW-W64 project) 8.1.0
```

### Option 2: MSYS2 (Easier Installation)

**Step 1: Download MSYS2**
- Go to: https://www.msys2.org/
- Download and run the installer

**Step 2: Install g++**
1. Open MSYS2 terminal
2. Run:
```bash
pacman -Syu
pacman -S mingw-w64-x86_64-gcc
```

**Step 3: Add to PATH**
Add to your system PATH: `C:\msys64\mingw64\bin`

**Step 4: Verify**
```bash
g++ --version
```

### Option 3: Visual Studio Build Tools (Full Featured)

**Step 1: Download**
- Go to: https://visualstudio.microsoft.com/downloads/
- Download "Build Tools for Visual Studio 2022"

**Step 2: Install**
1. Run installer
2. Select "Desktop development with C++"
3. Install (requires ~7GB)

**Step 3: Use Developer Command Prompt**
- Search for "Developer Command Prompt for VS 2022"
- Use `cl` instead of `g++` (different compiler)

**Note:** This option requires modifying the backend code to use `cl` instead of `g++`.

### Option 4: Chocolatey (Package Manager)

If you have Chocolatey installed:

```bash
choco install mingw
```

Then add to PATH: `C:\ProgramData\chocolatey\lib\mingw\tools\install\mingw64\bin`

## 🔄 After Installation

**1. Restart Everything**
- Close all terminals
- Close VS Code / your IDE
- Restart backend server

**2. Verify Installation**
```bash
g++ --version
```

**3. Test in Your App**
- Go to LeetCode editor
- Select "C++" language
- Try running code
- Should work now! 🎉

## 🧪 Quick Test

Create a test file `test.cpp`:
```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "C++ is working!" << endl;
    return 0;
}
```

Compile and run:
```bash
g++ test.cpp -o test
test.exe
```

Should output: `C++ is working!`

## 🚀 Restart Backend

After installing g++, restart your backend:

```bash
# Stop current backend (Ctrl+C)
cd backend
npm start
```

## 🎯 Recommended: MinGW-w64

For most users, **MinGW-w64** is the best choice:
- ✅ Lightweight (~100MB)
- ✅ Fast installation
- ✅ Works with existing code
- ✅ No Visual Studio needed

## 📝 PATH Setup Visual Guide

```
Windows Search → "Environment Variables"
↓
System Properties → Environment Variables
↓
System Variables → Path → Edit
↓
New → C:\mingw64\bin
↓
OK → OK → OK
↓
Restart Terminal
```

## ❓ Troubleshooting

### "g++ still not recognized"
- Did you restart your terminal?
- Did you add the correct path? (should end with `\bin`)
- Check PATH: `echo %PATH%` (should include mingw64\bin)

### "Permission denied"
- Run terminal as Administrator
- Check antivirus isn't blocking

### "Cannot find -lstdc++"
- Reinstall MinGW-w64
- Make sure you downloaded the complete package

### Still not working?
Use JavaScript or Python for now! They work perfectly and are often faster for LeetCode problems.

## 🎨 Alternative: Use Online Compiler

If installation is too complex, you can:
1. Write C++ code in the editor
2. Copy it
3. Test on: https://www.onlinegdb.com/online_c++_compiler
4. Come back and submit

## 💡 Pro Tip

Most LeetCode problems can be solved in any language. JavaScript and Python are often:
- ✅ Easier to write
- ✅ Faster to test
- ✅ More readable
- ✅ No compilation needed

Consider using them instead of C++!

## ✅ Success Checklist

- [ ] Downloaded MinGW-w64 or MSYS2
- [ ] Extracted/Installed to C:\mingw64 or C:\msys64
- [ ] Added bin folder to PATH
- [ ] Restarted terminal
- [ ] Verified with `g++ --version`
- [ ] Restarted backend server
- [ ] Tested C++ code in LeetCode editor

## 🎉 You're Ready!

Once g++ is installed and in PATH, C++ code execution will work perfectly in your LeetCode editor!

---

**Quick Links:**
- MinGW-w64: https://sourceforge.net/projects/mingw-w64/
- MSYS2: https://www.msys2.org/
- VS Build Tools: https://visualstudio.microsoft.com/downloads/
- Online C++ Compiler: https://www.onlinegdb.com/online_c++_compiler
