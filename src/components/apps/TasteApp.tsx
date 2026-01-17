/**
 * TASTE.links - External profile links.
 *
 * Placeholder implementation.
 */

import { externalLinkClicked } from '@/lib/events'
import { cn } from '@/lib/utils'
import { useAnalytics } from '@/providers/analytics'
import { ExternalLink } from 'lucide-react'

const PLACEHOLDER_LINKS = [
  { platform: 'GitHub', url: '#', description: 'Code repositories' },
  { platform: 'LinkedIn', url: '#', description: 'Professional profile' },
  { platform: 'Letterboxd', url: '#', description: 'Film diary' },
  { platform: 'Spotify', url: '#', description: 'Music taste' },
  { platform: 'Twitter', url: '#', description: 'Thoughts & updates' },
]

function TasteApp() {
  const analytics = useAnalytics()

  const handleLinkClick = (platform: string, url: string) => {
    analytics.track(externalLinkClicked(platform, url))
    // In real implementation, would navigate to URL
  }

  return (
    <div className="flex h-full flex-col p-4">
      {/* Header */}
      <div className="mb-4 border-b border-cyan-500/30 pb-3">
        <h2 className="text-lg font-bold uppercase tracking-wider text-cyan-300">EXTERNAL LINKS</h2>
        <p className="mt-1 text-xs text-cyan-500/60">NETWORK CONNECTIONS | VERIFIED ENDPOINTS</p>
      </div>

      {/* Links list */}
      <div className="flex-1 space-y-2">
        {PLACEHOLDER_LINKS.map((link) => (
          <button
            key={link.platform}
            type="button"
            onClick={() => handleLinkClick(link.platform, link.url)}
            className={cn(
              'group flex w-full items-center justify-between rounded border p-3',
              'border-cyan-500/30 bg-black/30',
              'transition-all duration-150',
              'hover:border-cyan-400/50 hover:bg-cyan-500/10'
            )}
          >
            <div className="text-left">
              <p className="font-medium text-cyan-300 group-hover:text-cyan-200">{link.platform}</p>
              <p className="text-xs text-cyan-500/60">{link.description}</p>
            </div>
            <ExternalLink
              className={cn(
                'h-4 w-4 text-cyan-500/50',
                'transition-all duration-150',
                'group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
              )}
            />
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 border-t border-cyan-500/20 pt-3">
        <p className="text-center text-xs text-cyan-500/40">— CLICK TO ESTABLISH CONNECTION —</p>
      </div>
    </div>
  )
}

export { TasteApp }
