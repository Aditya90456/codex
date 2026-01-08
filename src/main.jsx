import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App-Production.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import './utils/turnstile-suppressor.js' // Import turnstile error suppression

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
