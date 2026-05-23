# TropiX — CLAUDE.md

## Stack

- **React 19** + **Vite 8** + **TypeScript 6**
- **Tailwind CSS v4** (config inline in `src/index.css` via `@theme inline`)
- **shadcn/base-ui** for base components
- **Lucide React** for icons (+ 4 custom domain glyphs in `assets/icons/`)
- Hash-based routing via `window.location.hash` (no React Router)

## Dev commands

```bash
npm run dev      # Vite dev server → localhost:5173
npm run build    # tsc -b && vite build
npm run lint     # ESLint
```

## Project structure

```
src/
├── components/
│   ├── sections/   # Landing page sections (Nav, Hero, Challenge…)
│   ├── demo/       # Demo page sub-components
│   ├── pilot/      # PilotForm
│   ├── platform/   # Platform preview sub-components
│   └── ui/         # shadcn base components
├── data/           # Static data (pilotData, demoData, platformData)
├── hooks/          # useInView
├── pages/          # Demo.tsx, Platform.tsx
└── App.tsx         # Root — hash router
```

## Visual system — "Strumento al Sole"

Design brief: `TropiX Design System/design_handoff_landing_site/`

### Palette

| Token (CSS var) | Hex | Use |
|---|---|---|
| `--bg` | `#E8E1CF` | Page background |
| `--bg-elevated` | `#F0EADB` | Cards, elevated surfaces |
| `--dark` | `#191E1A` | Primary text, dark sections bg |
| `--dark-2` | `#2A3330` | Secondary dark surface |
| `--mid` | `#546357` | Mid-tone green |
| `--accent` | `#CC5427` | Terracotta — sole CTA/accent color |
| `--accent-hover` | `#A8421C` | Hover/pressed state |
| `--stone` | `#BDB5A0` | Borders, dividers |
| `--stone-dark` | `#7A7060` | Secondary text |

No white (`#ffffff`), no black (`#000000`), no old bosco/carta/pietra/ambra palette.

### Typography

- **Display/Heading**: `'DM Serif Display', serif`
- **Body/UI**: `'Barlow Semi Condensed', sans-serif` (CSS default via `--font-sans`)
- **Data/Tags/Mono**: `'IBM Plex Mono', monospace`

Google Fonts loaded in `index.html`.

### Section eyebrow pattern

Every section opens with an instrument tag:

```tsx
<div style={{ marginBottom: '24px' }}>
  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
    letterSpacing: '0.14em', textTransform: 'uppercase', color: '#CC5427', fontWeight: 500 }}>
    SYS-02
  </span>
  <span aria-hidden="true">{' · '}</span>
  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px',
    letterSpacing: '0.14em', textTransform: 'uppercase', color: '#BDB5A0' }}>
    THE SYSTEM
  </span>
</div>
```

Current codes: `TRP-00` Hero · `PRB-01` Challenge · `SYS-02` System · `CAP-03` Capabilities · `OPS-04` InSeason · `MKT-05` Market · `PIL-06` Pilot · `TEM-07` Team

### Layout rules

- Container max-width: `1280px`, padding: `px-6 sb:px-20` (Tailwind)
- Custom breakpoint `sb:` = 900px (defined in `@theme inline`)
- Borders over shadows: `1px solid #BDB5A0` is the default card elevation
- Border-radius: `4px` cards/buttons, never capsule
- No inline `padding: '0 80px'` hardcoded — use Tailwind responsive classes

## Conventions

- **Animations**: `IntersectionObserver` + CSS transitions. Easing: `cubic-bezier(0.2, 0.7, 0.2, 1)`. No bounce, no spring.
- **Inline styles**: acceptable for dynamic/animated values; static styles prefer Tailwind
- **Icons**: Lucide (`lucide-react`). No emoji, no Unicode bullets.
- **Copy tone**: specific over abstract, no superlatives, sentence case, latin species names in `<em>`
- **Accessibility**: `aria-hidden="true"` on decorative separators (dots, lines, `·`)
- **No dark mode toggle** — page uses explicit color values, not CSS `prefers-color-scheme`

## Key files

| File | What it does |
|---|---|
| `src/index.css` | All design tokens (`@theme inline`), base styles |
| `src/App.tsx` | Hash router — landing / platform / demo |
| `src/data/pilotData.ts` | Pilot "included" items list |
| `TropiX Design System/` | Brand brief, mock HTML, screenshots (reference only) |
