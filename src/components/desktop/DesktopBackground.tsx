/**
 * Reactive desktop background.
 *
 * Features:
 * - Animated grid pattern
 * - Mode-based color shifts (idle, alert, hacking, glitch)
 * - Subtle CRT scanlines
 */

import { cn } from '@/lib/utils'
import { useDesktopStore } from '@/stores/desktop-store'

function DesktopBackground() {
  const backgroundMode = useDesktopStore((s) => s.backgroundMode)

  return (
    <div className={cn('absolute inset-0 overflow-hidden', 'transition-all duration-500')}>
      {/* Base gradient */}
      <div
        className={cn(
          'absolute inset-0',
          'transition-all duration-500',
          backgroundMode === 'idle' &&
            'bg-gradient-to-br from-[hsl(220,30%,4%)] via-[hsl(220,25%,6%)] to-[hsl(220,20%,8%)]',
          backgroundMode === 'alert' &&
            'bg-gradient-to-br from-[hsl(0,30%,8%)] via-[hsl(0,25%,6%)] to-[hsl(220,20%,8%)]',
          backgroundMode === 'hacking' &&
            'bg-gradient-to-br from-[hsl(120,30%,4%)] via-[hsl(120,25%,6%)] to-[hsl(220,20%,8%)]',
          backgroundMode === 'glitch' &&
            'bg-gradient-to-br from-[hsl(300,30%,6%)] via-[hsl(280,25%,4%)] to-[hsl(220,20%,8%)]'
        )}
      />

      {/* Animated grid */}
      <div
        className={cn(
          'absolute inset-0',
          'opacity-20',
          'transition-opacity duration-500',
          backgroundMode === 'idle' && 'opacity-10',
          backgroundMode === 'alert' && 'opacity-30',
          backgroundMode === 'hacking' && 'opacity-25',
          backgroundMode === 'glitch' && 'opacity-35'
        )}
        style={{
          backgroundImage: `
            linear-gradient(to right, ${getGridColor(backgroundMode)} 1px, transparent 1px),
            linear-gradient(to bottom, ${getGridColor(backgroundMode)} 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-scroll 20s linear infinite',
        }}
      />

      {/* Radial vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />

      {/* Mode-specific glow */}
      <div
        className={cn(
          'absolute inset-0',
          'opacity-0 transition-opacity duration-500',
          backgroundMode === 'alert' && 'opacity-100'
        )}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,0,0,0.1) 0%, transparent 70%)',
        }}
      />

      <div
        className={cn(
          'absolute inset-0',
          'opacity-0 transition-opacity duration-500',
          backgroundMode === 'hacking' && 'opacity-100'
        )}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,255,128,0.1) 0%, transparent 70%)',
        }}
      />

      {/* Scanlines overlay */}
      <div className="absolute inset-0 pointer-events-none scanlines" />

      {/* CSS for grid animation */}
      <style>{`
        @keyframes grid-scroll {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }
      `}</style>
    </div>
  )
}

function getGridColor(mode: string): string {
  switch (mode) {
    case 'alert':
      return 'rgba(255, 100, 100, 0.3)'
    case 'hacking':
      return 'rgba(0, 255, 128, 0.3)'
    case 'glitch':
      return 'rgba(255, 0, 255, 0.3)'
    default:
      return 'rgba(0, 255, 255, 0.15)'
  }
}

export { DesktopBackground }
