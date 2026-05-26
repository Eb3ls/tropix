# Demo Visual Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the existing demo cockpit's visual hierarchy through 4 surgical changes: a dark authority header, coded section borders in the sidebar, a hero probability number in the disease card, and a map vignette — all while staying on the existing warm cream palette.

**Architecture:** Four isolated edits across four existing files. No new files, no new dependencies, no data model changes, no routing changes. Each task is independently commit-able.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4 (tokens via inline styles in demo), Lucide React, Vite. No test runner — verification is `npm run lint && npm run build` + visual check in browser at `npm run dev`.

---

## File Map

| File | Change |
|---|---|
| `src/pages/Demo.tsx` | Header: bg `#191E1A`, cream text, grain blend `overlay` |
| `src/components/demo/AlertSidebar.tsx` | Section headers: colored 3px left border + adjusted padding |
| `src/components/demo/DemoCards.tsx` | `DiseaseCard`: hero `44px` probability number, secondary days-count |
| `src/components/demo/OrchardMap.tsx` | Vignette overlay after transform wrapper; zone label text-shadow |

---

## Task 1: Dark Header (`Demo.tsx`)

**Files:**
- Modify: `src/pages/Demo.tsx` — header `<header>` block only (lines 186–294)

### What changes and why

| Element | Before | After | Reason |
|---|---|---|---|
| Header bg | `#F0EADB` | `#191E1A` | Authority strip, matches landing dark sections |
| Header border | `1px solid #BDB5A0` | `1px solid rgba(255,255,255,0.07)` | Subtle separation on dark |
| Grain blend | `mixBlendMode: 'multiply'` | `mixBlendMode: 'overlay'` | `multiply` is invisible on dark bg |
| Grain opacity | `0.04` | `0.06` | Slightly stronger for overlay mode |
| Wordmark color | `#191E1A` | `#E8E1CF` | Legible on dark |
| Divider | `background: '#BDB5A0'` | `background: 'rgba(232,225,207,0.15)'` | Subtle on dark |
| Farm name | `color: '#7A7060'` | `color: 'rgba(232,225,207,0.5)'` | Muted cream |
| Trees KPI | `color: '#546357'` | `color: 'rgba(232,225,207,0.55)'` | Muted cream |
| Dot separator | `color: '#BDB5A0'` | `color: 'rgba(232,225,207,0.2)'` | Subtle on dark |
| Alert count | `color: '#B83A2E'` | `color: '#CC5427'` | Accent orange reads better on dark than deep red |
| DEMO badge | unchanged | unchanged | Already uses `rgba(204,84,39,…)` — works on dark |
| RESET button | `color: '#BDB5A0'` / hover `'#546357'` | `color: 'rgba(232,225,207,0.3)'` / hover `'rgba(232,225,207,0.7)'` | Cream scale |
| Back button | `color: '#7A7060'` / hover `'#191E1A'` | `color: 'rgba(232,225,207,0.5)'` / hover `'#E8E1CF'` | Cream scale |

- [ ] **Step 1: Verify baseline builds**

```bash
cd /home/leo/Documents/tropix && npm run lint && npm run build
```
Expected: no errors. If any, fix before proceeding.

- [ ] **Step 2: Replace the `<header>` block in `Demo.tsx`**

Replace lines 186–294 (the entire `{/* ── Header ── */}` block) with:

