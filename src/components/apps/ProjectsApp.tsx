/**
 * PROJECTS.log - Portfolio/work history.
 *
 * Placeholder implementation styled as a ship's log.
 */

import { projectViewed } from '@/lib/events'
import { cn } from '@/lib/utils'
import { useAnalytics } from '@/providers/analytics'

const PLACEHOLDER_PROJECTS = [
  {
    id: 'project-1',
    title: 'PROJECT ALPHA',
    date: '2024.12.15',
    status: 'COMPLETE',
    description: 'Placeholder project entry. Details to be added.',
  },
  {
    id: 'project-2',
    title: 'PROJECT BETA',
    date: '2024.10.22',
    status: 'COMPLETE',
    description: 'Another placeholder project. More content coming soon.',
  },
  {
    id: 'project-3',
    title: 'PROJECT GAMMA',
    date: '2024.08.01',
    status: 'IN_PROGRESS',
    description: 'Work in progress. Current focus area.',
  },
]

function ProjectsApp() {
  const analytics = useAnalytics()

  const handleProjectClick = (projectId: string) => {
    analytics.track(projectViewed(projectId))
  }

  return (
    <div className="flex h-full flex-col p-4">
      {/* Header */}
      <div className="mb-4 border-b border-cyan-500/30 pb-3">
        <h2 className="text-lg font-bold uppercase tracking-wider text-cyan-300">MISSION LOG</h2>
        <p className="mt-1 text-xs text-cyan-500/60">RECORD OF COMPLETED OPERATIONS</p>
      </div>

      {/* Log entries */}
      <div className="flex-1 space-y-3 overflow-auto">
        {PLACEHOLDER_PROJECTS.map((project, index) => (
          <button
            key={project.id}
            type="button"
            onClick={() => handleProjectClick(project.id)}
            className={cn(
              'group w-full text-left rounded border p-3',
              'border-cyan-500/30 bg-black/30',
              'transition-all duration-150',
              'hover:border-cyan-400/50 hover:bg-cyan-500/10'
            )}
          >
            {/* Log header */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-cyan-500/50">
                LOG #{String(index + 1).padStart(3, '0')}
              </span>
              <span className="font-mono text-xs text-cyan-500/50">{project.date}</span>
            </div>

            {/* Title and status */}
            <div className="mt-2 flex items-center gap-2">
              <h3 className="font-bold text-cyan-300 group-hover:text-cyan-200">{project.title}</h3>
              <span
                className={cn(
                  'rounded px-1.5 py-0.5 text-xs',
                  project.status === 'COMPLETE'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                )}
              >
                {project.status}
              </span>
            </div>

            {/* Description */}
            <p className="mt-1 text-sm text-cyan-500/70">{project.description}</p>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 border-t border-cyan-500/20 pt-3">
        <p className="text-center text-xs text-cyan-500/40">
          — {PLACEHOLDER_PROJECTS.length} ENTRIES FOUND —
        </p>
      </div>
    </div>
  )
}

export { ProjectsApp }
