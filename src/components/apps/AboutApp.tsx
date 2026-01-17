/**
 * ABOUT.exe - Identity/bio app.
 *
 * Placeholder implementation.
 */

import { cn } from '@/lib/utils'

function AboutApp() {
  return (
    <div className="flex h-full flex-col p-4">
      {/* Header */}
      <div className="mb-4 border-b border-cyan-500/30 pb-3">
        <h2 className="text-lg font-bold uppercase tracking-wider text-cyan-300">
          OPERATOR PROFILE
        </h2>
        <p className="mt-1 text-xs text-cyan-500/60">CLEARANCE: PUBLIC | STATUS: ACTIVE</p>
      </div>

      {/* Content placeholder */}
      <div className="flex-1 space-y-4">
        {/* ID Badge area */}
        <div
          className={cn(
            'flex items-center gap-4 rounded border border-cyan-500/30 bg-black/50 p-4'
          )}
        >
          {/* Avatar placeholder */}
          <div
            className={cn(
              'flex h-20 w-20 shrink-0 items-center justify-center',
              'rounded border border-cyan-500/50 bg-cyan-500/10'
            )}
          >
            <span className="text-2xl text-cyan-400">[?]</span>
          </div>

          {/* Info */}
          <div className="space-y-1">
            <p className="font-bold text-cyan-300">UNKNOWN OPERATOR</p>
            <p className="text-sm text-cyan-500/70">Designation: TBD</p>
            <p className="text-sm text-cyan-500/70">Location: REDACTED</p>
          </div>
        </div>

        {/* Bio placeholder */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase text-cyan-400">&gt; PROFILE DATA</h3>
          <div className="rounded border border-cyan-500/20 bg-black/30 p-3">
            <p className="text-sm leading-relaxed text-cyan-500/80">
              This profile has not yet been configured. Content will be added in a future update.
            </p>
          </div>
        </div>

        {/* Skills/tech placeholder */}
        <div className="space-y-2">
          <h3 className="text-sm font-bold uppercase text-cyan-400">&gt; TECH STACK</h3>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Node.js', 'More...'].map((tech) => (
              <span
                key={tech}
                className={cn(
                  'rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-1',
                  'text-xs text-cyan-400'
                )}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 border-t border-cyan-500/20 pt-3">
        <p className="text-center text-xs text-cyan-500/40">— END OF RECORD —</p>
      </div>
    </div>
  )
}

export { AboutApp }
