/**
 * Window manager state store.
 *
 * Manages all open windows, their positions, z-index ordering, and states.
 * Single instance per app - opening an already-open app focuses it instead.
 */

import type { Position, Size, WindowInstance, WindowState } from '@/types/window'
import { create } from 'zustand'

interface WindowStore {
  /** Map of app ID to window instance */
  windows: Map<string, WindowInstance>
  /** Currently focused window ID */
  focusedId: string | null
  /** Next z-index to assign */
  nextZIndex: number

  /** Open a window for an app (or focus if already open) */
  openWindow: (
    appId: string,
    config: { title: string; defaultSize: Size; defaultPosition?: Position }
  ) => void
  /** Close a window */
  closeWindow: (appId: string) => void
  /** Focus a window (bring to front) */
  focusWindow: (appId: string) => void
  /** Minimize a window */
  minimizeWindow: (appId: string) => void
  /** Maximize a window (or restore if already maximized) */
  toggleMaximize: (appId: string, viewportSize: Size) => void
  /** Restore a minimized window */
  restoreWindow: (appId: string) => void
  /** Update window position */
  updatePosition: (appId: string, position: Position) => void
  /** Update window size */
  updateSize: (appId: string, size: Size) => void
  /** Get all windows sorted by z-index */
  getWindowsSorted: () => WindowInstance[]
  /** Check if a window is open */
  isOpen: (appId: string) => boolean
}

/** Default starting position offset for new windows */
const CASCADE_OFFSET = 30
/** Base starting position */
const BASE_POSITION = { x: 100, y: 100 }

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: new Map(),
  focusedId: null,
  nextZIndex: 1,

  openWindow: (appId, { title, defaultSize, defaultPosition }) => {
    const { windows, nextZIndex, focusWindow, isOpen } = get()

    // If already open, just focus it
    if (isOpen(appId)) {
      focusWindow(appId)
      return
    }

    // Calculate cascading position based on number of open windows
    const windowCount = windows.size
    const position = defaultPosition ?? {
      x: BASE_POSITION.x + (windowCount % 5) * CASCADE_OFFSET,
      y: BASE_POSITION.y + (windowCount % 5) * CASCADE_OFFSET,
    }

    const newWindow: WindowInstance = {
      id: appId,
      title,
      position,
      size: defaultSize,
      zIndex: nextZIndex,
      state: 'normal',
    }

    set((state) => {
      const newWindows = new Map(state.windows)
      newWindows.set(appId, newWindow)
      return {
        windows: newWindows,
        focusedId: appId,
        nextZIndex: state.nextZIndex + 1,
      }
    })
  },

  closeWindow: (appId) => {
    set((state) => {
      const newWindows = new Map(state.windows)
      newWindows.delete(appId)

      // If closing the focused window, focus the topmost remaining window
      let newFocusedId = state.focusedId
      if (state.focusedId === appId) {
        const remaining = Array.from(newWindows.values())
        if (remaining.length > 0) {
          const topmost = remaining.reduce((a, b) => (a.zIndex > b.zIndex ? a : b))
          newFocusedId = topmost.id
        } else {
          newFocusedId = null
        }
      }

      return {
        windows: newWindows,
        focusedId: newFocusedId,
      }
    })
  },

  focusWindow: (appId) => {
    const { windows, focusedId } = get()
    const window = windows.get(appId)

    if (!window || focusedId === appId) return

    // If minimized, restore it first
    const newState: WindowState = window.state === 'minimized' ? 'normal' : window.state

    set((state) => {
      const newWindows = new Map(state.windows)
      newWindows.set(appId, {
        ...window,
        zIndex: state.nextZIndex,
        state: newState,
      })
      return {
        windows: newWindows,
        focusedId: appId,
        nextZIndex: state.nextZIndex + 1,
      }
    })
  },

  minimizeWindow: (appId) => {
    const { windows } = get()
    const window = windows.get(appId)
    if (!window) return

    set((state) => {
      const newWindows = new Map(state.windows)
      newWindows.set(appId, { ...window, state: 'minimized' })

      // Find next window to focus
      const visible = Array.from(newWindows.values()).filter((w) => w.state !== 'minimized')
      const newFocusedId =
        visible.length > 0 ? visible.reduce((a, b) => (a.zIndex > b.zIndex ? a : b)).id : null

      return {
        windows: newWindows,
        focusedId: newFocusedId,
      }
    })
  },

  toggleMaximize: (appId, viewportSize) => {
    const { windows } = get()
    const window = windows.get(appId)
    if (!window) return

    set((state) => {
      const newWindows = new Map(state.windows)

      if (window.state === 'maximized') {
        // Restore to previous size/position - omit preMaximize props
        const { preMaximizePosition, preMaximizeSize, ...rest } = window
        const restoredWindow: WindowInstance = {
          ...rest,
          state: 'normal',
          position: preMaximizePosition ?? window.position,
          size: preMaximizeSize ?? window.size,
          zIndex: state.nextZIndex,
        }
        newWindows.set(appId, restoredWindow)
      } else {
        // Maximize
        newWindows.set(appId, {
          ...window,
          state: 'maximized',
          preMaximizePosition: window.position,
          preMaximizeSize: window.size,
          position: { x: 0, y: 48 }, // Account for dock height
          size: { width: viewportSize.width, height: viewportSize.height - 48 },
          zIndex: state.nextZIndex,
        })
      }

      return {
        windows: newWindows,
        focusedId: appId,
        nextZIndex: state.nextZIndex + 1,
      }
    })
  },

  restoreWindow: (appId) => {
    const { windows } = get()
    const window = windows.get(appId)
    if (!window || window.state !== 'minimized') return

    set((state) => {
      const newWindows = new Map(state.windows)
      newWindows.set(appId, {
        ...window,
        state: 'normal',
        zIndex: state.nextZIndex,
      })
      return {
        windows: newWindows,
        focusedId: appId,
        nextZIndex: state.nextZIndex + 1,
      }
    })
  },

  updatePosition: (appId, position) => {
    const { windows } = get()
    const window = windows.get(appId)
    if (!window) return

    set((state) => {
      const newWindows = new Map(state.windows)
      newWindows.set(appId, { ...window, position })
      return { windows: newWindows }
    })
  },

  updateSize: (appId, size) => {
    const { windows } = get()
    const window = windows.get(appId)
    if (!window) return

    set((state) => {
      const newWindows = new Map(state.windows)
      newWindows.set(appId, { ...window, size })
      return { windows: newWindows }
    })
  },

  getWindowsSorted: () => {
    const { windows } = get()
    return Array.from(windows.values()).sort((a, b) => a.zIndex - b.zIndex)
  },

  isOpen: (appId) => {
    return get().windows.has(appId)
  },
}))
