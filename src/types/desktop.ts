/**
 * Desktop shell types.
 */

import type { Position, Size } from './window'

/**
 * Desktop icon definition.
 */
export interface DesktopIconData {
  /** Unique identifier matching app ID */
  id: string
  /** Display label (e.g., 'ABOUT.exe') */
  label: string
  /** Lucide icon name */
  icon: string
  /** Grid position (column, row) for default placement */
  gridPosition: { col: number; row: number }
}

/**
 * Icon instance with runtime position.
 */
export interface IconInstance extends DesktopIconData {
  /** Pixel position (overrides grid when dragged) */
  position?: Position
  /** Whether icon is currently selected */
  isSelected?: boolean
}

/**
 * Background animation mode.
 * Triggers visual effects on the desktop background.
 */
export type BackgroundMode = 'idle' | 'alert' | 'hacking' | 'glitch'

/**
 * App definition for the registry.
 */
export interface AppDefinition {
  /** Unique app identifier */
  id: string
  /** Window title */
  title: string
  /** Lucide icon name */
  icon: string
  /** Default window size */
  defaultSize: Size
  /** Minimum window size */
  minSize?: Size
  /** Whether window can be resized */
  resizable?: boolean
}
