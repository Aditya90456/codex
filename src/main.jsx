import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/responsive.css'
import App from './App.jsx'
import AppOffline from './App-Offline.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './utils/turnstile-suppressor.js'
import { initAllMobileFixes } from './utils/mobile-viewport-fix.js'

// Initialize mobile viewport fixes
initAllMobileFixes();

// Auto-detect mode based on:
// 1. User preference (localStorage) - highest priority
// 2. Internet connectivity (navigator.onLine)
// 3. Clerk API key availability

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const userPreference = localStorage.getItem('app_mode');
const isOnline = navigator.onLine;
const hasValidClerkKey = PUBLISHABLE_KEY && PUBLISHABLE_KEY.length > 20 && !PUBLISHABLE_KEY.includes('your_key');

// Determine which mode to use
let appMode;
let reason;

if (userPreference && userPreference !== 'auto') {
  // User has manually selected a specific mode (not auto)
  appMode = userPreference;
  reason = 'User preference';
} else {
  // Auto-detect mode
  if (!isOnline) {
    // No internet connection - must use offline mode
    appMode = 'offline';
    reason = 'No internet connection';
  } else if (!hasValidClerkKey) {
    // No valid Clerk key - use offline mode
    appMode = 'offline';
    reason = 'No valid Clerk key';
  } else {
    // Online and has valid Clerk key - use online mode
    appMode = 'online';
    reason = 'Internet available + Clerk configured';
  }
}

const AppToRender = appMode === 'offline' ? AppOffline : App;

// Log startup info
console.log('🚀 Codex Starting...');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`📱 Mode: ${appMode.toUpperCase()}`);
console.log(`📊 Reason: ${reason}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('Status:');
console.log(`  • User Preference: ${userPreference || 'auto'}`);
console.log(`  • Internet: ${isOnline ? '🟢 Online' : '🔴 Offline'}`);
console.log(`  • Clerk Key: ${hasValidClerkKey ? '✅ Valid' : '❌ Invalid/Missing'}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <AppToRender />
    </ErrorBoundary>
  </StrictMode>,
)
