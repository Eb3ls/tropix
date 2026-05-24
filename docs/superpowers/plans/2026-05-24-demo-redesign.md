# Demo Redesign — Cockpit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the tab-based demo with a 3-column cockpit: dark alert sidebar + aerial orchard map with zoomable/pannable SVG circle overlays per tree + sliding tree detail panel. Desktop-only (≥900px); smaller viewports get a gate screen.

**Architecture:** `Demo.tsx` owns all state and renders the cockpit shell. Six focused components handle one concern each. `demoData.ts` is extended in-place with tree coords, weather data, and alert lifecycle fields. Zoom/pan is pure CSS `transform: translate+scale` on a wrapper div — no external library.

**Tech Stack:** React 19, TypeScript ~6, Tailwind CSS v4, Lucide React, Vite 8. No test runner — verification via `npx tsc --noEmit` + visual check in browser.

**Spec:** `docs/superpowers/specs/2026-05-24-demo-redesign.md`

---

## File Map

| Status | Path | Responsibility |
|---|---|---|
| **Extend** | `src/data/demoData.ts` | Add types, coords, weather, helpers, overdue flag |
| **New** | `src/hooks/useWindowWidth.ts` | Reactive window width for mobile gate |
| **New** | `src/components/demo/WeatherStrip.tsx` | 3-day static weather in sidebar |
| **New** | `src/components/demo/ZoomControls.tsx` | +/−/⊙ zoom buttons |
| **New** | `src/components/demo/TreeCircles.tsx` | SVG circle overlay for all 120 trees |
| **New** | `src/components/demo/OrchardMap.tsx` | Image + TreeCircles + ZoomControls + zoom/pan logic |
| **New** | `src/components/demo/AlertSidebar.tsx` | Health chip + weather + alerts + actions |
| **Rework** | `src/components/demo/PlantPanel.tsx` | Remove budget widget, add treated state + agronomist line |
| **Edit** | `src/components/demo/DemoCards.tsx` | Replace "Call agronomist" CTA |
| **New** | `src/components/demo/MultiActionPanel.tsx` | Right panel for multi-tree interventions |
| **Rewrite** | `src/pages/Demo.tsx` | Cockpit shell + state + mobile gate |
| **Asset** | `src/assets/orchard-aerial.jpg` | Aerial orchard photo (sourced in Task 1) |

---

## Task 1 — Aerial image asset

**Files:**
- Create: `src/assets/orchard-aerial.jpg`

- [ ] **Download a royalty-free aerial orchard photo**

  Run (in project root):
  ```bash
  curl -L "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=2000&q=85&auto=format" \
    -o src/assets/orchard-aerial.jpg
  ```

  Open the file in an image viewer. Verify it shows **tree canopies from directly above (nadir view)** with visible row structure. If the image is not suitable (wrong crop, wrong vegetation), search `https://unsplash.com/s/photos/avocado-orchard-aerial` and download an alternative with the same command.

  The image must be **landscape** (wider than tall), minimum 1400px wide.

- [ ] **Verify the asset is importable**

  Open `src/pages/Demo.tsx` and add at top (temporarily):
  ```ts
  import orchardImg from '../assets/orchard-aerial.jpg'
  console.log(orchardImg)
  ```

  Run `npm run dev`, open browser console. Should log a URL string (Vite asset hash). Remove the test import after verifying.

- [ ] **Commit**
  ```bash
  git add src/assets/orchard-aerial.jpg
  git commit -m "chore: add aerial orchard image asset"
  ```

---

## Task 2 — Extend `demoData.ts`

**Files:**
- Modify: `src/data/demoData.ts`

This task adds all new types and data fields. No existing data is removed.

- [ ] **Add `AlertState` type and `treated` field to `Plant`**

  At the top of `demoData.ts`, after the existing type block, add:

  ```ts
  export type AlertState = 'active' | 'treated' | 'resolved'

  // Extend Plant interface — add after existing fields:
  // coords: { cx: number; cy: number }  ← percentage [0–100] on the aerial image
  // conditionCount: number               ← how many of disease/irrigation/fertilizer are active
  ```

  Modify the `Plant` interface:
  ```ts
  export interface Plant {
    id: number
    gridIndex: number
    zone: Zone
    cultivar: string
    status: PlantStatus
    disease?: DiseaseRec
    irrigation?: IrrigationRec
    fertilizer?: FertilizerRec
    coords: { cx: number; cy: number }
    conditionCount: number
  }
  ```

- [ ] **Add `overdue` to `Intervention`**

  ```ts
  export interface Intervention {
    id: string
    priority: Priority
    type: InterventionType
    plantLabels: string
    plantCount: number
    title: string
    detail: string
    scheduledFor: string
    done: boolean
    overdue: boolean   // ← add this
    plantIds: number[] // ← add this: gridIndex values of affected trees
  }
  ```

- [ ] **Add `generateTreeCoords()` helper and `TREE_COORDS` constant**

  Add after the `CULTIVARS` block:

  ```ts
  // ─── Tree coordinates (percentage-based on aerial image) ─────────────────────
  function generateTreeCoords(): Array<{ cx: number; cy: number }> {
    const coords: Array<{ cx: number; cy: number }> = []

    // 12 columns, margins at ~4%, spaced ~8.33%
    const colX = (col: number) => 4.2 + col * 8.33

    // Zone North: indices 0–47, 4 rows × 12 cols, cy 6%–36%
    for (let i = 0; i < 48; i++) {
      const row = Math.floor(i / 12)
      const col = i % 12
      const jx = ((i * 7 + 3) % 17 - 8) * 0.18   // ±1.5
      const jy = ((i * 11 + 5) % 13 - 6) * 0.22   // ±1.5
      coords.push({
        cx: Math.round((colX(col) + jx) * 10) / 10,
        cy: Math.round((6 + row * 10 + jy) * 10) / 10,
      })
    }

    // Zone Central: indices 48–83, 3 rows × 12 cols, cy 46%–62%
    for (let i = 0; i < 36; i++) {
      const idx = 48 + i
      const row = Math.floor(i / 12)
      const col = i % 12
      const jx = ((idx * 7 + 3) % 17 - 8) * 0.18
      const jy = ((idx * 11 + 5) % 13 - 6) * 0.22
      coords.push({
        cx: Math.round((colX(col) + jx) * 10) / 10,
        cy: Math.round((46 + row * 8 + jy) * 10) / 10,
      })
    }

    // Zone South: indices 84–119, 3 rows × 12 cols, cy 72%–88%
    for (let i = 0; i < 36; i++) {
      const idx = 84 + i
      const row = Math.floor(i / 12)
      const col = i % 12
      const jx = ((idx * 7 + 3) % 17 - 8) * 0.18
      const jy = ((idx * 11 + 5) % 13 - 6) * 0.22
      coords.push({
        cx: Math.round((colX(col) + jx) * 10) / 10,
        cy: Math.round((72 + row * 8 + jy) * 10) / 10,
      })
    }

    return coords
  }

  export const TREE_COORDS = generateTreeCoords()
  ```

- [ ] **Add `conditionCount` helper**

  ```ts
  export function conditionCount(p: Omit<Plant, 'coords' | 'conditionCount'>): number {
    return (p.disease ? 1 : 0) + (p.irrigation ? 1 : 0) + (p.fertilizer ? 1 : 0)
  }
  ```

- [ ] **Update `buildPlants()` to include `coords` and `conditionCount`**

  Replace the existing `buildPlants` function:

  ```ts
  function buildPlants(): Plant[] {
    return Array.from({ length: 120 }, (_, i) => {
      const zone = getZone(i)
      const sp   = SPECIAL[i]
      const base = { id: i + 1, gridIndex: i, zone, cultivar: CULTIVARS[zone], status: sp?.status ?? 'healthy', ...sp } as Omit<Plant, 'coords' | 'conditionCount'>
      return {
        ...base,
        coords: TREE_COORDS[i],
        conditionCount: conditionCount(base),
      } as Plant
    })
  }
  ```

