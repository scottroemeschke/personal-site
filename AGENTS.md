# Neon Desktop — Agent Documentation

> `CLAUDE.md` symlinks here. Always edit `AGENTS.md`.

## Project

Cyberpunk desktop-style personal site. Visitors explore via draggable windows, icons, and a dock — not traditional scrolling. See `docs/DESIGN.md` for the full vision.

## Commands

```bash
pnpm dev                    # Dev server: localhost:5173
pnpm build                  # Production build
pnpm preview                # Preview production build
pnpm test                   # Unit tests
pnpm test src/lib/foo.ts    # Single file
pnpm test:e2e               # E2E (needs dev server)
pnpm typecheck              # Type check
pnpm lint                   # Biome lint
pnpm lint:fix               # Biome auto-fix
pnpm storybook              # Component dev: localhost:6006
```

## Stack

React 19, TypeScript (strict), Tailwind, Zustand, Vitest, Playwright, Biome, Vercel, Sentry, PostHog

**Note:** No shadcn/ui — all UI is custom cyberpunk components.

## Directory Structure

```
src/
├── components/
│   ├── desktop/        # Desktop shell (wallpaper, dock, icons)
│   ├── window/         # Window manager components
│   └── apps/           # App windows (About, Taste, Projects, Deaddrop)
├── stores/             # Zustand stores (window state, settings)
├── lib/                # utils.ts, sentry.ts, analytics.ts, events.ts
├── providers/          # React Context providers
├── types/              # TypeScript definitions
├── styles/             # Global CSS, Tailwind, cyberpunk theme
├── content/            # Static content (JSON/MD for apps)
└── test/               # Test setup, fixtures
```

---

## Conventions

### Components

```tsx
// Function declarations, props interface, export at bottom
function Window({ title, children, onClose }: WindowProps) {
  return /* ... */
}

type WindowProps = {
  title: string
  children: React.ReactNode
  onClose: () => void
}

export { Window }
```

### State (Zustand)

Window manager state lives in Zustand:

```tsx
// stores/windows.ts
interface WindowState {
  windows: Window[]
  focusedId: string | null
  openWindow: (id: string) => void
  closeWindow: (id: string) => void
  focusWindow: (id: string) => void
  updatePosition: (id: string, pos: Position) => void
}

// Use selectors for performance
const windows = useWindowStore((s) => s.windows)
const focusedId = useWindowStore((s) => s.focusedId)
```

### Styling

All custom cyberpunk CSS — no component library:

```tsx
// Use cn() helper for conditional classes
<div className={cn(
  "border border-cyan-500/30 bg-black/80 backdrop-blur",
  isActive && "border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.3)]"
)} />
```

### Library Integration

**Always check type signatures and official docs before implementing.** Never assume APIs from memory.

---

## Git Workflow

**Before starting work:**
- Search existing issues (`gh issue list`)
- Create an issue if one doesn't exist
- Create feature branch: `git checkout -b {type}/{issue}-{description}`

**Always:**
- Reference issue in PR (`Closes #123`)
- Wait for CI to pass before merging
- Use `gh` CLI for GitHub operations

**Never:**
- Push directly to `main`
- Use `--force` or bypass flags without explicit approval
- Merge with failing CI

---

## Testing

**Philosophy:**
- Fakes over mocks — reusable test doubles, not inline `vi.mock()`
- Real code paths — test through actual components
- Test pyramid — many unit tests, some integration, minimal E2E

**Window manager tests:**
- Test state transitions (open, close, focus, minimize)
- Test z-index ordering
- Test position persistence

---

## Analytics (PostHog)

Use typed events from `@/lib/events`:

```tsx
import { useAnalytics } from '@/providers/analytics'
import { windowOpened, windowClosed } from '@/lib/events'

function Window() {
  const analytics = useAnalytics()
  analytics.track(windowOpened('ABOUT.exe'))
}
```

**Naming conventions:**
- Event names: `object_verb` snake_case (e.g., `window_opened`, `icon_clicked`)
- Property names: snake_case (e.g., `window_id`, `app_name`)

---

## Environment

All vars prefixed with `VITE_`:

```bash
VITE_SENTRY_DSN=...           # Error monitoring
VITE_POSTHOG_KEY=...          # Analytics
VITE_POSTHOG_HOST=...         # Analytics host
```

Access: `import.meta.env.VITE_SENTRY_DSN`

---

## Deployment

Vercel via GitHub Actions. Push to `main` → production. PR → preview URL.

---

## Design Reference

See `docs/DESIGN.md` for:
- Desktop layout spec
- App window contents (ABOUT, TASTE, PROJECTS, DEADDROP)
- Micro-interactions
- Easter eggs
- Build phases
