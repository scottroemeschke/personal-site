/**
 * Individual dock button.
 *
 * Shows app icon with running indicator and focus state.
 */

import { cn } from '@/lib/utils'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

function DockItem({ label, iconName, isOpen, isActive, isMinimized, onClick }: DockItemProps) {
  // Get the Lucide icon component
  const IconComponent =
    (LucideIcons as unknown as Record<string, LucideIcon>)[iconName] ?? LucideIcons.File

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative flex h-10 items-center gap-2 px-3',
        'border-r border-cyan-500/20',
        'transition-all duration-150',
        'hover:bg-cyan-500/10',
        isActive && 'bg-cyan-500/15'
      )}
      title={label}
    >
      {/* Icon */}
      <IconComponent
        className={cn(
          'h-4 w-4 shrink-0',
          'transition-all duration-150',
          isActive
            ? 'text-cyan-300 drop-shadow-[0_0_4px_rgba(0,255,255,0.5)]'
            : isOpen
              ? 'text-cyan-400'
              : 'text-cyan-500/50',
          'group-hover:text-cyan-300'
        )}
      />

      {/* Label */}
      <span
        className={cn(
          'text-xs font-medium uppercase tracking-wider',
          'transition-colors duration-150',
          isActive ? 'text-cyan-300' : 'text-cyan-500/70',
          'group-hover:text-cyan-300',
          'hidden sm:inline'
        )}
      >
        {label}
      </span>

      {/* Running indicator */}
      {isOpen && (
        <div
          className={cn(
            'absolute bottom-0 left-1/2 h-0.5 w-4 -translate-x-1/2',
            'transition-all duration-150',
            isActive ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.5)]' : 'bg-cyan-500/50',
            isMinimized && 'opacity-50'
          )}
        />
      )}
    </button>
  )
}

type DockItemProps = {
  label: string
  iconName: string
  isOpen: boolean
  isActive: boolean
  isMinimized: boolean
  onClick: () => void
}

export { DockItem }