- [ ] **Add `DEMO_WEATHER` constant**

  ```ts
  // ─── Weather (static demo data) ──────────────────────────────────────────────
  export interface WeatherDay {
    day: string
    tempC: number
    condition: 'sunny' | 'partly-cloudy' | 'cloudy'
    note: string
    highlight: boolean
  }

  export const DEMO_WEATHER: WeatherDay[] = [
    { day: 'Today',    tempC: 28, condition: 'partly-cloudy', note: '',                          highlight: false },
    { day: 'Tomorrow', tempC: 34, condition: 'sunny',         note: 'Heat · irrigate morning',   highlight: true  },
    { day: 'Sun 26',   tempC: 31, condition: 'partly-cloudy', note: '',                          highlight: false },
  ]
  ```

- [ ] **Update `INITIAL_INTERVENTIONS` — add `overdue` and `plantIds` to each item**

  Replace the full `INITIAL_INTERVENTIONS` export:

  ```ts
  export const INITIAL_INTERVENTIONS: Intervention[] = [
    {
      id: 'i1', priority: 'urgent', type: 'disease',
      plantLabels: 'A-14', plantCount: 1,
      title: 'Phytophthora cinnamomi treatment',
      detail: 'Fosetil-Al 3 g/L · reduce irrigation 30% · isolate root zone',
      scheduledFor: 'today', done: false, overdue: true,
      plantIds: [13],
    },
    {
      id: 'i2', priority: 'urgent', type: 'disease',
      plantLabels: 'B-10', plantCount: 1,
      title: 'Colletotrichum gloeosporioides treatment',
      detail: 'Copper oxychloride 3 kg/hL · remove affected fruit',
      scheduledFor: 'today', done: false, overdue: false,
      plantIds: [57],  // B-10 = Central tree 10, gridIndex 48+(10-1)=57
    },
    {
      id: 'i3', priority: 'high', type: 'disease',
      plantLabels: 'A-31', plantCount: 1,
      title: 'Phytophthora monitoring — prob. 78%',
      detail: 'Monitor 48h · consider preventive treatment if worsening',
      scheduledFor: 'within 48h', done: false, overdue: false,
      plantIds: [30],  // A-31 = North tree 31, gridIndex 0+(31-1)=30
    },
    {
      id: 'i4', priority: 'high', type: 'disease',
      plantLabels: 'C-08', plantCount: 1,
      title: 'Phytophthora cinnamomi treatment',
      detail: 'Fosetil-Al 3 g/L · improve perimeter drainage',
      scheduledFor: 'tomorrow', done: false, overdue: false,
      plantIds: [91],  // C-08 = South tree 8, gridIndex 84+(8-1)=91
    },
    {
      id: 'i5', priority: 'medium', type: 'irrigation',
      plantLabels: 'A-06, A-43, B-05, C-05, C-32', plantCount: 5,
      title: 'Scheduled irrigation',
      detail: 'Water stress detected · 25–40 min per tree · morning window',
      scheduledFor: 'tomorrow 08:00', done: false, overdue: false,
      plantIds: [5, 42, 52, 88, 115], // A-06=5, A-43=42, B-05=52, C-05=88, C-32=115
    },
    {
      id: 'i6', priority: 'medium', type: 'irrigation',
      plantLabels: 'C-32', plantCount: 1,
      title: 'Urgent irrigation',
      detail: 'Sap-flow at 59% of baseline · irrigate this evening',
      scheduledFor: 'today 19:00', done: false, overdue: false,
      plantIds: [115],  // C-32 = South tree 32, gridIndex 84+(32-1)=115
    },
    {
      id: 'i7', priority: 'low', type: 'fertilizer',
      plantLabels: 'Zone North — 12 trees', plantCount: 12,
      title: 'Nitrogen fertilisation (N)',
      detail: 'Ammonium nitrate 27% · dose 8 g/m² · deficiency confirmed by NDVI',
      scheduledFor: '28 May', done: false, overdue: false,
      plantIds: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], // A-13 through A-24
    },
    {
      id: 'i8', priority: 'low', type: 'fertilizer',
      plantLabels: 'B-10, B-24, C-02, C-18', plantCount: 4,
      title: 'Calcium and phosphorus fertilisation',
      detail: 'Triple superphosphate + calcium nitrate · NDVI deficiency in central zone',
      scheduledFor: '29 May', done: false, overdue: false,
      plantIds: [57, 71, 85, 101], // B-10=57, B-24=71, C-02=85, C-18=101
    },
  ]
  ```

  Formula for reference: `gridIndex = zoneStart + (relId - 1)`, where zoneStart = 0 (North/A), 48 (Central/B), 84 (South/C).

- [ ] **Type-check**
  ```bash
  npx tsc --noEmit
  ```
  Expected: 0 errors. If errors appear in other files referencing `Plant` or `Intervention`, fix them (add the new required fields where plants are constructed).

- [ ] **Commit**
  ```bash
  git add src/data/demoData.ts
  git commit -m "feat(demo): extend demoData — coords, weather, overdue, conditionCount, plantIds"
  ```

---

## Task 3 — `useWindowWidth` hook

**Files:**
- Create: `src/hooks/useWindowWidth.ts`

- [ ] **Write the hook**

  ```ts
  // src/hooks/useWindowWidth.ts
  import { useEffect, useState } from 'react'

  /**
   * Returns the current window.innerWidth, updated on resize.
   * Used to switch between cockpit (≥900px) and mobile gate (<900px).
   */
  export function useWindowWidth(): number {
    const [width, setWidth] = useState(() => window.innerWidth)

    useEffect(() => {
      const handle = () => setWidth(window.innerWidth)
      window.addEventListener('resize', handle)
      return () => window.removeEventListener('resize', handle)
    }, [])

    return width
  }
  ```

- [ ] **Type-check**
  ```bash
  npx tsc --noEmit
  ```

- [ ] **Commit**
  ```bash
  git add src/hooks/useWindowWidth.ts
  git commit -m "feat(demo): add useWindowWidth hook for mobile gate"
  ```

---

## Task 4 — `WeatherStrip` component

**Files:**
- Create: `src/components/demo/WeatherStrip.tsx`

- [ ] **Write the component**

  ```tsx
  // src/components/demo/WeatherStrip.tsx
  import { Sun, Cloud, CloudSun } from 'lucide-react'
  import { DEMO_WEATHER, type WeatherDay } from '../../data/demoData'

  const ICONS: Record<WeatherDay['condition'], React.ReactNode> = {
    'sunny':         <Sun        size={12} aria-hidden="true" />,
    'partly-cloudy': <CloudSun   size={12} aria-hidden="true" />,
    'cloudy':        <Cloud      size={12} aria-hidden="true" />,
  }

  export function WeatherStrip() {
    return (
      <div style={{ padding: '10px 16px 12px' }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(232,225,207,0.35)',
          marginBottom: '8px',
        }}>
          Weather · Ragusa, SIC
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          {DEMO_WEATHER.map(day => (
            <div
              key={day.day}
              style={{
                flex: 1,
                padding: '7px 6px',
                borderRadius: '4px',
                background: day.highlight
                  ? 'rgba(204,84,39,0.12)'
                  : 'rgba(232,225,207,0.04)',
                border: day.highlight
                  ? '1px solid rgba(204,84,39,0.25)'
                  : '1px solid rgba(232,225,207,0.07)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '9px',
                  color: 'rgba(232,225,207,0.45)',
                }}>
                  {day.day}
                </span>
                <span style={{ color: day.highlight ? '#CC5427' : 'rgba(232,225,207,0.45)' }}>
                  {ICONS[day.condition]}
                </span>
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '13px',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 700,
                color: day.highlight ? '#CC5427' : '#E8E1CF',
                lineHeight: 1,
              }}>
                {day.tempC}°
              </div>
              {day.note && (
                <div style={{
                  fontFamily: "'Barlow Semi Condensed', sans-serif",
                  fontSize: '9px',
                  color: '#CC5427',
                  marginTop: '3px',
                  lineHeight: 1.3,
                }}>
                  {day.note}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }
  ```

