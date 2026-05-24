# Demo Redesign — Full Spec
**Date:** 2026-05-24  
**Status:** Approved for implementation

---

## 1. Summary

Replace the current tab-based demo (dot grid + list views) with a **cockpit layout**: three persistent columns — alert sidebar, aerial-image map with zoomable circle overlays, tree detail panel. No tabs. Everything visible simultaneously.

Primary audience: farmers. Goal: feels like the real product they'd use every morning.

---

## 2. Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ HEADER (52px dark)                                                  │
├──────────────────┬──────────────────────────────┬───────────────────┤
│  LEFT SIDEBAR    │  CENTER — AERIAL MAP         │  RIGHT PANEL      │
│  220px · dark    │  flex-grow · image + SVG     │  340px · slides   │
│                  │  zoom + pan enabled          │  in on tree click │
│  • Farm health   │                              │                   │
│  • Weather strip │  circles per tree            │  PlantPanel       │
│  • Alert list    │  color-coded status          │  (reworked)       │
│  • Action list   │  click → opens right panel   │                   │
│                  │  zoom: scroll wheel / pinch  │                   │
│                  │  pan: drag                   │                   │
└──────────────────┴──────────────────────────────┴───────────────────┘
```

### Column specs
| Column | Width | Background | Scroll |
|---|---|---|---|
| Left sidebar | 220px fixed | `#191E1A` | Internal scroll |
| Center map | flex-grow | `#191E1A` (letterbox) | No — pan via drag |
| Right panel | 340px, hidden→visible | `#F0EADB` | Internal scroll |

Right panel: does **not** compress the map. It overlays on top of the right edge of the map (absolute positioned). Map image remains full-size always.

---

## 3. Header

Same height (52px), dark. Changes from current:

- **Remove** the separate KPI stats strip (was its own band). Fold into header as inline chips.
- **Header chips** (right of farm name): `120 trees` · `4 alerts` · `3 urgent` — small mono text, updates live.
- **Add** subtle `Reset demo` text button far right (before "Back to site"). Resets all state to initial. Labeled `RESET` in IBM Plex Mono at low opacity, same style as "Back to site".
- `Back to site` link: increase opacity to 55% (currently 35% — too hidden).

---

## 4. Left Sidebar

Three sections stacked, separated by 1px `rgba(232,225,207,0.07)` dividers.

### 4a. Farm health chip
```
108 healthy  ●  4 alerts
```
Single line. Green dot for healthy count, red dot for alert count. IBM Plex Mono 11px. Padding `16px 16px 12px`. Acts as a summary, not interactive.

### 4b. Weather strip
Three-day compact strip. Static demo data:

| Day | Icon | Temp | Note |
|---|---|---|---|
| Today | ⛅ | 28°C | Partly cloudy |
| Tomorrow | ☀️ | 34°C | Heat — irrigation priority |
| Sun 26 | 🌤️ | 31°C | Warm |

Tomorrow highlighted with a faint amber background because it's the reason several irrigation alerts exist. This makes irrigation recommendations feel logical to the farmer rather than arbitrary.

Source label at bottom: `Weather · Ragusa, SIC · ARPA Sicilia` in 9px mono stone.

### 4c. Alert list
Header: `ALERTS · 4` in IBM Plex Mono 10px uppercase terracotta.

Each row:
```
🔴  A-14  Phytophthora cin.  91%  ·  14d early  [OVERDUE]
🔴  B-10  Colletotrichum gl.  87%  ·  12d early
🟠  A-31  Phytophthora cin.  78%  ·  14d early
🟠  C-08  Phytophthora cin.  72%  ·  11d early
```

- Colored dot (status color), not emoji
- Tree label in mono bold
- Disease name truncated to fit (title tooltip on hover)
- Probability in mono red
- `·  Xd early` — **always shown**, this is TropiX's core value prop
- `[OVERDUE]` badge: shown if `detectedAt` is >24h ago with no intervention marked done. Currently applies to A-14 (detected 23 May, now 24 May, untreated). Badge in red, IBM Plex Mono 9px.

Clicking any row: centers + highlights that tree on the map, opens the right panel.

### 4d. Action list
Header: `ACTIONS TODAY` in IBM Plex Mono 10px uppercase stone.

Unified list (no "today" vs "scheduled" split). Sorted: overdue first, then by scheduledFor time, then priority. Each row is a single line:

