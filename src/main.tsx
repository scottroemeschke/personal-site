import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { initPostHog } from './lib/analytics'
import { initSentry } from './lib/sentry'
import './styles/globals.css'

// Initialize observability
initSentry()
initPostHog()

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
