/**
 * Desktop icon grid container.
 *
 * Renders all desktop icons and handles selection/opening.
 */

import { getAppDefinition } from '@/components/apps/app-registry'
import { iconClicked, iconDoubleClicked, windowOpened } from '@/lib/events'
import { useAnalytics } from '@/providers/analytics'
import { useDesktopStore } from '@/stores/desktop-store'
import { useWindowStore } from '@/stores/window-store'
import type { Position } from '@/types/window'
import { useCallback } from 'react'
import { DesktopIcon } from './DesktopIcon'

function DesktopIconGrid() {
  const analytics = useAnalytics()

  // Desktop store
  const icons = useDesktopStore((s) => s.icons)
  const selectedIconId = useDesktopStore((s) => s.selectedIconId)
  const selectIcon = useDesktopStore((s) => s.selectIcon)
  const updateIconPosition = useDesktopStore((s) => s.updateIconPosition)

  // Window store
  const openWindow = useWindowStore((s) => s.openWindow)

  // Handle icon selection
  const handleSelect = useCallback(
    (iconId: string) => {
      analytics.track(iconClicked(iconId))
      selectIcon(iconId)
    },
    [analytics, selectIcon]
  )

  // Handle icon double-click (open app)
  const handleDoubleClick = useCallback(
    (iconId: string) => {
      analytics.track(iconDoubleClicked(iconId))
      analytics.track(windowOpened(iconId))

      const appDef = getAppDefinition(iconId)
      if (appDef) {
        openWindow(iconId, {
          title: appDef.title,
          defaultSize: appDef.defaultSize,
        })
      }

      // Deselect after opening
      selectIcon(null)
    },
    [analytics, openWindow, selectIcon]
  )

  // Handle position change
  const handlePositionChange = useCallback(
    (iconId: string, position: Position) => {
      updateIconPosition(iconId, position)
    },
    [updateIconPosition]
  )

  // Handle click on empty area to deselect
  const handleBackgroundClick = useCallback(
    (e: React.MouseEvent) => {
      // Only deselect if clicking directly on the grid container
      if (e.target === e.currentTarget) {
        selectIcon(null)
      }
    },
    [selectIcon]
  )

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: background click deselection doesn't need keyboard equivalent
    <div className="absolute inset-0 z-10" onClick={handleBackgroundClick}>
      {icons.map((icon) => (
        <DesktopIcon
          key={icon.id}
          icon={icon}
          isSelected={selectedIconId === icon.id}
          onSelect={() => handleSelect(icon.id)}
          onDoubleClick={() => handleDoubleClick(icon.id)}
          onPositionChange={(pos) => handlePositionChange(icon.id, pos)}
        />
      ))}
    </div>
  )
}

export { DesktopIconGrid }