- [ ] **Type-check**
  ```bash
  npx tsc --noEmit
  ```

- [ ] **Commit**
  ```bash
  git add src/components/demo/WeatherStrip.tsx
  git commit -m "feat(demo): WeatherStrip component"
  ```

---

## Task 5 — `ZoomControls` component

**Files:**
- Create: `src/components/demo/ZoomControls.tsx`

- [ ] **Write the component**

  ```tsx
  // src/components/demo/ZoomControls.tsx
  import { Plus, Minus, Crosshair } from 'lucide-react'

  interface Props {
    zoom: number
    minZoom: number
    maxZoom: number
    onZoomIn: () => void
    onZoomOut: () => void
    onReset: () => void
  }

  const btnStyle = (disabled: boolean): React.CSSProperties => ({
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(25,30,26,0.75)',
    border: '1px solid rgba(232,225,207,0.15)',
    borderRadius: '4px',
    cursor: disabled ? 'default' : 'pointer',
    color: disabled ? 'rgba(232,225,207,0.2)' : 'rgba(232,225,207,0.7)',
    backdropFilter: 'blur(4px)',
    transition: 'background 150ms, color 150ms',
  })

  export function ZoomControls({ zoom, minZoom, maxZoom, onZoomIn, onZoomOut, onReset }: Props) {
    return (
      <div style={{
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        zIndex: 10,
      }}>
        <button
          onClick={onZoomIn}
          disabled={zoom >= maxZoom}
          aria-label="Zoom in"
          style={btnStyle(zoom >= maxZoom)}
          onMouseEnter={e => { if (zoom < maxZoom) e.currentTarget.style.background = 'rgba(25,30,26,0.95)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(25,30,26,0.75)' }}
        >
          <Plus size={13} aria-hidden="true" />
        </button>

        <button
          onClick={onZoomOut}
          disabled={zoom <= minZoom}
          aria-label="Zoom out"
          style={btnStyle(zoom <= minZoom)}
          onMouseEnter={e => { if (zoom > minZoom) e.currentTarget.style.background = 'rgba(25,30,26,0.95)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(25,30,26,0.75)' }}
        >
          <Minus size={13} aria-hidden="true" />
        </button>

        <button
          onClick={onReset}
          disabled={zoom === 1}
          aria-label="Reset zoom"
          style={btnStyle(zoom === 1)}
          onMouseEnter={e => { if (zoom !== 1) e.currentTarget.style.background = 'rgba(25,30,26,0.95)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(25,30,26,0.75)' }}
        >
          <Crosshair size={13} aria-hidden="true" />
        </button>

        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '9px',
          color: 'rgba(232,225,207,0.3)',
          textAlign: 'center',
          paddingTop: '2px',
        }}>
          {Math.round(zoom * 100)}%
        </div>
      </div>
    )
  }
  ```

- [ ] **Type-check**
  ```bash
  npx tsc --noEmit
  ```

- [ ] **Commit**
  ```bash
  git add src/components/demo/ZoomControls.tsx
  git commit -m "feat(demo): ZoomControls component"
  ```

---

## Task 6 — `TreeCircles` component

**Files:**
- Create: `src/components/demo/TreeCircles.tsx`

- [ ] **Write the component**

  Key invariant: circles stay the same **screen pixel size** at all zoom levels because the SVG is inside the zoom-transformed wrapper. `r = BASE_R / zoom` counteracts the parent scale.

  ```tsx
  // src/components/demo/TreeCircles.tsx
  import { type Plant, STATUS_COLOR, plantLabel } from '../../data/demoData'

  // Base radius in SVG viewBox units (0–100 space).
  // At zoom=1, image ~800px wide → 1 unit = 8px → BASE_R=1.8 → r≈14.4px on screen.
  const BASE_R = 1.8

  // Amber color for "treated · awaiting confirmation" state
  const TREATED_COLOR = '#B8860B'

  interface Props {
    plants: Plant[]
    selectedId: number | null
    highlightedIds: Set<number>   // gridIndex values to highlight (multi-tree action)
    treatedIds: Set<number>       // gridIndex values marked as treated
    zoom: number
    onTreeClick: (plant: Plant) => void
  }

  export function TreeCircles({ plants, selectedId, highlightedIds, treatedIds, zoom, onTreeClick }: Props) {
    const r = BASE_R / zoom

    return (
      // viewBox 0 0 100 100 — all coordinates are percentages of image dimensions
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      >
        <defs>
          <style>{`
            @keyframes treePulse {
              0%, 100% { opacity: 0.9; }
              50%       { opacity: 0.4; }
            }
          `}</style>
        </defs>

        {plants.map(plant => {
          const { cx, cy } = plant.coords
          const isSelected    = plant.gridIndex === selectedId
          const isHighlighted = highlightedIds.has(plant.gridIndex)
          const isTreated     = treatedIds.has(plant.gridIndex)

          const strokeColor = isSelected || isHighlighted
            ? '#CC5427'
            : isTreated
            ? TREATED_COLOR
            : STATUS_COLOR[plant.status]

          const strokeWidth = (isSelected || isHighlighted ? 3 : 1.5) / zoom
          const isPulsing   = plant.status === 'alert' && !isTreated

          const label = plantLabel(plant)
          const tooltip = `${label} · ${isTreated ? 'Treated — awaiting confirmation' : plant.status}${plant.disease ? ` · ${plant.disease.name} ${plant.disease.probability}%` : ''}`

          return (
            <g
              key={plant.id}
              onClick={() => onTreeClick(plant)}
              role="button"
              tabIndex={0}
              aria-label={tooltip}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onTreeClick(plant) }}
              style={{ cursor: 'pointer' }}
            >
              <title>{tooltip}</title>

              {/* Invisible hit area (larger than visual circle) */}
              <circle
                cx={cx} cy={cy}
                r={r * 1.6}
                fill="transparent"
              />

              {/* Status ring */}
              <circle
                cx={cx} cy={cy}
                r={r}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                opacity={isSelected || isHighlighted ? 1 : 0.85}
                style={isPulsing ? { animation: 'treePulse 2.2s ease-in-out infinite' } : undefined}
              />

              {/* Center dot */}
              <circle
                cx={cx} cy={cy}
                r={0.35 / zoom}
                fill={strokeColor}
                opacity={0.9}
              />

              {/* Multi-condition badge ×N (offset top-right of ring) */}
              {plant.conditionCount > 1 && (
                <text
                  x={cx + r * 0.65}
                  y={cy - r * 0.65}
                  fontSize={0.9 / zoom}
                  fontFamily="'IBM Plex Mono', monospace"
                  fill={strokeColor}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  ×{plant.conditionCount}
                </text>
              )}
            </g>
          )
        })}
      </svg>
    )
  }
  ```

- [ ] **Type-check**
  ```bash
  npx tsc --noEmit
  ```

- [ ] **Commit**
  ```bash
  git add src/components/demo/TreeCircles.tsx
  git commit -m "feat(demo): TreeCircles SVG overlay component"
  ```

---

## Task 7 — `OrchardMap` component (zoom + pan + image + overlay)

**Files:**
- Create: `src/components/demo/OrchardMap.tsx`

This is the most complex component. It manages `scale` and `translate` state, applies a CSS transform to a wrapper div containing the image and SVG, and handles wheel zoom, drag pan, and button controls.

