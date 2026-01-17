/**
 * Desktop state store.
 *
 * Manages icon positions, background mode, and desktop interactions.
 */

import type { BackgroundMode, IconInstance } from '@/types/desktop'
import type { Position } from '@/types/window'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/** Default icons with grid positions */
const DEFAULT_ICONS: IconInstance[] = [
  { id: 'about', label: 'ABOUT.exe', icon: 'User', gridPosition: { col: 0, row: 0 } },
  { id: 'taste', label: 'TASTE.links', icon: 'Link', gridPosition: { col: 0, row: 1 } },
  { id: 'projects', label: 'PROJECTS.log', icon: 'FolderCode', gridPosition: { col: 0, row: 2 } },
  { id: 'deaddrop', label: 'DEADDROP.msg', icon: 'Mail', gridPosition: { col: 0, row: 3 } },
]

interface DesktopStore {
  /** Desktop icons */
  icons: IconInstance[]
  /** Currently selected icon ID */
  selectedIconId: string | null
  /** Background animation mode */
  backgroundMode: BackgroundMode
  /** Background mode timeout ID */
  backgroundTimeoutId: number | null

  /** Select an icon */
  selectIcon: (iconId: string | null) => void
  /** Update icon position */
  updateIconPosition: (iconId: string, position: Position) => void
  /** Reset icon to grid position */
  resetIconPosition: (iconId: string) => void
  /** Set background mode (optionally with auto-reset duration) */
  setBackgroundMode: (mode: BackgroundMode, durationMs?: number) => void
  /** Reset all icon positions */
  resetAllIconPositions: () => void
}

export const useDesktopStore = create<DesktopStore>()(
  persist(
    (set, get) => ({
      icons: DEFAULT_ICONS,
      selectedIconId: null,
      backgroundMode: 'idle',
      backgroundTimeoutId: null,

      selectIcon: (iconId) => {
        set({ selectedIconId: iconId })
      },

      updateIconPosition: (iconId, position) => {
        set((state) => ({
          icons: state.icons.map((icon) => (icon.id === iconId ? { ...icon, position } : icon)),
        }))
      },

      resetIconPosition: (iconId) => {
        set((state) => ({
          icons: state.icons.map((icon) => {
            if (icon.id !== iconId) return icon
            const { position: _, ...rest } = icon
            return rest
          }),
        }))
      },

      setBackgroundMode: (mode, durationMs) => {
        const { backgroundTimeoutId } = get()

        // Clear existing timeout
        if (backgroundTimeoutId !== null) {
          window.clearTimeout(backgroundTimeoutId)
        }

        if (durationMs && mode !== 'idle') {
          // Set mode with auto-reset
          const timeoutId = window.setTimeout(() => {
            set({ backgroundMode: 'idle', backgroundTimeoutId: null })
          }, durationMs)

          set({ backgroundMode: mode, backgroundTimeoutId: timeoutId })
        } else {
          set({ backgroundMode: mode, backgroundTimeoutId: null })
        }
      },

      resetAllIconPositions: () => {
        set((state) => ({
          icons: state.icons.map((icon) => {
            const { position: _, ...rest } = icon
            return rest
          }),
        }))
      },
    }),
    {
      name: 'neon-desktop',
      partialize: (state) => ({
        // Only persist icon positions
        icons: state.icons.map((icon) => ({
          ...icon,
          isSelected: undefined, // Don't persist selection
        })),
      }),
    }
  )
)
