# NEON DESKTOP — Cyberpunk Personal Site (Desktop‑Style)

*A PostHog-style desktop website, but fully cyberpunk: draggable windows, icons, a dock, playful easter eggs, and real information hidden inside cool UI.*

---

## Why this format

* **Exploration over scrolling**: visitors *play* with the site.
* **Information as apps**: each section becomes a "program" you open.
* **Cyberpunk vibes by default**: HUD overlays, glitch states, neon chrome.
* **Fast + cheap**: static content + a small JS window manager; no LLM spend.

> Inspiration note: PostHog's site literally runs inside a desktop-like environment where pages are draggable windows rather than traditional navigation. This is exactly the vibe we're riffing on. (We'll just make it *much* more cyberpunk.)

---

# Desktop Layout (Global)

## Desktop surface

* **Wallpaper**: animated city grid / rain + subtle scanlines
* **Ambient HUD**: tiny status text (time, "signal", build hash)
* **Icons on desktop** (double‑click to open windows)

### Suggested desktop icons

* `ABOUT.exe`
* `TASTE.dll`
* `PROJECTS.log`
* `SIMULATOR.sys`
* `MEMORY.fragments`
* `DEADDROP.msg`
* `SETTINGS.cfg`

## Dock / taskbar

* Left: "Start" glyph (opens app launcher)
* Middle: pinned apps (icons)
* Right: clock, battery/signal, "mute" toggle

## Window manager rules

* Draggable windows with focus + z‑index
* Minimize / maximize / close
* Snap (optional): left/right halves
* Remember last positions in `localStorage` (optional)

---

# Apps (Sections) — What each window contains

## ✅ Scope (current plan)

We're keeping the desktop tight and shippable:

* **ABOUT.exe** (identity)
* **TASTE.links** (external profiles)
* **PROJECTS.log** (resume/projects list)
* **DEADDROP.msg** (contact form)

Removed for now:

* SIMULATOR.sys
* MEMORY.fragments
* SETTINGS.cfg

---

## 1) ABOUT.exe (Identity)

**Goal:** instantly communicate who you are, with style.

### Window title

`ABOUT.exe — Identity Profile`

### Layout

**Left column**

* **ID Badge** card (hologram frame)

  * Handle / Name
  * Role tagline (1 line)
  * Location (London)
  * "Clearance" (fun)
  * "Primary focus" chips
* **Portrait slot** (optional)

  * Could be a stylized silhouette / vector avatar (no need for real photo)

**Right column**

* **Short bio panel** (3–6 lines max)
* **Core traits** (3 cards)

  * Systems-minded
  * Creative builder
  * Taste-curious nerd
* **Quick stats** (tiny HUD)

  * Favorite vibes: cyberpunk + fantasy
  * Favorites: NieR / Bloodborne / Hollow Knight

### Micro-interactions

* On open: a scanline passes over the ID badge
* Hover: subtle hologram tilt
* Click: "Copy handle" / "Copy email" mini actions (optional)

### Copy prompts to fill

* One-liner: what you do
* One-liner: what you love
* Tiny "thesis" (what you optimize for when building)

---

## 2) TASTE.links (External Profiles)

**Goal:** taste is better offsite; this app is a launchpad.

### Window title

`TASTE.links — External Archives`

### Layout

* Top: **Search bar** (filters links)
* Middle: **Link grid** of "platform tiles"
* Bottom: "Last sync" style tiny text (pure flavor)

### Platform tiles (suggested)

* **Letterboxd** (movies)
* **Spotify** (music)
* **League of Comic Geeks** (comics)
* **Backloggd / IGDB / Steam** (games) — pick one
* Optional extras:

  * GitHub (code)
  * Goodreads (books) or AniList (anime)

### Tile content format

* Platform icon + name
* One line description (e.g. "films rated + short reviews")
* CTA: **OPEN**

### Micro-interactions

* Tiles animate like "app shortcuts" (press-in)
* Hover tooltip: "opens external network node"

---

## 3) PROJECTS.log (Resume / Work)

**Goal:** your resume, but presented as a ship log.

### Window title

`PROJECTS.log — Shipments & Work History`

### Layout

**Left: Timeline feed**

* Each entry is a "deployment" card:

  * Company / Team
  * Role
  * Dates
  * 1-line summary

**Right: Detail panel**

* Bullets (impact + scope)
* Technologies used (chips)
* 1–2 "signature moments" (optional)

### Content rules

* Keep it concrete:

  * scale, reliability, leadership, delivery
* Avoid fluff adjectives

### Micro-interactions

* Clicking a timeline card loads details with a brief "diff" animation
* Optional: "export PDF" link (later)

---

## 4) DEADDROP.msg (Contact)

**Goal:** contact form with badass cyberpunk tone, still usable.

### Window title

`DEADDROP.msg — Secure Transmit`

### Layout

* Intro line: "Send a secure packet."
* Fields:

  * Name
  * Email
  * Message
* Buttons:

  * **ENCRYPT & SEND**
  * **COPY ADDRESS** (email copy)

### Visual flavor

* "Encryption progress" bar on submit (even if instant)
* Success toast: "Packet delivered."
* Failure toast: "Transmission failed. Retry."

### Implementation notes

* Prefer a no-backend form service initially:

  * Vercel forms / Formspree / Netlify Forms (choose later)

---

# Easter Eggs (Optional but fun)

(Optional but fun)

* **Konami code** unlocks "DEVTOOLS" window
* Hidden right‑click context menu: `NEW WINDOW` / `SHUFFLE ICONS`
* Fake "access denied" popup that turns into a joke
* "Night City Radio" mode: visual equalizer only (no audio)
* Rare event: "SYSTEM RECOVERY" overlay if too many windows opened

---

# Build Plan (Minimal → Wow)

## Phase 1 — Core desktop (1 session)

* Desktop background + dock
* Window manager (drag/focus/close)
* 3 apps: ABOUT, TASTE, PROJECTS

## Phase 2 — Toys + polish

* Add SIMULATOR toy (choose one)
* Add MEMORY shards
* Add SETTINGS toggles

## Phase 3 — Easter eggs + vibe

* Context menu, shortcuts, hidden window
* Little glitch transitions + scanline passes

---

# Tech Notes (for later)

* Works great as **Astro** (static shell) + interactive islands for the desktop + windows.
* Or **SvelteKit/React** if you want everything as a single interactive app.
* Store content in JSON/MD files; avoid databases.

---

# Next Brainstorm Pass (section-by-section)

1. Decide exact app list + icon names
2. Write ABOUT.exe copy + ID badge fields
3. Write TASTE.dll tags + "why it hits" lines
4. List 3–6 projects + how to present them
5. Pick the ONE simulator toy and define its UI
6. Pick 3 easter eggs you actually want
