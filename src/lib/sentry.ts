import * as Sentry from '@sentry/react'

/**
 * Get the current environment name for Sentry.
 * Uses Vercel environment detection when deployed, falls back to Vite mode for local dev.
 */
export function getEnvironment(): string {
  // Vercel sets VERCEL_ENV: 'production' | 'preview' | 'development'
  const vercelEnv = import.meta.env.VITE_VERCEL_ENV as string | undefined
  if (vercelEnv) return vercelEnv

  // Fallback for local development
  return import.meta.env.DEV ? 'development' : 'production'
}

// Exported for testing
export function scrubUrl(url: string): string {
  // Match common sensitive parameter patterns: token, api_key, access_token, password, secret, auth, etc.
  return url.replace(
    /([?&])([^=]*(?:token|key|secret|password|auth)[^=]*)=[^&]*/gi,
    '$1$2=[REDACTED]'
  )
}

// Exported for testing
export function scrubBreadcrumbData(data: Record<string, unknown>): Record<string, unknown> {
  const scrubbed = { ...data }

  // Scrub authorization headers
  if (scrubbed.headers && typeof scrubbed.headers === 'object') {
    const headers = scrubbed.headers as Record<string, unknown>
    const { authorization, Authorization, ...rest } = headers
    scrubbed.headers = rest
  }

  // Scrub URL query params that might contain tokens
  if (typeof scrubbed.url === 'string') {
    scrubbed.url = scrubUrl(scrubbed.url)
  }

  return scrubbed
}

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined

  if (!dsn) {
    return
  }

  const release = import.meta.env.VITE_SENTRY_RELEASE as string | undefined

  Sentry.init({
    dsn,
    environment: getEnvironment(),
    release: release || undefined,
    integrations: [Sentry.browserTracingIntegration()],

    // Sample rates
    tracesSampleRate: 0.1, // 10% of transactions for performance monitoring

    // Propagate trace headers to these origins for distributed tracing
    tracePropagationTargets: [
      'localhost', // Local development
    ],

    // Filter out errors from browser extensions
    denyUrls: [/extensions\//i, /^chrome:\/\//i, /^chrome-extension:\/\//i, /^moz-extension:\/\//i],

    // Scrub sensitive data before sending
    beforeSend(event) {
      if (event.breadcrumbs) {
        event.breadcrumbs = event.breadcrumbs.map((breadcrumb) => {
          if (breadcrumb.data) {
            return { ...breadcrumb, data: scrubBreadcrumbData(breadcrumb.data) }
          }
          return breadcrumb
        })
      }
      return event
    },

    // Don't capture ResizeObserver loop errors (browser noise)
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
    ],
  })
}

/**
 * Flush pending events to ensure they're sent before the page unloads.
 * Useful for testing or when you need to guarantee delivery.
 */
export async function flushErrors(timeout = 2000): Promise<boolean> {
  return Sentry.flush(timeout)
}

export { Sentry }
