/**
 * Custom draggable hook using Pointer Events API.
 *
 * Provides unified mouse + touch drag handling with bounds constraints.
 * No external dependencies - full control over behavior.
 */

import type { Position } from '@/types/window'
import { useCallback, useRef, useState } from 'react'

interface UseDraggableOptions {
  /** Initial position */
  initialPosition: Position
  /** Callback when dragging starts */
  onDragStart?: () => void
  /** Callback during drag with new position */
  onDrag?: (position: Position) => void
  /** Callback when dragging ends */
  onDragEnd?: (position: Position) => void
  /** Bounds to constrain dragging */
  bounds?: {
    minX?: number
    maxX?: number
    minY?: number
    maxY?: number
  }
  /** Whether dragging is disabled */
  disabled?: boolean
}

interface UseDraggableReturn {
  /** Current position */
  position: Position
  /** Whether currently dragging */
  isDragging: boolean
  /** Props to spread on the drag handle element */
  dragHandleProps: {
    onPointerDown: (e: React.PointerEvent) => void
    style: { touchAction: string; cursor: string }
  }
  /** Set position programmatically */
  setPosition: (position: Position) => void
}

export function useDraggable({
  initialPosition,
  onDragStart,
  onDrag,
  onDragEnd,
  bounds,
  disabled = false,
}: UseDraggableOptions): UseDraggableReturn {
  const [position, setPosition] = useState<Position>(initialPosition)
  const [isDragging, setIsDragging] = useState(false)

  // Refs for tracking drag state without re-renders
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const positionRef = useRef<Position>(initialPosition)
  const elementRef = useRef<HTMLElement | null>(null)

  // Keep position ref in sync
  positionRef.current = position

  const constrainPosition = useCallback(
    (pos: Position): Position => {
      let { x, y } = pos

      if (bounds) {
        if (bounds.minX !== undefined) x = Math.max(bounds.minX, x)
        if (bounds.maxX !== undefined) x = Math.min(bounds.maxX, x)
        if (bounds.minY !== undefined) y = Math.max(bounds.minY, y)
        if (bounds.maxY !== undefined) y = Math.min(bounds.maxY, y)
      }

      return { x, y }
    },
    [bounds]
  )

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!dragStartRef.current) return

      const deltaX = e.clientX - dragStartRef.current.x
      const deltaY = e.clientY - dragStartRef.current.y

      const newPosition = constrainPosition({
        x: positionRef.current.x + deltaX,
        y: positionRef.current.y + deltaY,
      })

      // Update start point for next move
      dragStartRef.current = { x: e.clientX, y: e.clientY }
      positionRef.current = newPosition

      setPosition(newPosition)
      onDrag?.(newPosition)
    },
    [constrainPosition, onDrag]
  )

  const handlePointerUp = useCallback(
    (e: PointerEvent) => {
      if (!dragStartRef.current || !elementRef.current) return

      elementRef.current.releasePointerCapture(e.pointerId)
      dragStartRef.current = null

      setIsDragging(false)
      onDragEnd?.(positionRef.current)

      // Remove listeners
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerup', handlePointerUp)
    },
    [handlePointerMove, onDragEnd]
  )

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return

      // Only handle primary button (left click / touch)
      if (e.button !== 0) return

      e.preventDefault()
      e.stopPropagation()

      const target = e.currentTarget as HTMLElement
      target.setPointerCapture(e.pointerId)
      elementRef.current = target

      dragStartRef.current = { x: e.clientX, y: e.clientY }
      setIsDragging(true)
      onDragStart?.()

      // Add listeners to document for capturing moves outside element
      document.addEventListener('pointermove', handlePointerMove)
      document.addEventListener('pointerup', handlePointerUp)
    },
    [disabled, onDragStart, handlePointerMove, handlePointerUp]
  )

  return {
    position,
    isDragging,
    dragHandleProps: {
      onPointerDown: handlePointerDown,
      style: {
        touchAction: 'none', // Prevent browser handling of touch
        cursor: disabled ? 'default' : isDragging ? 'grabbing' : 'grab',
      },
    },
    setPosition,
  }
}
