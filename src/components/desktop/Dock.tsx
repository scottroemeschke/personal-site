/**
 * Top taskbar dock.
 *
 * Shows all apps with running status indicators.
 * Clicking opens/focuses the app.
 */

import { APP_DEFINITIONS, getAppDefinition } from '@/components/apps/app-registry'
import { dockItemClicked, windowFocused, windowOpened } from '@/lib/events'
import { cn } from '@/lib/utils'
import { useAnalytics } from '@/providers/analytics'
import { useWindowStore } from '@/stores/window-store'
import { useCallback } from 'react'
import { DockItem } from './DockItem'

function Dock() {
  const analytics = useAnalytics()

  // Window state
  const windows = useWindowStore((s) => s.windows)
  const focusedId = useWindowStore((s) => s.focusedId)
  const openWindow = useWindowStore((s) => s.openWindow)
  const focusWindow = useWindowStore((s) => s.focusWindow)
  const restoreWindow = useWindowStore((s) => s.restoreWindow)

  // Handle dock item click
  const handleClick = useCallback(
    (appId: string) => {
      analytics.track(dockItemClicked(appId))

      const win = windows.get(appId)
      if (win) {
        // Window is open
        if (win.state === 'minimized') {
          // Restore minimized window
          restoreWindow(appId)
          analytics.track(windowFocused(appId))
        } else if (focusedId === appId) {
          // Already focused - do nothing or could minimize
        } else {
          // Focus the window
          focusWindow(appId)
          analytics.track(windowFocused(appId))
        }
      } else {
        // Window not open - open it
        const appDef = getAppDefinition(appId)
        if (appDef) {
          openWindow(appId, {
            title: appDef.title,
            defaultSize: appDef.defaultSize,
          })
          analytics.track(windowOpened(appId))
        }
      }
    },
    [analytics, windows, focusedId, openWindow, focusWindow, restoreWindow]
  )

  return (
    <div
      className={cn(
        'fixed left-0 right-0 top-0 z-50',
        'flex h-12 items-center',
        'border-b border-cyan-500/30',
        'bg-black/80 backdrop-blur-sm'
      )}
    >
      {/* System title */}
      <div className="flex h-full items-center border-r border-cyan-500/20 px-4">
        <span className="text-sm font-bold uppercase tracking-widest text-cyan-400 text-glow-cyan">
          NEON_OS
        </span>
      </div>

      {/* App items */}
      <div className="flex h-full items-center">
        {APP_DEFINITIONS.map((app) => {
          const win = windows.get(app.id)
          return (
            <DockItem
              key={app.id}
              label={app.title}
              iconName={app.icon}
              isOpen={win !== undefined}
              isActive={focusedId === app.id}
              isMinimized={win?.state === 'minimized'}
              onClick={() => handleClick(app.id)}
            />
          )
        })}
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* System status */}
      <div className="flex h-full items-center border-l border-cyan-500/20 px-4">
        <SystemClock />
      </div>
    </div>
  )
}

/**
 * Simple system clock display.
 */
function SystemClock() {
  // Use a simple time display (updates handled by React's natural re-renders)
  const now = new Date()
  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')

  return (
    <span className="font-mono text-xs text-cyan-500/70">
      {hours}:{minutes}
    </span>
  )
}

export { Dock }