- [ ] **Write the component**

  ```tsx
  // src/components/demo/OrchardMap.tsx
  import { useRef, useState, useCallback, useEffect } from 'react'
  import orchardImg from '../../assets/orchard-aerial.jpg'
  import { TreeCircles } from './TreeCircles'
  import { ZoomControls } from './ZoomControls'
  import { type Plant, CULTIVARS, ZONE_LABEL, type Zone } from '../../data/demoData'

  const MIN_ZOOM = 0.8
  const MAX_ZOOM = 4.0
  const ZOOM_STEP = 0.25

  const ZONES: Array<{ zone: Zone; cy: string; label: string }> = [
    { zone: 'Nord',   cy: '2%',  label: '' },
    { zone: 'Centro', cy: '43%', label: '' },
    { zone: 'Sud',    cy: '69%', label: '' },
  ]

  interface Props {
    plants: Plant[]
    selectedId: number | null
    highlightedIds: Set<number>
    treatedIds: Set<number>
    onTreeClick: (plant: Plant) => void
  }

  export function OrchardMap({ plants, selectedId, highlightedIds, treatedIds, onTreeClick }: Props) {
    const containerRef  = useRef<HTMLDivElement>(null)
    const [scale, setScale]       = useState(1)
    const [translate, setTranslate] = useState({ x: 0, y: 0 })
    const dragRef = useRef<{ startX: number; startY: number; tx: number; ty: number } | null>(null)

    // ── Clamp translate so the image doesn't pan completely off screen ──────────
    const clampTranslate = useCallback((tx: number, ty: number, s: number) => {
      const c = containerRef.current
      if (!c) return { x: tx, y: ty }
      const { width: cw, height: ch } = c.getBoundingClientRect()
      // Image occupies cw×ch at scale 1; at scale s it occupies cw*s × ch*s
      // Allow panning up to 80% of container dimension
      const maxX = cw * 0.8
      const minX = cw * (1 - s * 0.8)   // ensures right edge doesn't disappear
      const maxY = ch * 0.8
      const minY = ch * (1 - s * 0.8)
      return {
        x: Math.min(maxX, Math.max(minX, tx)),
        y: Math.min(maxY, Math.max(minY, ty)),
      }
    }, [])

    // ── Wheel zoom (centered on cursor) ────────────────────────────────────────
    const handleWheel = useCallback((e: React.WheelEvent) => {
      e.preventDefault()
      const c = containerRef.current
      if (!c) return
      const rect = c.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      setScale(prevScale => {
        const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12
        const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prevScale * factor))

        // Keep content point under cursor fixed
        const contentX = (mouseX - translate.x) / prevScale
        const contentY = (mouseY - translate.y) / prevScale
        const newTx    = mouseX - contentX * newScale
        const newTy    = mouseY - contentY * newScale
        const clamped  = clampTranslate(newTx, newTy, newScale)
        setTranslate(clamped)
        return newScale
      })
    }, [translate, clampTranslate])

    // ── Drag to pan (only when zoomed in) ──────────────────────────────────────
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
      if (scale <= 1) return
      dragRef.current = { startX: e.clientX, startY: e.clientY, tx: translate.x, ty: translate.y }
    }, [scale, translate])

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (!dragRef.current) return
        const dx = e.clientX - dragRef.current.startX
        const dy = e.clientY - dragRef.current.startY
        const clamped = clampTranslate(dragRef.current.tx + dx, dragRef.current.ty + dy, scale)
        setTranslate(clamped)
      }
      const handleMouseUp = () => { dragRef.current = null }
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup',   handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup',   handleMouseUp)
      }
    }, [scale, clampTranslate])

    // ── Double-click: zoom to 2× at click point, or reset if already at max ───
    const handleDoubleClick = useCallback((e: React.MouseEvent) => {
      const c = containerRef.current
      if (!c) return
      if (scale >= MAX_ZOOM * 0.9) {
        setScale(1)
        setTranslate({ x: 0, y: 0 })
        return
      }
      const rect   = c.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top
      const newScale = Math.min(MAX_ZOOM, scale * 2)
      const contentX = (mouseX - translate.x) / scale
      const contentY = (mouseY - translate.y) / scale
      const newTx    = mouseX - contentX * newScale
      const newTy    = mouseY - contentY * newScale
      setScale(newScale)
      setTranslate(clampTranslate(newTx, newTy, newScale))
    }, [scale, translate, clampTranslate])

    // ── Button controls ────────────────────────────────────────────────────────
    const zoomIn  = () => {
      const c = containerRef.current
      if (!c) return
      const { width: cw, height: ch } = c.getBoundingClientRect()
      const newScale = Math.min(MAX_ZOOM, scale + ZOOM_STEP)
      const newTx    = cw / 2 - (cw / 2 - translate.x) * (newScale / scale)
      const newTy    = ch / 2 - (ch / 2 - translate.y) * (newScale / scale)
      setScale(newScale)
      setTranslate(clampTranslate(newTx, newTy, newScale))
    }
    const zoomOut = () => {
      const c = containerRef.current
      if (!c) return
      const { width: cw, height: ch } = c.getBoundingClientRect()
      const newScale = Math.max(MIN_ZOOM, scale - ZOOM_STEP)
      const newTx    = cw / 2 - (cw / 2 - translate.x) * (newScale / scale)
      const newTy    = ch / 2 - (ch / 2 - translate.y) * (newScale / scale)
      setScale(newScale)
      setTranslate(clampTranslate(newTx, newTy, newScale))
    }
    const resetZoom = () => { setScale(1); setTranslate({ x: 0, y: 0 }) }

    return (
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          background: '#191E1A',
          cursor: scale > 1 ? 'grab' : 'default',
          userSelect: 'none',
        }}
      >
        {/* ── Transformed wrapper (image + SVG move together) ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: '0 0',
            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
            willChange: 'transform',
          }}
        >
          {/* Aerial photo */}
          <img
            src={orchardImg}
            alt="Aerial view of Az. Agr. Greco orchard"
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />

          {/* SVG circle overlay */}
          <TreeCircles
            plants={plants}
            selectedId={selectedId}
            highlightedIds={highlightedIds}
            treatedIds={treatedIds}
            zoom={scale}
            onTreeClick={onTreeClick}
          />

          {/* Zone labels */}
          {ZONES.map(({ zone, cy }) => (
            <div
              key={zone}
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: cy,
                left: '12px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: `${11 / scale}px`,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(232,225,207,0.5)',
                pointerEvents: 'none',
                lineHeight: 1.4,
              }}
            >
              <span style={{ color: 'rgba(232,225,207,0.35)' }}>Zone {ZONE_LABEL[zone]}</span>
              {' · '}
              <em style={{ fontStyle: 'italic' }}>{CULTIVARS[zone].split('—')[1]?.trim()}</em>
            </div>
          ))}

          {/* Drone timestamp */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: '10px',
              left: '12px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: `${9 / scale}px`,
              color: 'rgba(232,225,207,0.35)',
              pointerEvents: 'none',
            }}
          >
            Last flight · 24 May · 06:47 · Drone survey
          </div>
        </div>

        {/* Zoom controls (outside transform — stay at fixed screen position) */}
        <ZoomControls
          zoom={scale}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onReset={resetZoom}
        />
      </div>
    )
  }
  ```

- [ ] **Type-check**
  ```bash
  npx tsc --noEmit
  ```

- [ ] **Visual smoke test**

  Temporarily wire into `Demo.tsx` (replace its return value):
  ```tsx
  import { OrchardMap } from '../components/demo/OrchardMap'
  import { ALL_PLANTS } from '../data/demoData'

  export function Demo() {
    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        <OrchardMap
          plants={ALL_PLANTS}
          selectedId={null}
          highlightedIds={new Set()}
          treatedIds={new Set()}
          onTreeClick={p => console.log(p)}
        />
      </div>
    )
  }
  ```
  Run `npm run dev`. Verify:
  - Aerial image fills the map area
  - 120 circles visible (green/orange/red)
  - Scroll wheel zooms centered on cursor
  - Drag pans when zoomed in
  - Double-click zooms to 2×; double-click at 4× resets
  - Alert circles pulse
  - Multi-condition circles show ×2 badge
  - Zone labels visible in top-left of each zone region
  - Drone timestamp bottom-left

  Revert `Demo.tsx` to its original content after verifying.

- [ ] **Commit**
  ```bash
  git add src/components/demo/OrchardMap.tsx
  git commit -m "feat(demo): OrchardMap — aerial image + SVG overlay + zoom/pan"
  ```

---

## Task 8 — `AlertSidebar` component

**Files:**
- Create: `src/components/demo/AlertSidebar.tsx`