```
[URGENT]  Treat A-14 · Phytophthora           today
[URGENT]  Treat B-10 · Colletotrichum          today
[HIGH  ]  Monitor A-31 · 48h watch            within 48h
[HIGH  ]  Treat C-08 · Phytophthora           tomorrow
[MED   ]  Irrigate × 5 trees                  tomorrow 08:00
[MED   ]  Irrigate C-32                       today 19:00
[LOW   ]  Fertilize · N · Zone North          28 May
[LOW   ]  Fertilize · Ca+P · 4 trees          29 May
```

Priority badge: color-coded as current design. No "mark done" here — that lives in the right panel. Clicking a row highlights the relevant tree(s) on the map and opens the right panel.

**Multi-tree actions**: clicking "Irrigate × 5 trees" highlights all 5 circles simultaneously on the map (stroke becomes `#CC5427` for all 5). Right panel shows the intervention detail (not a specific tree panel).

---

## 5. Center — Aerial Map

### 5a. Background image
A real aerial/drone photograph of a tropical orchard (avocado or mango canopy from above). Requirements:
- Aspect ratio: roughly 4:3 or 16:9 landscape
- Visible tree canopies from directly above (nadir view)
- Ideally shows row structure
- Color: green canopy + brown/ochre soil — natural fit with the palette

**Source:** Unsplash royalty-free. Candidate: search `unsplash avocado orchard aerial`. Fallback: CSS-generated gradient with circular green blobs if no suitable image found.

Image is placed as `<img>` inside a scrollable/zoomable container (see §5c). Aspect ratio preserved, letterboxed in `#191E1A` if needed.

### 5b. SVG overlay
Full-size `<svg>` absolutely positioned over the image, same dimensions. Contains:

**Per tree:**
- `<circle cx={x%} cy={y%} r={radius}` — stroke only, no fill
- Small `<circle cx={x%} cy={y%} r={3px}` — filled center dot
- Status colors: `#3A7A4E` healthy · `#CC5427` monitoring · `#B83A2E` alert
- `strokeWidth`: 1.5px at zoom 1x → scales up with zoom
- Alert trees: `animation: svgPulse` on stroke opacity (0.5 → 1.0, 2.2s loop)
- Hover: stroke thickens to 3px + faint glow `drop-shadow`
- Selected: stroke color → `#CC5427`, strokeWidth 3px regardless of status
- Multi-highlighted (from action click): stroke → `#CC5427` for all affected trees

**Multi-condition indicator:**
Trees with 2+ active conditions get a small `×2` or `×3` text label offset top-right of the circle center, in IBM Plex Mono 10px, same color as stroke. (Currently: A-14 has disease + irrigation → `×2`; tree 42 has irrigation + fertilizer → `×2`; tree 57 has disease + fertilizer → `×2`; tree 115 has irrigation + fertilizer → `×2`.)

**Zone labels:**
Three translucent banners overlaid on the image:
```
ZONE NORTH · Persea americana — Hass · 48 trees
ZONE CENTRAL · Persea americana — Fuerte · 36 trees  
ZONE SOUTH · Mangifera indica — Tommy Atkins · 36 trees
```
IBM Plex Mono 10px, white at 45% opacity, positioned at top of each zone's region. On hover: opacity → 70%.

**Timestamp:**
Bottom-left corner of the image: `Last flight · 24 May · 06:47 · Drone survey` in IBM Plex Mono 10px, `rgba(232,225,207,0.45)`.

### 5c. Zoom + pan
Implemented with CSS `transform: scale() translate()` on the image+SVG wrapper. No external library.

| Interaction | Action |
|---|---|
| Scroll wheel | Zoom in/out, centered on cursor position |
| Pinch (touch) | Zoom in/out |
| Drag | Pan (only when zoomed in > 1x) |
| Double-click | Zoom to 2x centered on click point |
| Double-click at max zoom | Reset to 1x |

Zoom range: **0.8x → 4x**. At 1x all 120 trees visible. At 2x a single zone fills the viewport. At 4x individual trees large and readable.

Zoom controls: `+` / `−` / `⊙` (reset) buttons bottom-right of the map, dark pill style.

SVG circle radii scale inversely with zoom (so circles appear same pixel size at all zoom levels):
`r = baseRadius / currentZoom`
where `baseRadius = 22px`.

