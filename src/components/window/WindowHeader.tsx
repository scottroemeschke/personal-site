/**
 * Window title bar with drag handle.
 *
 * Contains app title and window controls.
 */

import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { WindowControls } from './WindowControls'

function WindowHeader({
  title,
  icon: Icon,
  isActive,
  isMaximized,
  onMinimize,
  onMaximize,
  onClose,
  dragHandleProps,
}: WindowHeaderProps) {
  return (
    <div
      className={cn(
        'flex h-10 items-center justify-between',
        'border-b bg-[hsl(var(--window-header))]',
        'select-none',
        isActive ? 'border-cyan-500/50' : 'border-[hsl(var(--window-border))]'
      )}
    >
      {/* Drag handle area with title */}
      <div className="flex flex-1 items-center gap-2 px-3" {...dragHandleProps}>
        {Icon && (
          <Icon
            className={cn('h-4 w-4 shrink-0', isActive ? 'text-cyan-400' : 'text-cyan-500/50')}
          />
        )}
        <span
          className={cn(
            'truncate text-sm font-medium uppercase tracking-wider',
            isActive ? 'text-cyan-300 text-glow-cyan' : 'text-cyan-500/60'
          )}
        >
          {title}
        </span>
      </div>

      {/* Window controls */}
      <div className="px-2">
        <WindowControls
          onMinimize={onMinimize}
          onMaximize={onMaximize}
          onClose={onClose}
          isMaximized={isMaximized}
        />
      </div>
    </div>
  )
}

type WindowHeaderProps = {
  title: string
  icon?: LucideIcon
  isActive: boolean
  isMaximized: boolean
  onMinimize: () => void
  onMaximize: () => void
  onClose: () => void
  dragHandleProps: {
    onPointerDown: (e: React.PointerEvent) => void
    style: { touchAction: string; cursor: string }
  }
}

export { WindowHeader }