```tsx
      {/* ── Header ── */}
      <header style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: '52px',
        flexShrink: 0,
        background: '#191E1A',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        zIndex: 20,
      }}>
        {/* Grain */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          backgroundImage: GRAIN, backgroundSize: '256px 256px',
          opacity: 0.06, mixBlendMode: 'overlay', pointerEvents: 'none',
        }} />

        {/* Left: wordmark + farm name + KPI chips */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '20px', color: '#E8E1CF', fontWeight: 400 }}>
            Tropi<em style={{ color: '#CC5427', fontStyle: 'italic' }}>X</em>
          </span>

          <div aria-hidden="true" style={{ width: '1px', height: '18px', background: 'rgba(232,225,207,0.15)' }} />

          <span style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: '12px', color: 'rgba(232,225,207,0.5)' }}>
            Az. Agr. Greco · Ragusa, Sicilia · 8.3 ha
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              color: 'rgba(232,225,207,0.55)',
              letterSpacing: '0.06em',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {ALL_PLANTS.length} trees
            </span>

            {alertCount > 0 && (
              <>
                <span aria-hidden="true" style={{ color: 'rgba(232,225,207,0.2)', fontSize: '10px' }}>·</span>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '11px',
                  color: '#CC5427',
                  letterSpacing: '0.06em',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {alertCount} {alertCount === 1 ? 'disease alert' : 'disease alerts'}
                </span>
              </>
            )}
          </div>

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
              letterSpacing: '0.08em', color: 'rgba(232,225,207,0.3)',
              transition: 'color 180ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(232,225,207,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,225,207,0.3)')}
          >
            RESET
          </button>

          <a
            href="#"
            onClick={goBack}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: '12px',
              color: 'rgba(232,225,207,0.5)', textDecoration: 'none',
              transition: 'color 200ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E8E1CF')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,225,207,0.5)')}
          >
            <ArrowLeft size={13} aria-hidden="true" /> Back to site
          </a>
        </div>
      </header>
```

- [ ] **Step 3: Verify build**

```bash
npm run lint && npm run build
```
Expected: no TypeScript errors, no ESLint errors.

- [ ] **Step 4: Visual check**

```bash
npm run dev
```
Open `http://localhost:5173/#demo`. Confirm:
- Header is dark forest green/black (`#191E1A`)
- Wordmark "TropiX" shows in warm cream, the X remains terracotta orange
- Farm name and KPI text is legible but subdued
- RESET and Back links are visible, hover brightens them
- The warm cream sidebar begins immediately below — the contrast is the point

- [ ] **Step 5: Commit**

```bash
git add src/pages/Demo.tsx
git commit -m "feat(demo): dark authority header — #191E1A strip with cream text"
```

---

## Task 2: Sidebar Section Header Left Borders (`AlertSidebar.tsx`)

**Files:**
- Modify: `src/components/demo/AlertSidebar.tsx` — three section header `<div>` elements only

### What changes and why

Each of the three section headers gets:
1. A `3px` left border in its semantic color (red for disease, terracotta for monitoring, stone for scheduled)
2. Padding adjusted from `'0 16px 8px'` → `'6px 16px 6px 13px'` so content stays at 16px from the left edge (13px padding + 3px border = 16px, matching button text alignment)
3. `background: '#F0EADB'` explicitly set (needed so if sticky is added later, no content bleeds through)

The button items below each header already have `borderLeft: 2px solid [color]` — the section header border creates a consistent left-gutter that reinforces the color coding system.

**Disease alerts header** — `borderLeft: '3px solid #B83A2E'`  
**Field alerts header** — `borderLeft: '3px solid #CC5427'` + color upgraded to `'#CC5427'`  
**Scheduled actions header** — `borderLeft: '3px solid #BDB5A0'`

- [ ] **Step 1: Update Disease Alerts section header**

In `AlertSidebar.tsx`, find and replace the disease alerts section header div:

```tsx
// BEFORE (lines ~42–50):
        <div style={{
          padding: '0 16px 8px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#CC5427',
        }}>
          Disease alerts · {diseasePlants.length}
        </div>

// AFTER:
        <div style={{
          padding: '6px 16px 6px 13px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#CC5427',
          borderLeft: '3px solid #B83A2E',
          background: '#F0EADB',
        }}>
          Disease alerts · {diseasePlants.length}
        </div>
```

- [ ] **Step 2: Update Field Alerts section header**

```tsx
// BEFORE (lines ~156–163):
          <div style={{
            padding: '8px 16px 6px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#7A7060',
          }}>
            Field alerts · {monitorPlants.length}
          </div>

// AFTER:
          <div style={{
            padding: '6px 16px 6px 13px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#CC5427',
            borderLeft: '3px solid #CC5427',
            background: '#F0EADB',
          }}>
            Field alerts · {monitorPlants.length}
          </div>
```

- [ ] **Step 3: Update Scheduled Actions section header**

```tsx
// BEFORE (lines ~246–253):
        <div style={{
          padding: '0 16px 8px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#546357',
        }}>
          Scheduled actions · {pendingActions.length}
        </div>

// AFTER:
        <div style={{
          padding: '6px 16px 6px 13px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#546357',
          borderLeft: '3px solid #BDB5A0',
          background: '#F0EADB',
        }}>
          Scheduled actions · {pendingActions.length}
        </div>
```