Tree label tooltip: on hover, show `Tree A-14 · Alert · Phytophthora 91%` as a small dark tooltip.

### 5d. Tree coordinate system
120 trees positioned as percentage `[cx, cy]` pairs in `demoData.ts`. Grid layout per zone:

- **Zone North (A)**: rows 1–4, 12 trees per row. cy range: 8%–38%. Trees at cx: 4.2%, 12.5%, 20.8%... (12 columns, ~8.3% apart). Slight ±1.5% jitter per tree for realism.
- **Zone Central (B)**: rows 5–7, 12 trees per row. cy range: 43%–65%.
- **Zone South (C)**: rows 8–10, 12 trees per row (last row has 12 trees). cy range: 70%–92%.

Zone gap: ~4% vertical spacing between zones (where the zone label sits).

---

## 6. Right Panel — PlantPanel (reworked)

**Positioning:** `position: absolute; right: 0; top: 0; height: 100%` over the map. Slides in with `transform: translateX(100%) → translateX(0)` (300ms ease). Does not affect map width.

Backdrop: faint `rgba(25,30,26,0.25)` over the map when panel is open. Clicking backdrop closes the panel.

**Changes to PlantPanel content:**
- Remove the fertilizer budget widget (footer) — this was a per-tree widget that made no sense. Budget is farm-level.
- Add "Agronomist notified" line for alert trees: `Alert sent to Dr. M. Conti (agronomist) · 23 May 07:31` in 11px stone. Below the disease card.
- Replace "Call agronomist" button with: `Contact via TropiX →` link (lighter, not a full CTA button).
- Sap-flow bar tooltip: `vs 14-day average for this tree` on hover.
- Add `OVERDUE · 24h since detection` warning line at top of panel for A-14.

**State flow for "Mark done":**
When farmer clicks "Mark done" on an intervention in the right panel:
1. The intervention row in the sidebar gets a `✓ done` state (struck through, moved to bottom)
2. The tree's circle on the map transitions from its current color → **amber** (`#B8860B`) indicating `treated · awaiting confirmation`
3. Right panel shows: `Treatment recorded · System monitoring for recovery` with a small animated pulse indicator
4. This "treated" state persists for the demo session (does not auto-resolve in MVP — resolution animation is post-MVP, see §9)

