/**
 * Window control buttons (minimize, maximize, close).
 *
 * Cyberpunk-styled with neon hover effects.
 */

import { cn } from '@/lib/utils'
import { Minus, Square, X } from 'lucide-react'

function WindowControls({ onMinimize, onMaximize, onClose, isMaximized }: WindowControlsProps) {
  return (
    <div className="flex items-center gap-1">
      {/* Minimize */}
      <button
        type="button"
        onClick={onMinimize}
        className={cn(
          'group flex h-6 w-6 items-center justify-center rounded-sm',
          'transition-all duration-150',
          'hover:bg-cyan-500/20'
        )}
        aria-label="Minimize window"
      >
        <Minus
          className={cn(
            'h-3.5 w-3.5 text-cyan-500/70',
            'transition-all duration-150',
            'group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_4px_rgba(0,255,255,0.5)]'
          )}
        />
      </button>

      {/* Maximize/Restore */}
      <button
        type="button"
        onClick={onMaximize}
        className={cn(
          'group flex h-6 w-6 items-center justify-center rounded-sm',
          'transition-all duration-150',
          'hover:bg-cyan-500/20'
        )}
        aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
      >
        {isMaximized ? (
          // Restore icon (overlapping squares)
          <div className="relative h-3.5 w-3.5">
            <div
              className={cn(
                'absolute bottom-0 left-0 h-2.5 w-2.5 border border-cyan-500/70',
                'transition-all duration-150',
                'group-hover:border-cyan-400 group-hover:drop-shadow-[0_0_4px_rgba(0,255,255,0.5)]'
              )}
            />
            <div
              className={cn(
                'absolute right-0 top-0 h-2.5 w-2.5 border border-cyan-500/70 bg-[hsl(var(--window-header))]',
                'transition-all duration-150',
                'group-hover:border-cyan-400 group-hover:drop-shadow-[0_0_4px_rgba(0,255,255,0.5)]'
              )}
            />
          </div>
        ) : (
          <Square
            className={cn(
              'h-3 w-3 text-cyan-500/70',
              'transition-all duration-150',
              'group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_4px_rgba(0,255,255,0.5)]'
            )}
          />
        )}
      </button>

      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        className={cn(
          'group flex h-6 w-6 items-center justify-center rounded-sm',
          'transition-all duration-150',
          'hover:bg-red-500/20'
        )}
        aria-label="Close window"
      >
        <X
          className={cn(
            'h-4 w-4 text-cyan-500/70',
            'transition-all duration-150',
            'group-hover:text-red-400 group-hover:drop-shadow-[0_0_4px_rgba(255,0,0,0.5)]'
          )}
        />
      </button>
    </div>
  )
}

type WindowControlsProps = {
  onMinimize: () => void
  onMaximize: () => void
  onClose: () => void
  isMaximized: boolean
}

export { WindowControls }