- [ ] **Step 4: Verify build**

```bash
npm run lint && npm run build
```
Expected: clean.

- [ ] **Step 5: Visual check**

In browser at `/#demo`:
- Left sidebar shows three sections each with a distinct left color gutter:
  - Red gutter for Disease Alerts
  - Terracotta gutter for Field Alerts  
  - Stone gutter for Scheduled Actions
- Button left borders (2px) visually extend the section color down through each row

- [ ] **Step 6: Commit**

```bash
git add src/components/demo/AlertSidebar.tsx
git commit -m "feat(demo): sidebar section headers — semantic left-border color system"
```

---

## Task 3: DiseaseCard Hero Probability Number (`DemoCards.tsx`)

**Files:**
- Modify: `src/components/demo/DemoCards.tsx` — `DiseaseCard` function only (lines 4–129)

### What changes and why

The most critical metric — disease probability — is buried at `12px` next to a progress bar label. The user should see `87%` in 0.3 seconds. New layout promotes it to `44px` IBM Plex Mono as the primary visual anchor, with the disease name immediately below in italic serif (same size as now: `15px`). The `daysBeforeSymptoms` becomes a secondary hero (`22px` number + `10px` label) below it. The progress bar stays but loses its redundant numeric label — the `44px` number above already communicates the value.

`IrrigationCard` and `FertilizerCard` are unchanged — they have no single urgency metric to hero.

- [ ] **Step 1: Replace `DiseaseCard` in `DemoCards.tsx`**

Replace the entire `DiseaseCard` function (from `export function DiseaseCard` to its closing `}`) with:

```tsx
export function DiseaseCard({ d }: { d: DiseaseRec }) {
  return (
    <div
      style={{
        background: 'rgba(184,58,46,0.04)',
        border: '1px solid rgba(184,58,46,0.18)',
        borderLeft: '3px solid #B83A2E',
        borderRadius: '4px',
        padding: '16px',
        marginBottom: '10px',
      }}
    >
      {/* Eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
        <AlertTriangle size={12} style={{ color: '#B83A2E', flexShrink: 0 }} strokeWidth={2} aria-hidden="true" />
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#B83A2E',
          }}
        >
          Disease detected
        </span>
      </div>

      {/* Hero: probability + disease name */}
      <div style={{ marginBottom: '14px' }}>
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '44px',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 700,
            color: '#B83A2E',
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {d.probability}%
        </div>
        <div
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontStyle: 'italic',
            fontSize: '15px',
            color: '#191E1A',
            marginTop: '6px',
            lineHeight: 1.3,
          }}
        >
          {d.name}
        </div>
      </div>

      {/* Secondary hero: days before symptoms */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '22px',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 700,
            color: '#B83A2E',
            lineHeight: 1,
          }}
        >
          {d.daysBeforeSymptoms}
        </span>
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#7A7060',
          }}
        >
          days before symptoms
        </span>
      </div>

      {/* Detection timestamp */}
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          color: '#BDB5A0',
          marginBottom: '12px',
        }}
      >
        Detected: {d.detectedAt}
      </div>

      {/* Probability bar — visual reinforcement, no label needed (44px number above) */}
      <div style={{ marginBottom: '12px' }}>
        <div style={{ height: '4px', background: 'rgba(184,58,46,0.12)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${d.probability}%`, height: '100%', background: '#B83A2E', borderRadius: '2px' }} />
        </div>
      </div>

      {/* Action */}
      <div style={{ borderTop: '1px solid rgba(189,181,160,0.35)', paddingTop: '10px' }}>
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: '#7A7060',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '5px',
          }}
        >
          Recommended action
        </div>
        <div
          style={{
            fontFamily: "'Barlow Semi Condensed', sans-serif",
            fontSize: '13px',
            color: '#191E1A',
            lineHeight: 1.55,
          }}
        >
          {d.action}
        </div>
      </div>

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
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npm run lint && npm run build
```
Expected: clean. `IrrigationCard` and `FertilizerCard` are unchanged, TypeScript types unchanged.

- [ ] **Step 3: Visual check**

In browser: click any red alert tree (e.g. A-14). In the right panel:
- The disease probability percentage is the first thing your eye lands on at `44px`
- Disease name sits underneath in italic serif, elegant and readable
- `3 days before symptoms` secondary stat below that
- Detection timestamp in muted stone
- Progress bar as a thin visual baseline below
- Recommended action + agronomist box at the bottom

- [ ] **Step 4: Commit**

```bash
git add src/components/demo/DemoCards.tsx
git commit -m "feat(demo): DiseaseCard hero probability — 44px number as primary visual anchor"
```

---

## Task 4: Map Edge Vignette + Zone Label Text-Shadow (`OrchardMap.tsx`)

**Files:**
- Modify: `src/components/demo/OrchardMap.tsx` — add vignette div after transform wrapper; update zone label style

### What changes and why

The aerial photo currently bleeds to the edges of its container with no visual frame. A radial gradient vignette (dark at edges, transparent at center) creates atmosphere and makes the cockpit feel like an instrument viewing a territory — consistent with the landing page's grain and texture approach. 

`ZoomControls` already has `zIndex: 10`. The vignette div (no explicit z-index, placed between transform wrapper and ZoomControls in DOM) will naturally sit above the photo but below the controls — CSS DOM order handles this in the shared `position: relative` stacking context.

Zone labels are currently faint `rgba(232,225,207,0.5)`. A `textShadow` makes them legible over any terrain color without changing their visual style.

- [ ] **Step 1: Add vignette div after the transform wrapper in `OrchardMap.tsx`**

Find the closing `</div>` of the transform wrapper (the div with `transformOrigin: '0 0'` and `transform: translate...scale`). After it, insert:

```tsx
        {/* Edge vignette — frames the aerial photo, gives cockpit depth */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: 'radial-gradient(ellipse at 50% 50%, transparent 48%, rgba(25,30,26,0.55) 100%)',
          }}
        />