- [ ] **Write the component**

  ```tsx
  // src/components/demo/AlertSidebar.tsx
  import { WeatherStrip } from './WeatherStrip'
  import { STATUS_COLOR, PRIORITY_STYLE, plantLabel, type Plant, type Intervention } from '../../data/demoData'

  interface Props {
    plants: Plant[]
    interventions: Intervention[]
    selectedId: number | null
    highlightedIds: Set<number>
    treatedIds: Set<number>
    onAlertClick:  (plant: Plant) => void
    onActionClick: (intervention: Intervention) => void
  }

  export function AlertSidebar({
    plants, interventions, selectedId, highlightedIds, treatedIds,
    onAlertClick, onActionClick,
  }: Props) {
    const alertPlants   = plants.filter(p => p.status !== 'healthy')
    const healthyCount  = plants.filter(p => p.status === 'healthy').length
    const alertCount    = alertPlants.filter(p => p.status === 'alert').length
    const pendingActions = interventions.filter(i => !i.done)

    return (
      <div style={{
        width: '220px',
        flexShrink: 0,
        background: '#191E1A',
        borderRight: '1px solid rgba(232,225,207,0.07)',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>

        {/* ── Farm health chip ── */}
        <div style={{
          padding: '14px 16px 10px',
          borderBottom: '1px solid rgba(232,225,207,0.07)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3A7A4E', display: 'inline-block' }} />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'rgba(232,225,207,0.6)', fontVariantNumeric: 'tabular-nums' }}>
              {healthyCount} healthy
            </span>
          </span>
          <span style={{ color: 'rgba(232,225,207,0.2)', fontSize: '10px' }}>·</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#B83A2E', display: 'inline-block' }} />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'rgba(232,225,207,0.6)', fontVariantNumeric: 'tabular-nums' }}>
              {alertCount} alerts
            </span>
          </span>
        </div>

        {/* ── Weather strip ── */}
        <div style={{ borderBottom: '1px solid rgba(232,225,207,0.07)' }}>
          <WeatherStrip />
        </div>

        {/* ── Alert list ── */}
        <div style={{ padding: '12px 0 4px' }}>
          <div style={{
            padding: '0 16px 8px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#CC5427',
          }}>
            Alerts · {alertPlants.length}
          </div>

          {alertPlants.map(plant => {
            const isSelected = plant.gridIndex === selectedId
            const isTreated  = treatedIds.has(plant.gridIndex)
            const daysEarly  = plant.disease?.daysBeforeSymptoms

            return (
              <button
                key={plant.id}
                onClick={() => onAlertClick(plant)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '7px 16px',
                  background: isSelected ? 'rgba(232,225,207,0.06)' : 'transparent',
                  border: 'none',
                  borderLeft: `2px solid ${isTreated ? '#B8860B' : STATUS_COLOR[plant.status]}`,
                  cursor: 'pointer',
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(232,225,207,0.04)' }}
                onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
              >
                {/* Tree label + overdue */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#E8E1CF',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {plantLabel(plant)}
                  </span>
                  {plant.disease && !isTreated && (
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '10px',
                      fontVariantNumeric: 'tabular-nums',
                      color: plant.status === 'alert' ? '#B83A2E' : '#CC5427',
                      fontWeight: 600,
                    }}>
                      {plant.disease.probability}%
                    </span>
                  )}
                  {isTreated && (
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '9px',
                      color: '#B8860B',
                      border: '1px solid rgba(184,134,11,0.35)',
                      borderRadius: '3px',
                      padding: '1px 4px',
                    }}>
                      TREATED
                    </span>
                  )}
                  {/* Overdue: uses live interventions prop so it reflects done state */}
                  {interventions.some(i => i.plantIds.includes(plant.gridIndex) && i.overdue && !i.done) && !isTreated && (
                    <span style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '9px',
                      color: '#B83A2E',
                      border: '1px solid rgba(184,58,46,0.35)',
                      borderRadius: '3px',
                      padding: '1px 4px',
                    }}>
                      OVERDUE
                    </span>
                  )}
                </div>

                {/* Disease name */}
                {plant.disease && (
                  <div style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontStyle: 'italic',
                    fontSize: '11px',
                    color: 'rgba(232,225,207,0.55)',
                    marginBottom: '1px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {plant.disease.name}
                  </div>
                )}

                {/* "Xd early" — always shown for disease alerts */}
                {daysEarly && !isTreated && (
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '10px',
                    color: 'rgba(204,84,39,0.8)',
                  }}>
                    {daysEarly}d before symptoms
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* ── Action list ── */}
        <div style={{ padding: '12px 0 16px', borderTop: '1px solid rgba(232,225,207,0.07)' }}>
          <div style={{
            padding: '0 16px 8px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(232,225,207,0.35)',
          }}>
            Actions Today · {pendingActions.length}
          </div>

          {pendingActions.map(item => {
            const ps          = PRIORITY_STYLE[item.priority]
            const isHighlighted = item.plantIds.some(id => highlightedIds.has(id))

            return (
              <button
                key={item.id}
                onClick={() => onActionClick(item)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '7px',
                  width: '100%',
                  textAlign: 'left',
                  padding: '6px 16px',
                  background: isHighlighted ? 'rgba(232,225,207,0.06)' : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => { if (!isHighlighted) e.currentTarget.style.background = 'rgba(232,225,207,0.04)' }}
                onMouseLeave={e => { if (!isHighlighted) e.currentTarget.style.background = 'transparent' }}
              >
                {/* Priority badge */}
                <span style={{
                  flexShrink: 0,
                  marginTop: '1px',
                  padding: '1px 5px',
                  borderRadius: '3px',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '9px',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  background: ps.bg,
                  border: `1px solid ${ps.border}`,
                  color: ps.text,
                }}>
                  {ps.label.slice(0, 3)}
                </span>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'Barlow Semi Condensed', sans-serif",
                    fontSize: '12px',
                    color: 'rgba(232,225,207,0.75)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {item.title}
                  </div>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '10px',
                    color: 'rgba(232,225,207,0.3)',
                  }}>
                    {item.scheduledFor}
                    {item.plantCount > 1 && ` · ${item.plantCount} trees`}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }
  ```

- [ ] **Type-check**
  ```bash
  npx tsc --noEmit
  ```

- [ ] **Commit**
  ```bash
  git add src/components/demo/AlertSidebar.tsx
  git commit -m "feat(demo): AlertSidebar — health chip, weather, alerts, actions"
  ```

---

## Task 9 — Rework `PlantPanel` + edit `DemoCards`

**Files:**
- Modify: `src/components/demo/PlantPanel.tsx`
- Modify: `src/components/demo/DemoCards.tsx`

- [ ] **Remove budget footer from `PlantPanel.tsx`**

  Delete the entire `{/* ── Budget widget ── */}` section (lines 187–264 in current file). The panel now ends after the body `<div>`.

- [ ] **Add OVERDUE warning and treated state to `PlantPanel.tsx`**

  In the sticky header block, after the cultivar italic line, add:

  ```tsx
  {/* OVERDUE warning */}
  {INITIAL_INTERVENTIONS.some(i => i.plantIds.includes(plant.gridIndex) && i.overdue && !i.done) && !treated && (
    <div style={{
      marginTop: '8px',
      padding: '5px 10px',
      background: 'rgba(184,58,46,0.08)',
      border: '1px solid rgba(184,58,46,0.25)',
      borderRadius: '4px',
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: '10px',
      color: '#B83A2E',
      letterSpacing: '0.07em',
    }}>
      OVERDUE · 24h since detection · act immediately
    </div>
  )}

  {/* Treated confirmation */}
  {treated && (
    <div style={{
      marginTop: '8px',
      padding: '5px 10px',
      background: 'rgba(184,134,11,0.08)',
      border: '1px solid rgba(184,134,11,0.25)',
      borderRadius: '4px',
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: '10px',
      color: '#B8860B',
      letterSpacing: '0.06em',
    }}>
      Treatment recorded · System monitoring for recovery
      <span style={{ display: 'inline-block', marginLeft: '6px', animation: 'treePulse 2s ease-in-out infinite' }}>●</span>
    </div>
  )}
  ```

  Update the `Props` interface and function signature — `overdue` is passed in from `Demo.tsx` (already computed there) so `PlantPanel` doesn't need to import `INITIAL_INTERVENTIONS`:
  ```tsx
  interface Props {
    plant: Plant
    onClose: () => void
    treated: boolean
    overdue: boolean      // ← computed in Demo.tsx: interventions.some(i => i.plantIds.includes(plant.gridIndex) && i.overdue && !i.done)
    onMarkTreated: () => void
  }
  ```

  Replace `INITIAL_INTERVENTIONS.some(...)` in the JSX with just `{overdue && !treated && (`:
  ```tsx
  {overdue && !treated && (
    <div style={{ ... }}>
      OVERDUE · 24h since detection · act immediately
    </div>
  )}
  ```

  No change needed to imports (remove `INITIAL_INTERVENTIONS` from the import if it was added).

