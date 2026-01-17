import { Desktop } from './components/desktop'
import { createNoopAnalytics, createPostHogAnalytics } from './lib/analytics'
import { AnalyticsProvider } from './providers/analytics'

// Create analytics instance (uses PostHog if configured, otherwise no-op)
const analytics = import.meta.env.VITE_POSTHOG_KEY
  ? createPostHogAnalytics()
  : createNoopAnalytics()

function App() {
  return (
    <AnalyticsProvider analytics={analytics}>
      <Desktop />
    </AnalyticsProvider>
  )
}

export { App }
