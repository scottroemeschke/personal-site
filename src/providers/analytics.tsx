import type { Analytics } from '@/types/services'
import { type ReactNode, createContext, useContext } from 'react'

const AnalyticsContext = createContext<Analytics | null>(null)

interface AnalyticsProviderProps {
  analytics: Analytics
  children: ReactNode
}

/**
 * Provider for analytics service.
 *
 * Wrap your app with this provider to make analytics available
 * via the useAnalytics hook.
 */
function AnalyticsProvider({ analytics, children }: AnalyticsProviderProps) {
  return <AnalyticsContext.Provider value={analytics}>{children}</AnalyticsContext.Provider>
}

/**
 * Hook to access the analytics service.
 *
 * Must be used within an AnalyticsProvider.
 */
function useAnalytics(): Analytics {
  const ctx = useContext(AnalyticsContext)
  if (!ctx) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return ctx
}

export { AnalyticsProvider, useAnalytics }
