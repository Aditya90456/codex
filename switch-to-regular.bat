@echo off
echo Switching to Regular App...

REM Check if backup exists
if exist src\App-Backup.jsx (
    REM Restore from backup
    copy src\App-Backup.jsx src\App.jsx
    echo ✅ Switched back to regular app from backup
) else (
    echo ❌ No backup found. Creating regular app...
    
    REM Create regular app content
    echo import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; > src\App.jsx
    echo import WelcomeScreenModern from './components/WelcomeScreenModern'; >> src\App.jsx
    echo import CodexEditorModern from './components/CodexEditorModern'; >> src\App.jsx
    echo import AIUniversalCreatorModern from './components/AI/AIUniversalCreatorModern'; >> src\App.jsx
    echo import ReactCodeAI from './components/AI/ReactCodeAI'; >> src\App.jsx
    echo import AdvancedWebEditor from './components/AdvancedWebEditor'; >> src\App.jsx
    echo import LeetCodePage from './pages/LeetCodePage'; >> src\App.jsx
    echo import ProfilePage from './pages/ProfilePage'; >> src\App.jsx
    echo import MLResumeCreator from './components/MLResumeCreator'; >> src\App.jsx
    echo import './App.css'; >> src\App.jsx
    echo. >> src\App.jsx
    echo function App() { >> src\App.jsx
    echo   return ( >> src\App.jsx
    echo     ^<Router^> >> src\App.jsx
    echo       ^<div className="min-h-screen bg-gray-900"^> >> src\App.jsx
    echo         ^<Routes^> >> src\App.jsx
    echo           ^<Route path="/" element={^<WelcomeScreenModern /^>} /^> >> src\App.jsx
    echo           ^<Route path="/editor" element={^<CodexEditorModern /^>} /^> >> src\App.jsx
    echo           ^<Route path="/playground" element={^<LeetCodePage /^>} /^> >> src\App.jsx
    echo           ^<Route path="/web" element={^<AdvancedWebEditor /^>} /^> >> src\App.jsx
    echo           ^<Route path="/ai" element={^<AIUniversalCreatorModern /^>} /^> >> src\App.jsx
    echo           ^<Route path="/react-ai" element={^<ReactCodeAI /^>} /^> >> src\App.jsx
    echo           ^<Route path="/profile" element={^<ProfilePage /^>} /^> >> src\App.jsx
    echo           ^<Route path="/resume" element={^<MLResumeCreator /^>} /^> >> src\App.jsx
    echo         ^</Routes^> >> src\App.jsx
    echo       ^</div^> >> src\App.jsx
    echo     ^</Router^> >> src\App.jsx
    echo   ); >> src\App.jsx
    echo } >> src\App.jsx
    echo. >> src\App.jsx
    echo export default App; >> src\App.jsx
    
    echo ✅ Created regular app
)

echo 🌐 This version includes:
echo    - No authentication required
echo    - All routes public
echo    - Resume creator (public access)
echo.
echo To switch to Clerk authentication, run: switch-to-clerk.bat
pause