import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/responsive.css'
import App from './App-ClerkNew.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './utils/turnstile-suppressor.js'
import { initAllMobileFixes } from './utils/mobile-viewport-fix.js'
import { initViewportFix } from './utils/viewport-fix.js'
import { initPerformanceOptimizations, registerServiceWorker } from './utils/performance-optimizer.js'
import { initMobileDetection } from './utils/mobile-detection.js'

// Initialize mobile viewport fixes
initAllMobileFixes();
initViewportFix();

// Initialize performance optimizations
initPerformanceOptimizations();

// Initialize mobile detection
initMobileDetection();

// Register service worker for caching
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  registerServiceWorker();
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
