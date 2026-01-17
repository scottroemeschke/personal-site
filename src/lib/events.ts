/**
 * Typed analytics events for Neon Desktop.
 *
 * Provides type-safe event construction following PostHog best practices:
 * - Event names: object_verb snake_case (e.g., "window_opened", "icon_clicked")
 * - Property names: snake_case with prefixes (e.g., "window_id", "app_name")
 * - Boolean properties: is_/has_ prefix (e.g., "is_maximized", "has_focus")
 */

export interface AnalyticsEvent {
  readonly name: string
  readonly properties: Record<string, unknown>
}

/**
 * Create an event builder for custom events.
 */
export function createEvent(name: string) {
  const properties: Record<string, unknown> = {}

  const builder = {
    prop(key: string, value: unknown) {
      properties[key] = value
      return builder
    },
    build(): AnalyticsEvent {
      return { name, properties: { ...properties } }
    },
  }

  return builder
}

// =============================================================================
// Desktop Events
// =============================================================================

/**
 * User loaded the desktop.
 */
export function desktopLoaded(): AnalyticsEvent {
  return createEvent('desktop_loaded').build()
}

// =============================================================================
// Window Events
// =============================================================================

/**
 * User opened a window/app.
 */
export function windowOpened(appId: string): AnalyticsEvent {
  return createEvent('window_opened').prop('app_id', appId).build()
}

/**
 * User closed a window.
 */
export function windowClosed(appId: string): AnalyticsEvent {
  return createEvent('window_closed').prop('app_id', appId).build()
}

/**
 * User minimized a window.
 */
export function windowMinimized(appId: string): AnalyticsEvent {
  return createEvent('window_minimized').prop('app_id', appId).build()
}

/**
 * User maximized a window.
 */
export function windowMaximized(appId: string): AnalyticsEvent {
  return createEvent('window_maximized').prop('app_id', appId).build()
}

/**
 * User focused a window (brought to front).
 */
export function windowFocused(appId: string): AnalyticsEvent {
  return createEvent('window_focused').prop('app_id', appId).build()
}

// =============================================================================
// Icon Events
// =============================================================================

/**
 * User clicked a desktop icon.
 */
export function iconClicked(iconId: string): AnalyticsEvent {
  return createEvent('icon_clicked').prop('icon_id', iconId).build()
}

/**
 * User double-clicked a desktop icon (opens app).
 */
export function iconDoubleClicked(iconId: string): AnalyticsEvent {
  return createEvent('icon_double_clicked').prop('icon_id', iconId).build()
}

// =============================================================================
// Dock Events
// =============================================================================

/**
 * User clicked a dock item.
 */
export function dockItemClicked(appId: string): AnalyticsEvent {
  return createEvent('dock_item_clicked').prop('app_id', appId).build()
}

// =============================================================================
// App-Specific Events
// =============================================================================

/**
 * User clicked an external link in TASTE.links.
 */
export function externalLinkClicked(platform: string, url: string): AnalyticsEvent {
  return createEvent('external_link_clicked')
    .prop('platform', platform)
    .prop('url', url)
    .build()
}

/**
 * User submitted the contact form in DEADDROP.msg.
 */
export function contactFormSubmitted(success: boolean): AnalyticsEvent {
  return createEvent('contact_form_submitted').prop('is_successful', success).build()
}

/**
 * User viewed a project in PROJECTS.log.
 */
export function projectViewed(projectId: string): AnalyticsEvent {
  return createEvent('project_viewed').prop('project_id', projectId).build()
}

// =============================================================================
// Easter Egg Events
// =============================================================================

/**
 * User triggered an easter egg.
 */
export function easterEggTriggered(eggId: string): AnalyticsEvent {
  return createEvent('easter_egg_triggered').prop('egg_id', eggId).build()
}