- [ ] **Replace "Call agronomist" button in `DemoCards.tsx`**

  In `DiseaseCard`, replace the `<button>` CTA block entirely with:

  ```tsx
  {/* Agronomist notification */}
  <div style={{
    marginTop: '12px',
    padding: '8px 10px',
    background: 'rgba(84,99,87,0.06)',
    border: '1px solid rgba(84,99,87,0.18)',
    borderRadius: '4px',
    fontFamily: "'Barlow Semi Condensed', sans-serif",
    fontSize: '12px',
    color: '#7A7060',
    lineHeight: 1.5,
  }}>
    Alert sent to <strong style={{ color: '#546357' }}>Dr. M. Conti</strong> (agronomist) · 23 May 07:31
    <br />
    <span style={{ color: '#CC5427', cursor: 'pointer', textDecoration: 'underline' }}>
      Contact via TropiX →
    </span>
  </div>
  ```

  Remove the `Phone` import from `DemoCards.tsx` if it's no longer used elsewhere in the file.

- [ ] **Add sap-flow tooltip to `IrrigationCard` in `DemoCards.tsx`**

  Find the "Sap-flow vs baseline" label span and add a `title` attribute:
  ```tsx
  <span
    title="Compared to 14-day average for this tree"
    style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: '11px', color: '#7A7060', cursor: 'help' }}
  >
    Sap-flow vs baseline
  </span>
  ```

- [ ] **Type-check**
  ```bash
  npx tsc --noEmit
  ```

- [ ] **Commit**
  ```bash
  git add src/components/demo/PlantPanel.tsx src/components/demo/DemoCards.tsx
  git commit -m "feat(demo): rework PlantPanel — treated state, overdue, agronomist line; DemoCards — tooltip, remove phone CTA"
  ```

---

## Task 10 — `MultiActionPanel` component

**Files:**
- Create: `src/components/demo/MultiActionPanel.tsx`

Shown in the right panel when a multi-tree intervention is selected. Lists affected trees with their sap-flow readings and a "Mark all done" button.

