/**
 * Main desktop container.
 *
 * Root component that assembles the desktop shell:
 * - Background
 * - Dock
 * - Icon grid
 * - Window manager
 */

import { WindowManager } from '@/components/window/WindowManager'
import { desktopLoaded } from '@/lib/events'
import { cn } from '@/lib/utils'
import { useAnalytics } from '@/providers/analytics'
import { useEffect } from 'react'
import { DesktopBackground } from './DesktopBackground'
import { DesktopIconGrid } from './DesktopIconGrid'
import { Dock } from './Dock'

function Desktop() {
  const analytics = useAnalytics()

  // Track desktop load
  useEffect(() => {
    analytics.track(desktopLoaded())
  }, [analytics])

  return (
    <div className={cn('relative h-screen w-screen overflow-hidden', 'select-none')}>
      {/* Animated background */}
      <DesktopBackground />

      {/* Top dock/taskbar */}
      <Dock />

      {/* Desktop icons */}
      <DesktopIconGrid />

      {/* Window layer */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <div className="pointer-events-auto">
          <WindowManager />
        </div>
      </div>
    </div>
  )
}

export { Desktop }
