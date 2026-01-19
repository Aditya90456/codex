# Codex Mobile App

A complete mobile application for Codex with all editors (Codex, VSCode, Android, Web) and DSA 250 problems.

## Features

- **Multiple Code Editors**
  - Codex Editor: Modern code editor with syntax highlighting
  - VS Code Style: VS Code inspired interface with file explorer
  - Android Studio: Android app development with preview
  - Web Editor: HTML/CSS/JavaScript playground with live preview

- **DSA 250 Practice**
  - 250 curated DSA problems
  - Track solved problems
  - Filter by difficulty
  - Company tags

- **User Profile**
  - Track progress and stats
  - Achievements system
  - Settings and preferences

## Setup Instructions

### 1. Install Dependencies

```bash
cd mobile
npm install
```

### 2. Configure Clerk Authentication

Update `App.js` with your Clerk publishable key:

```javascript
const CLERK_PUBLISHABLE_KEY = 'your_clerk_publishable_key_here';
```

### 3. Run the App

**For Android:**
```bash
npm run android
```

**For iOS:**
```bash
npm run ios
```

**For Web:**
```bash
npm run web
```

**Start Development Server:**
```bash
npm start
```

## Project Structure

```
mobile/
├── App.js                          # Main app with navigation
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js          # Home dashboard
│   │   ├── EditorScreen.js        # Editor selector
│   │   ├── DSAScreen.js           # DSA problems list
│   │   └── ProfileScreen.js       # User profile
│   └── components/
│       ├── CodexEditorMobile.js   # Codex editor
│       ├── VSCodeEditorMobile.js  # VS Code style editor
│       ├── AndroidEditorMobile.js # Android Studio editor
│       └── WebEditorMobile.js     # Web playground
└── package.json
```

## Technologies Used

- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation library
- **Clerk** - Authentication
- **Ionicons** - Icon library
- **WebView** - For web preview

## Features by Screen

### Home Screen
- Welcome message
- Quick stats (problems solved, streak)
- Feature cards
- Quick action buttons

### Editor Screen
- 4 different editors to choose from
- Full-screen editor experience
- Syntax highlighting
- Code execution
- Output console

### DSA Screen
- 250 problems list
- Difficulty filters
- Progress tracking
- Problem details
- Company tags

### Profile Screen
- User information
- Statistics dashboard
- Achievements
- Settings menu
- Sign out

## Development

### Adding New Problems

Edit the problems array in `src/screens/DSAScreen.js`:

```javascript
const problems = [
  {
    id: 1,
    title: 'Problem Title',
    difficulty: 'Easy', // Easy, Medium, Hard
    category: 'Arrays',
    companies: ['Google', 'Amazon']
  },
  // Add more problems...
];
```

### Customizing Themes

Colors are defined in each component's StyleSheet. Main colors:

- Background: `#0f172a`
- Card: `#1e293b`
- Border: `#334155`
- Primary: `#3b82f6`
- Success: `#10b981`
- Warning: `#f59e0b`
- Error: `#ef4444`

## Building for Production

### Android APK

```bash
expo build:android
```

### iOS IPA

```bash
expo build:ios
```

## Notes

- Make sure to configure Clerk authentication before running
- WebView requires proper permissions on Android
- Code execution is simulated (connect to backend for real execution)
- Progress is stored locally (integrate with backend for cloud sync)

## Support

For issues or questions, please refer to the main Codex documentation.
