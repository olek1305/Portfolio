# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint (next lint)
npx tsc --noEmit # Type check without emitting
```

There are no tests in this project.

## Architecture

Next.js 15 portfolio (Pages Router) with MDX content and a Half-Life / Deus Ex inspired UI theme. The whole app is a single SPA driven from `src/pages/index.tsx`; it does not use the App Router.

### State model (the big picture)

The portfolio is a two-panel SPA. Most behavior is governed by three flags that live in `index.tsx` (and a duplicate of the same shape in `src/hooks/usePortfolioState.ts`):

- `activeTab` — which nav category is selected (drives the **left** panel's list)
- `showGitHubStats` — whether GitHub Stats is shown in the **right** panel
- `showMain` — whether the loaded MDX (`MdxComponent`) is shown in the right panel

`showGitHubStats` and `showMain` are mutually exclusive in practice. When both are false the right panel is empty (the hex-grid `Background` shows through). Clicking an item in the left panel calls `handleSelectMarkdown(...)` → loads MDX → `setShowMain(true) + setShowGitHubStats(false)`.

There are **two parallel tab-change paths** that diverge in subtle ways:
- **Desktop**: `HalfLifeMenu`'s inline `onTabChange` only updates `activeTab` — it does NOT touch `showMain` / `showGitHubStats`. So selecting a new tab while MDX is open keeps MDX visible.
- **Mobile**: `handleMobileTabChange` clears both flags (right-panel "window" closes when you tap a nav item).

If you're changing tab navigation behavior, update **both** paths or you'll get inconsistent UX between mobile and desktop.

### MDX loading convention

`loadMarkdownFile(path)` in `index.tsx` does a dynamic `import('./data/markdown/${path}')` and falls back to `error.mdx` on failure. `handleSelectMarkdown(category, name, fileName?, tab?)` resolves the path from category:

| `category` arg            | Resolved path                                |
|---------------------------|----------------------------------------------|
| `"skills"`                | `skills/${fileName ?? slug(name)}.mdx`       |
| `"projects"` / `"experiences"` / `"jobs"` | `${category}/${slug(name) or fileName}.mdx` |

Where `slug(x)` is `x.toLowerCase().replace(/\s+/g, "-")`. So **JSON entries with multi-word names need a `fileName` field** (or a matching kebab-case MDX file).

### Content data flow

`src/pages/data/`:
- `*.json` — metadata for list rendering (e.g. `PHP.json` has `experience[]` and `projects[]`; `Skills.json` has `skills[]` etc.). The `tabDataMap` in `usePortfolioState.ts` (and the `switch` in `index.tsx`) maps `activeTab` strings to these JSON imports.
- `markdown/{skills,projects,experiences,jobs}/*.mdx` — detail content shown in the right panel when an item is clicked.
- `markdown/error.mdx` — fallback rendered if the requested MDX import throws.

To add a new portfolio item: add an entry to the relevant JSON, then create a matching MDX file under the corresponding `markdown/` subdirectory (kebab-case filename matching `slug(name)` or the explicit `fileName` field).

### Background and z-index layering

`src/components/Background.tsx` renders a full-viewport `<canvas>` with inline `position: fixed; width: 100vw; height: 100vh; zIndex: 0` and `pointer-events: none`. It draws a hex grid + pulse waves on `#050302`. **Do not rely on `inset-0` Tailwind to size canvas elements** — `<canvas>` is a replaced element with intrinsic 300×150 dimensions and CSS-only positioning is unreliable; sizing is done with `window.innerWidth/innerHeight`, not `getBoundingClientRect`.

For the canvas to be visible:
- The main app container is `relative z-[1]` with no background (transparent stacking context above the canvas).
- UI panels (header, sidebar, left panel, footer) use `bg-[#0a0a0a]/70` or `bg-[#121212]/50` so the hex grid bleeds through.
- The right content panel is fully transparent.
- Specific `.hl-container` blocks marked with `!bg-transparent` (Skills, DevOps Topics, PHP Experience, PHP Projects) override the default 80% dark `.hl-container` background so the canvas is fully visible inside them.

### Styling

- Tailwind 3 + handcrafted Half-Life classes in `src/styles/globals.css` (`.hl-container`, `.hl-title`, `.glitch-text`, `.btn-hl`, `.pulse-glow`, etc.)
- Primary accent: `rgb(251, 150, 56)` orange and `rgb(166, 95, 30)` amber. Don't introduce new accent colors without checking globals.css first.
- Custom font: HalfLife (Exo variable font) loaded via `@font-face`.
- `.hl-container` has a default 80% opaque dark background. Use `!bg-transparent` to override per-instance.

### Environment variables

CV contact info is read at runtime from `NEXT_PUBLIC_*` envs (set in Vercel for production):
- `NEXT_PUBLIC_EMAIL`, `NEXT_PUBLIC_PHONE`, `NEXT_PUBLIC_GITHUB_URL`, `NEXT_PUBLIC_LOCATION`

### API

- `pages/api/generate-cv.ts` — server-side CV PDF generation using `@react-pdf/renderer` (the `PDFCV.tsx` component is the document definition; the API route streams it).

### Known caveats

- `src/hooks/usePortfolioState.ts` exists but `index.tsx` keeps a near-duplicate copy of the same state inline. Treat the hook as a reference implementation; **edits to behavior currently need to go in `index.tsx`** unless you also rewire the page to consume the hook.
- `vanta` is in `package.json` but not imported anywhere — leftover.
- `framer-motion` is installed but used sparsely; most animation is CSS keyframes in globals.css or canvas-based.