**Multi-tree action panel:**
When an action with multiple trees is clicked (e.g., "Irrigate × 5 trees"), the right panel shows:
- Action title + detail
- List of all affected trees with their individual sap-flow readings
- Single "Mark all done" button
- No individual tree detail (clicking a specific tree in the list opens that tree's panel instead)

---

## 7. Data model changes (`demoData.ts`)

### New fields on `Plant`
```ts
interface Plant {
  // existing fields...
  coords: { cx: number; cy: number }  // percentage [0–100]
  conditionCount: number               // computed: disease + irrigation + fertilizer conditions active
  treated: boolean                     // farmer marked treatment done this session
}
```

### New type: `AlertState`
```ts
type AlertState = 'active' | 'treated' | 'monitoring_post_treatment' | 'resolved'
```

### Alert `overdue` flag
```ts
// On INITIAL_INTERVENTIONS
interface Intervention {
  // existing...
  overdue: boolean  // true if detectedAt > 24h ago and done === false
}
```
Currently: A-14 intervention is overdue. Computed from `detectedAt` timestamp.

### Tree coordinates
Full `coords` array for all 120 trees added to `demoData.ts`. Generated as described in §5d.

### Weather data (new, static)
```ts
export const DEMO_WEATHER = [
  { day: 'Today',    icon: 'partly-cloudy', temp: 28, note: ''                        },
  { day: 'Tomorrow', icon: 'sunny',         temp: 34, note: 'Heat — irrigate morning' },
  { day: 'Sun 26',   icon: 'partly-cloudy', temp: 31, note: ''                        },
]
```

---

## 8. Component breakdown

| Component | Status | Notes |
|---|---|---|
| `pages/Demo.tsx` | Full rewrite | New cockpit state + layout |
| `components/demo/AlertSidebar.tsx` | New | Left column: health chip + weather + alerts + actions |
| `components/demo/OrchardMap.tsx` | New | Aerial image + SVG overlay + zoom/pan logic |
| `components/demo/TreeCircles.tsx` | New | SVG rendering of all 120 circles |
| `components/demo/ZoomControls.tsx` | New | +/−/reset buttons |
| `components/demo/PlantPanel.tsx` | Rework | Remove budget widget, add agronomist line, add treated state |
| `components/demo/DemoCards.tsx` | Minor edits | Replace "Call agronomist" CTA, add sap-flow tooltip |
| `components/demo/MultiActionPanel.tsx` | New | Right panel for multi-tree actions |
| `components/demo/WeatherStrip.tsx` | New | 3-day weather in sidebar |
| `data/demoData.ts` | Extend | Add coords, overdue, treated, weather, conditionCount |

---

## 9. Mobile / responsive strategy

**Decision: desktop-only with a graceful mobile gate screen.**

The cockpit requires ≥900px minimum (220px sidebar + flexible map + 340px panel). Below that the layout does not degrade — it breaks. Building a full responsive mobile version doubles implementation complexity for no strategic gain at this stage. The demo is a sales/evaluation tool used in a desktop context (meetings, offices). A dedicated mobile app for in-field use is a separate product concern.

**Breakpoint:** `< 900px` (uses existing `sb:` breakpoint from the design system)

**Mobile gate screen** (shown instead of the cockpit on viewports < 900px):
- Full-screen overlay
- Background: blurred+dimmed screenshot of the cockpit (`filter: blur(8px) brightness(0.6)`)
- Centered card: TropX wordmark + heading "This demo is designed for desktop" + body "Open it on a laptop or desktop to explore the full platform."
- Two CTAs: `← Back to site` (hash nav) + `Request pilot access →` (links to `#pilot`)
- Colors: dark card background `#191E1A`, standard typography

This is added as a wrapper in `Demo.tsx` — if `window.innerWidth < 900` on mount (or on resize), render the gate instead of the cockpit. Use a `useWindowWidth` hook (or inline resize listener) to handle orientation changes.

---

## 10. Out of scope for MVP (post-MVP backlog)

- **#5 Cross-tree learning signal** — "A-14 treated → recalibrates A-31 probability" — needs real ML integration
- **#25 Time simulation button** — "Simulate 24h" animation showing sap-flow recovery — strong demo feature, complex to implement cleanly
- **Auto-resolve after treatment** — currently treatment puts tree in amber "awaiting confirmation" state; auto-resolving after a timer would be convincing but needs careful UX so it doesn't look like the alert just disappeared for no reason
- **Mobile layout** — cockpit is desktop-only; acceptable for demo accessed from landing page

---

## 11. Decisions resolved (from the 25-point review)

| # | Decision |
|---|---|
| 1 | Irrigation done → amber "treated" state, not immediate clear |
| 2 | Disease treatment done → amber, stays in sidebar as "monitoring post-treatment" |
| 3 | Overdue badge: A-14 gets `OVERDUE` label (>24h, untreated) |
| 4 | "Mark done" ≠ resolved: two states, sidebar reflects both |
| 5 | Cross-tree learning → post-MVP |
| 6 | Budget widget removed from PlantPanel, not replaced in MVP |
| 7 | Multi-condition: single circle (most severe color) + `×N` offset badge |
| 8 | Today + scheduled → unified action list, sorted by urgency+time |
| 9 | Reset demo button added to header |
| 10 | Overdue badge on A-14 |
| 11 | Zoom/pan solves 120-trees-on-one-image problem |
| 12 | Circles scale inversely with zoom (constant pixel size at all zoom levels) |
| 13 | Single circle per tree, most-severe color, `×N` for multi-condition |
| 14 | Zone labels overlaid on image; image selected to have natural row structure |
| 15 | "Xd early" shown directly in sidebar alert rows |
| 16 | 3-day weather strip added to sidebar; tomorrow highlighted due to heat |
| 17 | "Call agronomist" → "Alert sent to agronomist · Contact via TropiX →" |
| 18 | Sap-flow bar: add "vs 14-day average" tooltip |
| 19 | Image timestamp: "Last flight · 24 May · 06:47 · Drone survey" |
| 20 | Clicking sidebar or map tree → same behavior; smooth panel update, no flicker |
| 21 | Reset demo button in header |
| 22 | "108 trees healthy · 4 alerts" chip at top of sidebar |
| 23 | "Back to site" opacity raised to 55% |
| 24 | Multi-tree action highlights all affected circles simultaneously |
| 25 | Time simulation → post-MVP |
