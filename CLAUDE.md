# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint
npx tsc --noEmit # Type check without emitting
```

## Architecture

Next.js 15 portfolio with Pages Router, MDX content, and Half-Life/Deus Ex inspired UI theme.

### Core Structure

- **`src/pages/index.tsx`** - Main SPA, handles all tabs (Jobs, Experience, Projects, Skills, Books, SysDevOps, ToDo), dynamic MDX loading, and GitHub Stats panel
- **`src/pages/data/`** - Content storage:
  - JSON files (`Skills.json`, `PHP.json`, `Jobs.json`, etc.) define items with metadata
  - `markdown/` subdirectories (`skills/`, `projects/`, `experiences/`, `jobs/`) contain MDX files loaded dynamically via `import()`
  - `error.mdx` - Fallback when markdown not found (3D lambda animation)
- **`src/lib/types.ts`** - Shared TypeScript types (Experience, Project, Skill, Job, Book, etc.)

### Key Components

- **`HalfLifeMenu.tsx` / `MobileHalfLifeMenu.tsx`** - Navigation menu (desktop/mobile)
- **`GitHubStats.tsx`** - GitHub profile stats panel with API integration
- **`PDFCV.tsx`** - CV generation using @react-pdf/renderer
- **`LoadingSequence.tsx`** - Boot sequence loading animation
- **`ErrorDisplay.tsx`** - 3D rotating lambda with matrix rain effect (error state)

### Styling

- Tailwind CSS with custom Half-Life theme classes in `globals.css`
- Primary colors: `rgb(251,150,56)` (orange) and `rgb(166,95,30)` (amber)
- Custom font: HalfLife (Exo variable font)
- Scanline overlay effect on body
- Animation library: Framer Motion

### MDX Integration

MDX files are loaded dynamically in `index.tsx` via `loadMarkdownFile()`. Each content type (skill, project, experience) has its own markdown directory. MDX components receive custom styling via MDXProvider.

### API

- **`/api/generate-cv`** - Server-side CV PDF generation endpoint
