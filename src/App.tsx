import { createNoopAnalytics, createPostHogAnalytics } from './lib/analytics'
import { AnalyticsProvider } from './providers/analytics'

// Create analytics instance (uses PostHog if configured, otherwise no-op)
const analytics = import.meta.env.VITE_POSTHOG_KEY
  ? createPostHogAnalytics()
  : createNoopAnalytics()

function App() {
  return (
    <AnalyticsProvider analytics={analytics}>
      <div className="h-screen w-screen overflow-hidden bg-[hsl(var(--background))] scanlines">
        {/* Desktop surface */}
        <div className="relative h-full w-full">
          {/* Placeholder - Desktop will go here */}
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <h1 className="text-4xl font-bold text-cyan-400 text-glow-cyan">
              NEON_DESKTOP.sys
            </h1>
            <p className="text-muted-foreground font-mono text-sm">
              // initializing window manager...
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4 text-xs text-cyan-500/60">
              <div className="border border-cyan-500/20 bg-black/40 px-4 py-2">
                ABOUT.exe
              </div>
              <div className="border border-cyan-500/20 bg-black/40 px-4 py-2">
                TASTE.links
              </div>
              <div className="border border-cyan-500/20 bg-black/40 px-4 py-2">
                PROJECTS.log
              </div>
              <div className="border border-cyan-500/20 bg-black/40 px-4 py-2">
                DEADDROP.msg
              </div>
            </div>
          </div>

          {/* Ambient HUD - bottom right */}
          <div className="absolute bottom-4 right-4 text-xs text-cyan-500/40 font-mono">
            <div>SYS.TIME: {new Date().toLocaleTimeString()}</div>
            <div>BUILD: v0.1.0-dev</div>
          </div>
        </div>
      </div>
    </AnalyticsProvider>
  )
}

export { App }
