/**
 * Window manager component.
 *
 * Renders all open windows sorted by z-index.
 * Coordinates window state with the Zustand store.
 */

import { getAppComponent, getAppIcon } from '@/components/apps/app-registry'
import { windowClosed, windowFocused, windowMaximized, windowMinimized } from '@/lib/events'
import { useAnalytics } from '@/providers/analytics'
import { useWindowStore } from '@/stores/window-store'
import type { Position, Size } from '@/types/window'
import { useCallback, useMemo } from 'react'
import { Window } from './Window'

function WindowManager() {
  const analytics = useAnalytics()

  // Get windows state
  const windows = useWindowStore((s) => s.windows)
  const focusedId = useWindowStore((s) => s.focusedId)

  // Get actions
  const closeWindow = useWindowStore((s) => s.closeWindow)
  const focusWindow = useWindowStore((s) => s.focusWindow)
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow)
  const toggleMaximize = useWindowStore((s) => s.toggleMaximize)
  const updatePosition = useWindowStore((s) => s.updatePosition)
  const updateSize = useWindowStore((s) => s.updateSize)

  // Sort windows by z-index for rendering
  const sortedWindows = useMemo(() => {
    return Array.from(windows.values()).sort((a, b) => a.zIndex - b.zIndex)
  }, [windows])

  // Viewport size for maximize
  const viewportSize = useMemo(
    () => ({
      width: typeof window !== 'undefined' ? window.innerWidth : 1920,
      height: typeof window !== 'undefined' ? window.innerHeight : 1080,
    }),
    []
  )

  // Handlers with analytics
  const handleClose = useCallback(
    (appId: string) => {
      analytics.track(windowClosed(appId))
      closeWindow(appId)
    },
    [analytics, closeWindow]
  )

  const handleFocus = useCallback(
    (appId: string) => {
      analytics.track(windowFocused(appId))
      focusWindow(appId)
    },
    [analytics, focusWindow]
  )

  const handleMinimize = useCallback(
    (appId: string) => {
      analytics.track(windowMinimized(appId))
      minimizeWindow(appId)
    },
    [analytics, minimizeWindow]
  )

  const handleMaximize = useCallback(
    (appId: string) => {
      analytics.track(windowMaximized(appId))
      toggleMaximize(appId, viewportSize)
    },
    [analytics, toggleMaximize, viewportSize]
  )

  const handlePositionChange = useCallback(
    (appId: string, position: Position) => {
      updatePosition(appId, position)
    },
    [updatePosition]
  )

  const handleSizeChange = useCallback(
    (appId: string, size: Size) => {
      updateSize(appId, size)
    },
    [updateSize]
  )

  return (
    <>
      {sortedWindows.map((win) => {
        const AppComponent = getAppComponent(win.id)
        const AppIcon = getAppIcon(win.id)

        if (!AppComponent) return null

        return (
          <Window
            key={win.id}
            id={win.id}
            title={win.title}
            {...(AppIcon && { icon: AppIcon })}
            position={win.position}
            size={win.size}
            zIndex={win.zIndex}
            state={win.state}
            isActive={focusedId === win.id}
            onFocus={() => handleFocus(win.id)}
            onClose={() => handleClose(win.id)}
            onMinimize={() => handleMinimize(win.id)}
            onMaximize={() => handleMaximize(win.id)}
            onPositionChange={(pos) => handlePositionChange(win.id, pos)}
            onSizeChange={(size) => handleSizeChange(win.id, size)}
          >
            <AppComponent />
          </Window>
        )
      })}
    </>
  )
}

export { WindowManager }
