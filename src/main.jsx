import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/responsive.css'
import App from './App-ClerkNew.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './utils/turnstile-suppressor.js'
import { initAllMobileFixes } from './utils/mobile-viewport-fix.js'

// Initialize mobile viewport fixes
initAllMobileFixes();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
