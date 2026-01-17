/**
 * Draggable desktop icon.
 *
 * Features:
 * - Double-click to open app
 * - Draggable with position persistence
 * - Cyberpunk styling
 */

import { useDraggable } from '@/hooks/use-draggable'
import { cn } from '@/lib/utils'
import type { IconInstance } from '@/types/desktop'
import type { Position } from '@/types/window'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useCallback, useRef } from 'react'

/** Icon grid cell size */
const GRID_CELL_SIZE = 90
/** Icon grid padding from edges */
const GRID_PADDING = 16
/** Dock height to offset grid */
const DOCK_HEIGHT = 48

function DesktopIcon({
  icon,
  isSelected,
  onSelect,
  onDoubleClick,
  onPositionChange,
}: DesktopIconProps) {
  const lastClickRef = useRef<number>(0)

  // Calculate initial position from grid or stored position
  const getInitialPosition = (): Position => {
    if (icon.position) {
      return icon.position
    }
    return {
      x: GRID_PADDING + icon.gridPosition.col * GRID_CELL_SIZE,
      y: DOCK_HEIGHT + GRID_PADDING + icon.gridPosition.row * GRID_CELL_SIZE,
    }
  }

  const { position, isDragging, dragHandleProps, setPosition } = useDraggable({
    initialPosition: getInitialPosition(),
    onDragEnd: (pos) => {
      // Snap to grid
      const snappedX =
        Math.round((pos.x - GRID_PADDING) / GRID_CELL_SIZE) * GRID_CELL_SIZE + GRID_PADDING
      const snappedY =
        Math.round((pos.y - DOCK_HEIGHT - GRID_PADDING) / GRID_CELL_SIZE) * GRID_CELL_SIZE +
        DOCK_HEIGHT +
        GRID_PADDING
      const snappedPos = { x: snappedX, y: snappedY }
      setPosition(snappedPos)
      onPositionChange(snappedPos)
    },
    bounds: {
      minX: 0,
      minY: DOCK_HEIGHT,
      maxX: typeof window !== 'undefined' ? window.innerWidth - GRID_CELL_SIZE : 1920,
      maxY: typeof window !== 'undefined' ? window.innerHeight - GRID_CELL_SIZE : 1080,
    },
  })

  // Handle click/double-click
  const handleClick = useCallback(() => {
    // Don't trigger click events while dragging
    if (isDragging) return

    const now = Date.now()
    const timeSinceLastClick = now - lastClickRef.current
    lastClickRef.current = now

    // Double-click detection (300ms threshold)
    if (timeSinceLastClick < 300) {
      onDoubleClick()
    } else {
      onSelect()
    }
  }, [isDragging, onSelect, onDoubleClick])

  // Get the Lucide icon component
  const IconComponent =
    (LucideIcons as unknown as Record<string, LucideIcon>)[icon.icon] ?? LucideIcons.File

  return (
    <div
      className={cn(
        'absolute flex flex-col items-center justify-center',
        'w-[80px] p-2 rounded',
        'select-none',
        'transition-all duration-150',
        // Selection state
        isSelected && !isDragging && 'bg-cyan-500/20',
        // Hover state
        !isDragging && 'hover:bg-cyan-500/10',
        // Dragging state
        isDragging && 'opacity-80 scale-105'
      )}
      {...dragHandleProps}
      style={{
        ...dragHandleProps.style,
        left: position.x,
        top: position.y,
      }}
      onClick={handleClick}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex h-12 w-12 items-center justify-center',
          'border border-cyan-500/30 rounded bg-black/50',
          'transition-all duration-150',
          isSelected && 'border-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
        )}
      >
        <IconComponent
          className={cn(
            'h-6 w-6',
            isSelected ? 'text-cyan-300' : 'text-cyan-500/70',
            'transition-colors duration-150'
          )}
        />
      </div>

      {/* Label */}
      <span
        className={cn(
          'mt-1 text-xs text-center leading-tight',
          'max-w-full truncate px-1',
          isSelected ? 'text-cyan-300' : 'text-cyan-500/80',
          'transition-colors duration-150'
        )}
      >
        {icon.label}
      </span>
    </div>
  )
}

type DesktopIconProps = {
  icon: IconInstance
  isSelected: boolean
  onSelect: () => void
  onDoubleClick: () => void
  onPositionChange: (position: Position) => void
}

export { DesktopIcon }
