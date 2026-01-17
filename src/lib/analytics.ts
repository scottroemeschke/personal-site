/**
 * Analytics implementations.
 *
 * This module provides factory functions to create Analytics instances.
 * The PostHog implementation is internal - callers only see the interface.
 */

import type { Analytics, AnalyticsEvent, AppUser } from '@/types/services'
import posthog from 'posthog-js'

/**
 * Initialize PostHog SDK.
 *
 * Call once at app startup, before creating the analytics instance.
 * If API key is not set or capturing is disabled, this is a no-op.
 */
export function initPostHog() {
  const apiKey = import.meta.env.VITE_POSTHOG_KEY as string | undefined
  const apiHost = (import.meta.env.VITE_POSTHOG_HOST as string) || 'https://us.i.posthog.com'

  if (!apiKey) {
    return
  }

  // Respect Do Not Track browser setting
  if (navigator.doNotTrack === '1') {
    return
  }

  // Disable in development unless explicitly enabled
  if (import.meta.env.DEV && !import.meta.env.VITE_POSTHOG_DEV_ENABLED) {
    return
  }

  posthog.init(apiKey, {
    api_host: apiHost,

    // Use modern defaults for improved behavior
    defaults: '2025-11-30',

    // Privacy settings
    // Note: IP redaction is configured at the project level in PostHog settings
    respect_dnt: true,

    // Capture pageviews automatically on history changes (works with React Router)
    capture_pageview: 'history_change',

    // Autocapture clicks, inputs, and form submissions
    autocapture: true,
  })
}

/**
 * Create an Analytics instance backed by PostHog.
 *
 * Sends events to PostHog. If PostHog is not initialized (no API key),
 * events are silently dropped.
 */
export function createPostHogAnalytics(): Analytics {
  return {
    track(event: AnalyticsEvent) {
      if (posthog.__loaded) {
        posthog.capture(event.name, event.properties)
      }
    },

    capture(event: string, properties?: Record<string, unknown>) {
      if (posthog.__loaded) {
        posthog.capture(event, properties)
      }
    },

    identify(user: AppUser) {
      if (posthog.__loaded) {
        posthog.identify(user.id, {
          email: user.email,
          username: user.username,
        })
      }
    },

    reset() {
      if (posthog.__loaded) {
        posthog.reset()
      }
    },
  }
}

/**
 * Flush pending analytics events.
 *
 * PostHog batches events before sending. This function waits for the batch
 * to be sent. Use in E2E tests to ensure events are transmitted before
 * verification.
 *
 * @param timeout - Maximum time to wait in milliseconds (default: 2000)
 */
export async function flushAnalytics(timeout = 2000): Promise<void> {
  if (!posthog.__loaded) {
    return
  }

  // PostHog batches events and sends them periodically.
  // Wait for the batch interval to pass to ensure events are sent.
  await new Promise((resolve) => setTimeout(resolve, timeout))
}

/**
 * Create a no-op Analytics instance for when analytics is disabled.
 */
export function createNoopAnalytics(): Analytics {
  return {
    track() {
      // Intentionally empty
    },
    capture() {
      // Intentionally empty
    },
    identify() {
      // Intentionally empty
    },
    reset() {
      // Intentionally empty
    },
  }
}
