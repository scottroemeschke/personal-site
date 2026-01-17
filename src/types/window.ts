/**
 * Window system types for the desktop shell.
 */

/**
 * 2D position coordinates.
 */
export interface Position {
  x: number
  y: number
}

/**
 * Dimensions.
 */
export interface Size {
  width: number
  height: number
}

/**
 * Window state enum.
 */
export type WindowState = 'normal' | 'minimized' | 'maximized'

/**
 * A window instance in the window manager.
 */
export interface WindowInstance {
  /** Unique app identifier (e.g., 'about', 'taste') */
  id: string
  /** Display title (e.g., 'ABOUT.exe') */
  title: string
  /** Current position */
  position: Position
  /** Window dimensions */
  size: Size
  /** Stack order - higher is on top */
  zIndex: number
  /** Current window state */
  state: WindowState
  /** Position before maximizing (for restore) */
  preMaximizePosition?: Position
  /** Size before maximizing (for restore) */
  preMaximizeSize?: Size
}

/**
 * Snap edge for window snapping.
 */
export type SnapEdge = 'left' | 'right' | 'top' | 'bottom' | null

/**
 * Snap preview state for visual feedback during drag.
 */
export interface SnapPreview {
  edge: SnapEdge
  bounds: { x: number; y: number; width: number; height: number }
}
