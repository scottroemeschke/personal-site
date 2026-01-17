/**
 * Snap-to-edge logic for window dragging.
 *
 * Detects when a window is near a screen edge and provides
 * snap preview information and final snap positions.
 */

import type { Position, Size, SnapEdge, SnapPreview } from '@/types/window'
import { useCallback, useState } from 'react'

/** Distance from edge to trigger snap (pixels) */
const SNAP_THRESHOLD = 20
/** Dock height to account for */
const DOCK_HEIGHT = 48

interface UseSnapToEdgeOptions {
  /** Viewport dimensions */
  viewport: Size
  /** Window dimensions */
  windowSize: Size
  /** Whether snap is enabled */
  enabled?: boolean
}

interface UseSnapToEdgeReturn {
  /** Current snap preview (null if not snapping) */
  snapPreview: SnapPreview | null
  /** Check position and update snap preview */
  checkSnap: (position: Position) => void
  /** Get final snapped position (or original if not snapping) */
  getSnappedPosition: (position: Position) => Position
  /** Get snapped size (for half-screen snaps) */
  getSnappedSize: () => Size | null
  /** Clear snap preview */
  clearSnap: () => void
}

export function useSnapToEdge({
  viewport,
  windowSize,
  enabled = true,
}: UseSnapToEdgeOptions): UseSnapToEdgeReturn {
  const [snapPreview, setSnapPreview] = useState<SnapPreview | null>(null)

  const detectSnapEdge = useCallback(
    (position: Position): SnapEdge => {
      if (!enabled) return null

      const { x, y } = position

      // Top edge (maximize) - only if dragging to very top
      if (y <= SNAP_THRESHOLD) {
        return 'top'
      }

      // Left edge (left half)
      if (x <= SNAP_THRESHOLD) {
        return 'left'
      }

      // Right edge (right half)
      if (x + windowSize.width >= viewport.width - SNAP_THRESHOLD) {
        return 'right'
      }

      return null
    },
    [enabled, viewport, windowSize]
  )

  const getSnapBounds = useCallback(
    (edge: SnapEdge): SnapPreview['bounds'] | null => {
      const availableHeight = viewport.height - DOCK_HEIGHT

      switch (edge) {
        case 'top':
          // Full screen (below dock)
          return {
            x: 0,
            y: DOCK_HEIGHT,
            width: viewport.width,
            height: availableHeight,
          }
        case 'left':
          // Left half
          return {
            x: 0,
            y: DOCK_HEIGHT,
            width: viewport.width / 2,
            height: availableHeight,
          }
        case 'right':
          // Right half
          return {
            x: viewport.width / 2,
            y: DOCK_HEIGHT,
            width: viewport.width / 2,
            height: availableHeight,
          }
        default:
          return null
      }
    },
    [viewport]
  )

  const checkSnap = useCallback(
    (position: Position) => {
      const edge = detectSnapEdge(position)

      if (edge) {
        const bounds = getSnapBounds(edge)
        if (bounds) {
          setSnapPreview({ edge, bounds })
          return
        }
      }

      setSnapPreview(null)
    },
    [detectSnapEdge, getSnapBounds]
  )

  const getSnappedPosition = useCallback(
    (position: Position): Position => {
      if (!snapPreview) return position

      return {
        x: snapPreview.bounds.x,
        y: snapPreview.bounds.y,
      }
    },
    [snapPreview]
  )

  const getSnappedSize = useCallback((): Size | null => {
    if (!snapPreview) return null

    return {
      width: snapPreview.bounds.width,
      height: snapPreview.bounds.height,
    }
  }, [snapPreview])

  const clearSnap = useCallback(() => {
    setSnapPreview(null)
  }, [])

  return {
    snapPreview,
    checkSnap,
    getSnappedPosition,
    getSnappedSize,
    clearSnap,
  }
}
