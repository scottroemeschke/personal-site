import type { ErrorMonitor } from '@/types/services'
import { type ReactNode, createContext, useContext } from 'react'

const ErrorMonitorContext = createContext<ErrorMonitor | null>(null)

interface ErrorMonitorProviderProps {
  monitor: ErrorMonitor
  children: ReactNode
}

/**
 * Provider for error monitoring service.
 *
 * Wrap your app with this provider to make error monitoring available
 * via the useErrorMonitor hook.
 */
function ErrorMonitorProvider({ monitor, children }: ErrorMonitorProviderProps) {
  return <ErrorMonitorContext.Provider value={monitor}>{children}</ErrorMonitorContext.Provider>
}

/**
 * Hook to access the error monitoring service.
 *
 * Must be used within an ErrorMonitorProvider.
 */
function useErrorMonitor(): ErrorMonitor {
  const ctx = useContext(ErrorMonitorContext)
  if (!ctx) {
    throw new Error('useErrorMonitor must be used within an ErrorMonitorProvider')
  }
  return ctx
}

export { ErrorMonitorProvider, useErrorMonitor }