- [ ] **Write the component**

  ```tsx
  // src/components/demo/MultiActionPanel.tsx
  import { X, Check, Droplets, Leaf, AlertTriangle } from 'lucide-react'
  import { type Intervention, type Plant, PRIORITY_STYLE, plantLabel, STATUS_COLOR } from '../../data/demoData'

  const TYPE_ICON: Record<Intervention['type'], React.ReactNode> = {
    disease:    <AlertTriangle size={13} aria-hidden="true" />,
    irrigation: <Droplets      size={13} aria-hidden="true" />,
    fertilizer: <Leaf          size={13} aria-hidden="true" />,
  }

  interface Props {
    intervention: Intervention
    plants: Plant[]         // all plants — filtered to affected ones inside
    treatedIds: Set<number>
    onClose:        () => void
    onMarkAllDone:  () => void
    onTreeClick:    (plant: Plant) => void
  }

  export function MultiActionPanel({ intervention, plants, treatedIds, onClose, onMarkAllDone, onTreeClick }: Props) {
    const ps = PRIORITY_STYLE[intervention.priority]
    const affectedPlants = plants.filter(p => intervention.plantIds.includes(p.gridIndex))
    const allDone = intervention.done || affectedPlants.every(p => treatedIds.has(p.gridIndex))

    return (
      <div style={{
        width: '340px',
        height: '100%',
        overflowY: 'auto',
        background: '#F0EADB',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 18px 14px',
          borderBottom: '1px solid #BDB5A0',
          background: '#E8E1CF',
          position: 'sticky',
          top: 0,
          zIndex: 2,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '10px',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Type + priority */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <span style={{ color: ps.text }}>{TYPE_ICON[intervention.type]}</span>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '9px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                padding: '2px 6px',
                borderRadius: '3px',
                background: ps.bg,
                border: `1px solid ${ps.border}`,
                color: ps.text,
              }}>
                {ps.label}
              </span>
            </div>

            <div style={{
              fontFamily: "'Barlow Semi Condensed', sans-serif",
              fontSize: '15px',
              fontWeight: 600,
              color: '#191E1A',
              lineHeight: 1.3,
              marginBottom: '4px',
            }}>
              {intervention.title}
            </div>

            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              color: '#7A7060',
            }}>
              {intervention.scheduledFor} · {intervention.plantCount} trees
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close panel"
            style={{
              width: '26px', height: '26px', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: '1px solid #BDB5A0',
              borderRadius: '4px', cursor: 'pointer', color: '#7A7060',
              transition: 'background 150ms, color 150ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#191E1A'; e.currentTarget.style.color = '#E8E1CF' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#7A7060' }}
          >
            <X size={13} aria-hidden="true" />
          </button>
        </div>

        {/* Detail */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #BDB5A0' }}>
          <div style={{
            fontFamily: "'Barlow Semi Condensed', sans-serif",
            fontSize: '13px',
            color: '#546357',
            lineHeight: 1.55,
          }}>
            {intervention.detail}
          </div>
        </div>

        {/* Affected trees list */}
        <div style={{ padding: '14px 18px', flex: 1 }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#7A7060',
            marginBottom: '10px',
          }}>
            Affected trees · {affectedPlants.length}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {affectedPlants.map(plant => (
              <button
                key={plant.id}
                onClick={() => onTreeClick(plant)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 10px',
                  background: '#E8E1CF',
                  border: `1px solid #BDB5A0`,
                  borderLeft: `3px solid ${STATUS_COLOR[plant.status]}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#DDD7C4' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#E8E1CF' }}
              >
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#191E1A',
                  minWidth: '40px',
                }}>
                  {plantLabel(plant)}
                </span>

                {plant.irrigation && (
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: '11px', color: '#7A7060' }}>
                        Sap-flow
                      </span>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: plant.irrigation.sapFlowPct < 60 ? '#B83A2E' : '#CC5427', fontWeight: 600 }}>
                        {plant.irrigation.sapFlowPct}%
                      </span>
                    </div>
                    <div style={{ height: '3px', background: 'rgba(189,181,160,0.35)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${plant.irrigation.sapFlowPct}%`,
                        height: '100%',
                        background: plant.irrigation.sapFlowPct < 60 ? '#B83A2E' : '#CC5427',
                        borderRadius: '2px',
                      }} />
                    </div>
                  </div>
                )}

                {!plant.irrigation && (
                  <span style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: '12px', color: '#7A7060', flex: 1 }}>
                    View details →
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Mark all done */}
        <div style={{ padding: '14px 18px', borderTop: '1px solid #BDB5A0', background: '#E8E1CF', flexShrink: 0 }}>
          <button
            onClick={onMarkAllDone}
            disabled={allDone}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              width: '100%',
              padding: '9px 12px',
              borderRadius: '4px',
              border: `1px solid ${allDone ? 'rgba(58,122,78,0.3)' : '#BDB5A0'}`,
              background: allDone ? 'rgba(58,122,78,0.10)' : 'transparent',
              color: allDone ? '#3A7A4E' : '#7A7060',
              fontFamily: "'Barlow Semi Condensed', sans-serif",
              fontSize: '13px',
              fontWeight: 500,
              cursor: allDone ? 'default' : 'pointer',
              transition: 'all 180ms',
            }}
            onMouseEnter={e => { if (!allDone) { e.currentTarget.style.background = 'rgba(58,122,78,0.07)'; e.currentTarget.style.borderColor = 'rgba(58,122,78,0.25)'; e.currentTarget.style.color = '#3A7A4E' } }}
            onMouseLeave={e => { if (!allDone) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#BDB5A0'; e.currentTarget.style.color = '#7A7060' } }}
          >
            <Check size={12} strokeWidth={2.5} aria-hidden="true" />
            {allDone ? 'All treatments recorded' : `Mark all ${affectedPlants.length} trees done`}
          </button>
        </div>
      </div>
    )
  }
  ```

- [ ] **Type-check**
  ```bash
  npx tsc --noEmit
  ```

- [ ] **Commit**
  ```bash
  git add src/components/demo/MultiActionPanel.tsx
  git commit -m "feat(demo): MultiActionPanel — multi-tree intervention right panel"
  ```

---

## Task 11 — `Demo.tsx` full rewrite (cockpit shell + mobile gate)

**Files:**
- Rewrite: `src/pages/Demo.tsx`

This is the final assembly. All state lives here.

- [ ] **Write the full file**

  ```tsx
  // src/pages/Demo.tsx
  import { useState, useMemo, useCallback } from 'react'
  import { ArrowLeft } from 'lucide-react'
  import {
    ALL_PLANTS, INITIAL_INTERVENTIONS,
    type Plant, type Intervention,
  } from '../data/demoData'
  import { useWindowWidth } from '../hooks/useWindowWidth'
  import { AlertSidebar }    from '../components/demo/AlertSidebar'
  import { OrchardMap }      from '../components/demo/OrchardMap'
  import { PlantPanel }      from '../components/demo/PlantPanel'
  import { MultiActionPanel } from '../components/demo/MultiActionPanel'

  // Grain overlay (same as landing Hero)
  const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

  const DESKTOP_MIN = 900

  // ── State types ──────────────────────────────────────────────────────────────
  type RightPanel =
    | { kind: 'plant';  plant: Plant }
    | { kind: 'action'; action: Intervention }
    | { kind: 'none' }

  export function Demo() {
    const windowWidth = useWindowWidth()
    const isMobile    = windowWidth < DESKTOP_MIN

    const [interventions, setInterventions] = useState<Intervention[]>(INITIAL_INTERVENTIONS)
    const [rightPanel,    setRightPanel]    = useState<RightPanel>({ kind: 'none' })
    const [treatedIds,    setTreatedIds]    = useState<Set<number>>(new Set())  // gridIndex values

    // ── Derived ──────────────────────────────────────────────────────────────
    const selectedId = rightPanel.kind === 'plant' ? rightPanel.plant.gridIndex : null

    const highlightedIds = useMemo<Set<number>>(() => {
      if (rightPanel.kind === 'action') {
        return new Set(rightPanel.action.plantIds)
      }
      return new Set()
    }, [rightPanel])

    const alertCount  = ALL_PLANTS.filter(p => p.status === 'alert').length
    const urgentCount = interventions.filter(i => (i.priority === 'urgent' || i.priority === 'high') && !i.done).length

    // ── Handlers ─────────────────────────────────────────────────────────────
    const handleTreeClick = useCallback((plant: Plant) => {
      setRightPanel(prev =>
        prev.kind === 'plant' && prev.plant.gridIndex === plant.gridIndex
          ? { kind: 'none' }
          : { kind: 'plant', plant }
      )
    }, [])

    const handleAlertClick = useCallback((plant: Plant) => {
      setRightPanel({ kind: 'plant', plant })
    }, [])

    const handleActionClick = useCallback((action: Intervention) => {
      if (action.plantCount === 1) {
        // Single-tree action: open plant panel for that tree
        const plant = ALL_PLANTS.find(p => p.gridIndex === action.plantIds[0])
        if (plant) setRightPanel({ kind: 'plant', plant })
      } else {
        setRightPanel(prev =>
          prev.kind === 'action' && prev.action.id === action.id
            ? { kind: 'none' }
            : { kind: 'action', action }
        )
      }
    }, [])

    const handleMarkTreated = useCallback((gridIndex: number) => {
      setTreatedIds(prev => new Set([...prev, gridIndex]))
      // Mark related intervention done
      setInterventions(prev =>
        prev.map(i => i.plantIds.includes(gridIndex) ? { ...i, done: true } : i)
      )
    }, [])

    const handleMarkAllDone = useCallback((action: Intervention) => {
      setTreatedIds(prev => new Set([...prev, ...action.plantIds]))
      setInterventions(prev => prev.map(i => i.id === action.id ? { ...i, done: true } : i))
      setRightPanel({ kind: 'none' })
    }, [])

    const handleReset = useCallback(() => {
      setInterventions(INITIAL_INTERVENTIONS)
      setRightPanel({ kind: 'none' })
      setTreatedIds(new Set())
    }, [])

    const goBack = (e: React.MouseEvent) => {
      e.preventDefault()
      window.location.hash = ''
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    }

    // ── Mobile gate ───────────────────────────────────────────────────────────
    if (isMobile) {
      return (
        <div style={{
          height: '100vh',
          background: '#191E1A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: "'Barlow Semi Condensed', sans-serif",
        }}>
          <div style={{ maxWidth: '340px', textAlign: 'center' }}>
            {/* Wordmark */}
            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: '22px',
              color: '#E8E1CF',
              marginBottom: '28px',
            }}>
              Trop<em style={{ color: '#CC5427', fontStyle: 'italic' }}>X</em>
            </div>

            <div style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: '20px',
              color: '#E8E1CF',
              lineHeight: 1.35,
              marginBottom: '14px',
            }}>
              This demo is designed for desktop.
            </div>

            <div style={{
              fontSize: '14px',
              color: 'rgba(232,225,207,0.55)',
              lineHeight: 1.6,
              marginBottom: '28px',
            }}>
              Open it on a laptop or desktop to explore the full platform with the interactive orchard map.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <a
                href="#pilot"
                onClick={e => { e.preventDefault(); window.location.hash = 'pilot'; window.dispatchEvent(new HashChangeEvent('hashchange')) }}
                style={{
                  display: 'block',
                  padding: '11px 20px',
                  background: '#CC5427',
                  color: '#F0EADB',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'background 150ms',
                }}
              >
                Request pilot access →
              </a>
              <a
                href="#"
                onClick={goBack}
                style={{
                  display: 'block',
                  padding: '10px 20px',
                  border: '1px solid rgba(232,225,207,0.2)',
                  color: 'rgba(232,225,207,0.55)',
                  borderRadius: '4px',
                  fontSize: '14px',
                  textDecoration: 'none',
                }}
              >
                ← Back to site
              </a>
            </div>
          </div>
        </div>
      )
    }

    // ── Cockpit ───────────────────────────────────────────────────────────────
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        background: '#191E1A',
        fontFamily: "'Barlow Semi Condensed', sans-serif",
      }}>

        {/* ── Header ── */}
        <header style={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          height: '48px',
          flexShrink: 0,
          background: '#191E1A',
          borderBottom: '1px solid rgba(232,225,207,0.08)',
          zIndex: 20,
        }}>
          {/* Grain */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0,
            backgroundImage: GRAIN, backgroundSize: '256px 256px',
            opacity: 0.025, mixBlendMode: 'overlay', pointerEvents: 'none',
          }} />

          {/* Left: wordmark + farm name + KPI chips */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '19px', color: '#E8E1CF', fontWeight: 400 }}>
              Trop<em style={{ color: '#CC5427', fontStyle: 'italic' }}>X</em>
            </span>

            <div aria-hidden="true" style={{ width: '1px', height: '18px', background: 'rgba(232,225,207,0.1)' }} />

            <span style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: '12px', color: 'rgba(232,225,207,0.5)' }}>
              Az. Agr. Greco · Ragusa, Sicilia · 8.3 ha
            </span>

            {/* KPI chips */}
            {[
              { label: '120 trees',           color: undefined           },
              { label: `${alertCount} alerts`, color: alertCount > 0 ? '#B83A2E' : undefined },
              { label: `${urgentCount} urgent`, color: urgentCount > 0 ? '#CC5427' : undefined },
            ].map(chip => (
              <span key={chip.label} style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                color: chip.color ?? 'rgba(232,225,207,0.35)',
                letterSpacing: '0.06em',
              }}>
                {chip.label}
              </span>
            ))}

            {/* DEMO badge */}
            <span style={{
              padding: '2px 7px',
              borderRadius: '4px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.09em',
              fontWeight: 700,
              background: 'rgba(204,84,39,0.15)',
              border: '1px solid rgba(204,84,39,0.3)',
              color: '#CC5427',
            }}>
              DEMO
            </span>
          </div>

          {/* Right: Reset + Back */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={handleReset}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
                letterSpacing: '0.08em', color: 'rgba(232,225,207,0.25)',
                transition: 'color 180ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(232,225,207,0.55)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,225,207,0.25)')}
            >
              RESET
            </button>

            <a
              href="#"
              onClick={goBack}
              style={{
                display: 'flex', alignItems: 'center', gap: '5px',
                fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: '12px',
                color: 'rgba(232,225,207,0.55)', textDecoration: 'none',
                transition: 'color 200ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'rgba(232,225,207,0.85)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,225,207,0.55)')}
            >
              <ArrowLeft size={13} aria-hidden="true" /> Back to site
            </a>
          </div>
        </header>

        {/* ── Body: 3 columns ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

          {/* Left sidebar */}
          <AlertSidebar
            plants={ALL_PLANTS}
            interventions={interventions}
            selectedId={selectedId}
            highlightedIds={highlightedIds}
            treatedIds={treatedIds}
            onAlertClick={handleAlertClick}
            onActionClick={handleActionClick}
          />

          {/* Center map */}
          <OrchardMap
            plants={ALL_PLANTS}
            selectedId={selectedId}
            highlightedIds={highlightedIds}
            treatedIds={treatedIds}
            onTreeClick={handleTreeClick}
          />

          {/* Right panel — overlays the map */}
          {rightPanel.kind !== 'none' && (
            <div style={{
              position: 'absolute',
              right: 0, top: 0, bottom: 0,
              zIndex: 15,
              display: 'flex',
            }}>
              {/* Backdrop */}
              <div
                onClick={() => setRightPanel({ kind: 'none' })}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(25,30,26,0.25)',
                  zIndex: -1,
                }}
              />

              {rightPanel.kind === 'plant' && (
                <PlantPanel
                  plant={rightPanel.plant}
                  treated={treatedIds.has(rightPanel.plant.gridIndex)}
                  overdue={interventions.some(i => i.plantIds.includes(rightPanel.plant.gridIndex) && i.overdue && !i.done)}
                  onClose={() => setRightPanel({ kind: 'none' })}
                  onMarkTreated={() => handleMarkTreated(rightPanel.plant.gridIndex)}
                />
              )}

              {rightPanel.kind === 'action' && (
                <MultiActionPanel
                  intervention={rightPanel.action}
                  plants={ALL_PLANTS}
                  treatedIds={treatedIds}
                  onClose={() => setRightPanel({ kind: 'none' })}
                  onMarkAllDone={() => handleMarkAllDone(rightPanel.action)}
                  onTreeClick={plant => setRightPanel({ kind: 'plant', plant })}
                />
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
  ```

- [ ] **Add `onMarkTreated` prop and "Mark treated" button to `PlantPanel.tsx`**

  The `PlantPanel` currently has "Mark done" inside DemoCards. Add a footer action for non-healthy, non-treated plants:

  In `PlantPanel.tsx`, after the body div (before the closing outer div), add:
  ```tsx
  {/* ── Mark treated footer (only for non-healthy, non-treated plants) ── */}
  {plant.status !== 'healthy' && !treated && (
    <div style={{
      padding: '14px 18px',
      borderTop: '1px solid #BDB5A0',
      background: '#E8E1CF',
      flexShrink: 0,
    }}>
      <button
        onClick={onMarkTreated}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: '6px', width: '100%', padding: '9px 12px',
          background: 'transparent', border: '1px solid #BDB5A0',
          borderRadius: '4px', cursor: 'pointer',
          fontFamily: "'Barlow Semi Condensed', sans-serif",
          fontSize: '13px', fontWeight: 500, color: '#7A7060',
          transition: 'all 180ms',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(58,122,78,0.07)'; e.currentTarget.style.borderColor = 'rgba(58,122,78,0.25)'; e.currentTarget.style.color = '#3A7A4E' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#BDB5A0'; e.currentTarget.style.color = '#7A7060' }}
      >
        ✓ Mark treatment done
      </button>
    </div>
  )}
  ```

- [ ] **Type-check**
  ```bash
  npx tsc --noEmit
  ```

  Expected: 0 errors. Fix any type errors — most likely `Plant` references in existing components that need `coords` and `conditionCount` to be satisfied.

- [ ] **Full build check**
  ```bash
  npm run build
  ```
  Expected: successful build with no errors.

- [ ] **Visual verification — run the app**
  ```bash
  npm run dev
  ```

  Open `http://localhost:5173/#demo`. Verify each item:

  **Layout**
  - [ ] Dark sidebar (220px) on left, aerial map fills center, no tabs visible
  - [ ] Header shows wordmark + farm name + KPI chips + DEMO badge + RESET + Back

  **Sidebar**
  - [ ] Health chip shows "108 healthy · 4 alerts"
  - [ ] Weather strip shows 3 days; tomorrow highlighted amber (34°C)
  - [ ] 4 alert rows: A-14 shows OVERDUE badge, all show "Xd before symptoms"
  - [ ] Action list shows 8 pending actions (done items not shown)

  **Map**
  - [ ] Aerial image visible
  - [ ] 120 circles overlaid, correct colors (mostly green, some orange, 4 red)
  - [ ] Alert circles pulse
  - [ ] Scroll to zoom — circles stay same screen size at all zoom levels
  - [ ] Drag to pan when zoomed in
  - [ ] Double-click zooms 2×; double-click at max zooms out
  - [ ] +/−/⊙ buttons work
  - [ ] Zone labels visible on image
  - [ ] Timestamp bottom-left

  **Right panel**
  - [ ] Click a tree → PlantPanel slides in from right, map stays full-width (overlaid)
  - [ ] Click backdrop → panel closes
  - [ ] Click alert A-14 in sidebar → plant panel opens, shows OVERDUE warning
  - [ ] Click "Mark treatment done" → tree turns amber on map, panel shows "Treatment recorded"
  - [ ] Click "Irrigate × 5 trees" action → MultiActionPanel opens, 5 circles highlight on map
  - [ ] Click "Mark all done" → closes panel, 5 circles turn amber

  **Mobile gate**
  - [ ] Resize browser to <900px → gate screen appears (dark bg, centered text, 2 CTAs)
  - [ ] Resize back to >900px → cockpit reappears

  **Reset**
  - [ ] Click RESET → all state clears (amber circles revert, done items reappear)

- [ ] **Commit**
  ```bash
  git add src/pages/Demo.tsx src/components/demo/PlantPanel.tsx
  git commit -m "feat(demo): Demo.tsx cockpit rewrite — 3-column layout, mobile gate, full state management"
  ```

---

## Post-implementation checklist

- [ ] Run `npm run lint` — fix any lint warnings
- [ ] Final build: `npm run build` — 0 errors, 0 warnings
- [ ] Verify image is not committed to git if it's large (add `src/assets/orchard-aerial.jpg` to `.gitignore` if >500KB and distribute separately)
- [ ] Smoke-test the landing page route (`/`) still works correctly after Demo changes
