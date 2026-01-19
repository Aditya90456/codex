# Codex Mobile - Setup & Start Guide

## Quick Start (Windows)

### Option 1: Using Batch File (Easiest)
```bash
# Navigate to mobile folder
cd mobile

# Run the startup script
start-mobile.bat
```

### Option 2: Manual Commands
```bash
# Navigate to mobile folder
cd mobile

# Install dependencies (first time only)
npm install

# Start the development server
npm start
```

## Prerequisites

Before starting, make sure you have:

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/

2. **Expo Go App** (for testing on real device)
   - Android: https://play.google.com/store/apps/details?id=host.exp.exponent
   - iOS: https://apps.apple.com/app/expo-go/id982107779

3. **Android Studio** (optional, for Android emulator)
   - Download from: https://developer.android.com/studio

4. **Xcode** (optional, for iOS simulator - Mac only)
   - Download from Mac App Store

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd mobile
npm install
```

This will install:
- React Native
- Expo
- React Navigation
- Clerk (authentication)
- All other dependencies

### 2. Configure Clerk (Optional)

Edit `mobile/App.js` and replace the Clerk key:

```javascript
const CLERK_PUBLISHABLE_KEY = 'your_actual_clerk_key_here';
```

Get your key from: https://dashboard.clerk.com/

### 3. Start Development Server

```bash
npm start
```

You'll see a QR code in the terminal.

### 4. Run on Device/Emulator

**On Real Device (Recommended for beginners):**
1. Install "Expo Go" app on your phone
2. Scan the QR code with:
   - iOS: Camera app
   - Android: Expo Go app
3. App will load on your phone

**On Android Emulator:**
1. Start Android Studio
2. Open AVD Manager
3. Start an emulator
4. Press `a` in the terminal

**On iOS Simulator (Mac only):**
1. Press `i` in the terminal
2. Simulator will open automatically

## Available Commands

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios

# Run on web browser
npm run web
```

## Troubleshooting

### "npm: command not found"
- Install Node.js from https://nodejs.org/

### "Expo Go not connecting"
- Make sure phone and computer are on same WiFi
- Try using tunnel mode: `npm start --tunnel`

### "Module not found" errors
- Delete node_modules and reinstall:
  ```bash
  rmdir /s /q node_modules
  npm install
  ```

### Port already in use
- Kill the process on port 8081:
  ```bash
  npx kill-port 8081
  npm start
  ```

### Android emulator not detected
- Make sure Android Studio is installed
- Open AVD Manager and start an emulator
- Wait for emulator to fully boot before pressing `a`

## Project Structure

```
mobile/
├── App.js                          # Main entry point
├── app.json                        # Expo configuration
├── package.json                    # Dependencies
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js          # Dashboard
│   │   ├── EditorScreen.js        # Editor selector
│   │   ├── DSAScreen.js           # DSA problems
│   │   └── ProfileScreen.js       # User profile
│   └── components/
│       ├── CodexEditorMobile.js   # Codex editor
│       ├── VSCodeEditorMobile.js  # VS Code editor
│       ├── AndroidEditorMobile.js # Android editor
│       └── WebEditorMobile.js     # Web editor
└── start-mobile.bat               # Windows startup script
```

## Features

✅ **4 Code Editors**
- Codex Editor (JavaScript, Python, Java, C++)
- VS Code Style (with file explorer)
- Android Studio (with preview)
- Web Editor (HTML/CSS/JS with live preview)

✅ **DSA 250 Practice**
- 250 curated problems
- Filter by difficulty
- Track progress
- Company tags

✅ **User Profile**
- Stats dashboard
- Achievements
- Settings

✅ **Dark Theme**
- Professional UI
- Smooth animations
- Responsive design

## Development Tips

1. **Hot Reload**: Changes auto-refresh on save
2. **Shake Device**: Opens developer menu
3. **Console Logs**: View in terminal or Expo Go app
4. **Debugging**: Use React Native Debugger

## Building for Production

### Android APK
```bash
expo build:android
```

### iOS IPA (Mac only)
```bash
expo build:ios
```

## Need Help?

- Expo Docs: https://docs.expo.dev/
- React Native Docs: https://reactnative.dev/
- Clerk Docs: https://clerk.com/docs

## Next Steps

1. ✅ Install dependencies
2. ✅ Start development server
3. ✅ Test on device/emulator
4. 🔧 Customize features
5. 🚀 Build for production

Happy coding! 🎉
