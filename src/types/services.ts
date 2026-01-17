/**
 * Service interfaces for dependency injection.
 *
 * These interfaces define what the app needs from external services.
 * No external library types - just app-level types.
 */

/**
 * Context for error reports.
 */
export interface ErrorContext {
  /** Searchable key-value tags */
  tags?: Record<string, string>
  /** Additional structured data */
  extra?: Record<string, unknown>
}

/**
 * Error monitoring service interface.
 *
 * Implementations report errors to external services (Sentry, etc.).
 * Callers use this interface, never the underlying SDK directly.
 */
export interface ErrorMonitor {
  /**
   * Report an error with optional context.
   *
   * Fire-and-forget: callers don't need to know if it succeeded.
   */
  reportError(error: Error, context?: ErrorContext): void

  /**
   * Set the current user for error attribution.
   *
   * Call on login. Pass null on logout to clear.
   * Subsequent errors will be associated with this user.
   */
  setUser(user: AppUser | null): void
}

/**
 * User identity for cross-cutting concerns.
 */
export interface AppUser {
  id: string
  email?: string
  username?: string
}

/**
 * Typed analytics event.
 *
 * Import from '@/lib/events' for factory functions to create these.
 */
export interface AnalyticsEvent {
  readonly name: string
  readonly properties: Record<string, unknown>
}

/**
 * Analytics service interface.
 *
 * Implementations send events to external services (PostHog, etc.).
 * Callers use this interface, never the underlying SDK directly.
 */
export interface Analytics {
  /**
   * Track a typed analytics event.
   *
   * Preferred method - use factory functions from '@/lib/events':
   * ```ts
   * import { pageViewed } from '@/lib/events'
   * analytics.track(pageViewed('/about'))
   * ```
   *
   * Fire-and-forget: callers don't need to know if it succeeded.
   */
  track(event: AnalyticsEvent): void

  /**
   * Capture a custom event with optional properties.
   *
   * Use track() with typed events when possible. This method is for
   * ad-hoc events or when migrating from untyped events.
   *
   * Fire-and-forget: callers don't need to know if it succeeded.
   */
  capture(event: string, properties?: Record<string, unknown>): void

  /**
   * Identify the current user for event attribution.
   *
   * Call on login. Subsequent events will be associated with this user.
   */
  identify(user: AppUser): void

  /**
   * Clear the current user identity.
   *
   * Call on logout. Resets to anonymous tracking.
   */
  reset(): void
}