```

No `zIndex` needed. It sits after the transform wrapper and before `<ZoomControls>` in DOM order within the `position: relative` container.

- [ ] **Step 2: Improve zone label text legibility**

In the same file, find the zone label `<div>` inside the `ZONES.map(...)`. Update the style object:

```tsx
// BEFORE:
            style={{
              position: 'absolute',
              top: cy,
              left: '12px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: `${11 / tf.scale}px`,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(232,225,207,0.5)',
              pointerEvents: 'none',
              lineHeight: 1.4,
            }}

// AFTER:
            style={{
              position: 'absolute',
              top: cy,
              left: '12px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: `${11 / tf.scale}px`,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(232,225,207,0.65)',
              pointerEvents: 'none',
              lineHeight: 1.4,
              textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 10px rgba(0,0,0,0.5)',
            }}
```

- [ ] **Step 3: Verify build**

```bash
npm run lint && npm run build
```
Expected: clean. No type changes — all new style properties are valid `CSSProperties`.

- [ ] **Step 4: Visual check**

In browser at `/#demo`:
- Map edges darken subtly into the surrounding frame
- At default zoom (1×), the vignette creates a gentle frame around the orchard
- Zone labels are clearly readable over light and dark terrain patches
- ZoomControls (bottom-right) remain fully visible above the vignette — confirm by hovering buttons

- [ ] **Step 5: Commit**

```bash
git add src/components/demo/OrchardMap.tsx
git commit -m "feat(demo): map vignette overlay + zone label text-shadow for readability"
```

---

## Self-Review

**Spec coverage:**
- ✅ Dark header: Task 1
- ✅ Sidebar section visual system: Task 2  
- ✅ Hero number in disease panel: Task 3
- ✅ Map vignette: Task 4
- ✅ `IrrigationCard`, `FertilizerCard`, `MultiActionPanel`, `WeatherStrip`, `PlantPanel` — intentionally unchanged

**Placeholder scan:** No TBDs, no "handle edge cases", no forward references. All code is complete.

**Type consistency:**
- Task 1: no type changes — only string color values in inline styles
- Task 2: no type changes — same `Props` interface
- Task 3: `DiseaseCard` signature `({ d }: { d: DiseaseRec })` unchanged, all `d.*` accesses (`d.probability`, `d.name`, `d.daysBeforeSymptoms`, `d.detectedAt`, `d.action`) are existing fields
- Task 4: no type changes — new div has no props
