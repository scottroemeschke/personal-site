/**
 * Window component with full chrome.
 *
 * Features:
 * - Draggable via title bar
 * - Snap-to-edge support
 * - Minimize/maximize/close controls
 * - Focus on click
 * - Cyberpunk styling with neon borders
 */

import { useDraggable } from '@/hooks/use-draggable'
import { useSnapToEdge } from '@/hooks/use-snap-to-edge'
import { cn } from '@/lib/utils'
import type { Position, Size, WindowState } from '@/types/window'
import type { LucideIcon } from 'lucide-react'
import { useCallback, useEffect, useMemo } from 'react'
import { WindowHeader } from './WindowHeader'

/** Dock height for bounds calculation */
const DOCK_HEIGHT = 48

function Window({
  id,
  title,
  icon,
  position,
  size,
  zIndex,
  state,
  isActive,
  children,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onPositionChange,
  onSizeChange,
}: WindowProps) {
  // Get viewport dimensions
  const viewport = useMemo(
    () => ({
      width: typeof window !== 'undefined' ? window.innerWidth : 1920,
      height: typeof window !== 'undefined' ? window.innerHeight : 1080,
    }),
    []
  )

  // Snap-to-edge hook
  const { snapPreview, checkSnap, getSnappedPosition, getSnappedSize, clearSnap } = useSnapToEdge({
    viewport,
    windowSize: size,
    enabled: state === 'normal',
  })

  // Draggable hook with bounds
  const {
    position: dragPosition,
    isDragging,
    dragHandleProps,
    setPosition,
  } = useDraggable({
    initialPosition: position,
    onDragStart: () => {
      if (!isActive) onFocus()
    },
    onDrag: (pos) => {
      checkSnap(pos)
    },
    onDragEnd: (pos) => {
      const snappedPos = getSnappedPosition(pos)
      const snappedSize = getSnappedSize()

      if (snappedSize) {
        // Apply snap
        onPositionChange(snappedPos)
        onSizeChange(snappedSize)
      } else {
        onPositionChange(pos)
      }
      clearSnap()
    },
    bounds: {
      minX: -size.width + 100, // Allow partial off-screen
      maxX: viewport.width - 100,
      minY: DOCK_HEIGHT, // Don't drag above dock
      maxY: viewport.height - 50,
    },
    disabled: state === 'maximized',
  })

  // Sync position when it changes externally (e.g., snap, restore)
  useEffect(() => {
    setPosition(position)
  }, [position, setPosition])

  // Handle window click for focus
  const handleWindowClick = useCallback(() => {
    if (!isActive) onFocus()
  }, [isActive, onFocus])

  // Don't render if minimized
  if (state === 'minimized') {
    return null
  }

  // Use drag position while dragging, otherwise use stored position
  const currentPosition = isDragging ? dragPosition : position

  return (
    <>
      {/* Snap preview overlay */}
      {snapPreview && isDragging && (
        <div
          className={cn(
            'pointer-events-none fixed',
            'border-2 border-cyan-400/50 bg-cyan-400/10',
            'transition-all duration-150'
          )}
          style={{
            left: snapPreview.bounds.x,
            top: snapPreview.bounds.y,
            width: snapPreview.bounds.width,
            height: snapPreview.bounds.height,
            zIndex: zIndex - 1,
          }}
        />
      )}

      {/* Window */}
      {/* biome-ignore lint/a11y/useSemanticElements: using div for custom positioning/styling control */}
      <div
        role="dialog"
        aria-labelledby={`window-title-${id}`}
        className={cn(
          'fixed flex flex-col overflow-hidden',
          'border bg-[hsl(var(--window-bg))]',
          'transition-shadow duration-150',
          // Active state
          isActive
            ? 'border-cyan-500/60 shadow-[0_0_30px_rgba(0,255,255,0.15)]'
            : 'border-[hsl(var(--window-border))] shadow-lg',
          // Dragging state
          isDragging && 'opacity-95',
          // Animation
          !isDragging && 'transition-[left,top,width,height] duration-150'
        )}
        style={{
          left: currentPosition.x,
          top: currentPosition.y,
          width: state === 'maximized' ? size.width : size.width,
          height: state === 'maximized' ? size.height : size.height,
          zIndex,
        }}
        onPointerDown={handleWindowClick}
      >
        {/* Header */}
        <WindowHeader
          title={title}
          {...(icon && { icon })}
          isActive={isActive}
          isMaximized={state === 'maximized'}
          onMinimize={onMinimize}
          onMaximize={onMaximize}
          onClose={onClose}
          dragHandleProps={dragHandleProps}
        />

        {/* Content */}
        <div className={cn('flex-1 overflow-auto', 'bg-[hsl(var(--window-bg))]')}>{children}</div>

        {/* Subtle corner decoration */}
        <div className="pointer-events-none absolute bottom-0 right-0 h-4 w-4">
          <div
            className={cn(
              'absolute bottom-1 right-1 h-2 w-2',
              'border-b border-r',
              isActive ? 'border-cyan-500/40' : 'border-cyan-500/20'
            )}
          />
        </div>
      </div>
    </>
  )
}

type WindowProps = {
  id: string
  title: string
  icon?: LucideIcon
  position: Position
  size: Size
  zIndex: number
  state: WindowState
  isActive: boolean
  children: React.ReactNode
  onFocus: () => void
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onPositionChange: (position: Position) => void
  onSizeChange: (size: Size) => void
}

export { Window }
