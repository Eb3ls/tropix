import { useRef, useState, useCallback, useEffect } from 'react'
import { TreeCircles } from './TreeCircles'
import { ZoomControls } from './ZoomControls'
import { computeWheelZoom } from './orchardMapMath'
import { type Plant, ABSENT_GRID_INDICES } from '../../data/demoData'

const MIN_ZOOM = 0.8
const MAX_ZOOM = 4.0
const ZOOM_STEP = 0.25

// Row cy positions (% of image height) — calibrated against aerial photo
const DEBUG_ROWS = [8, 14, 23, 30, 38, 45, 54, 61, 68, 77, 84, 91]

// Column cx positions (% of image width) — mirrors the +2 left-half correction in demoData
const COL_START = 4, COL_STEP = 7.7, COL_STAGGER = -4
const debugShift = (cx: number) => cx <= 45 ? cx + 2 : cx
const DEBUG_COLS_EVEN = Array.from({ length: 12 }, (_, i) =>
  debugShift(Math.round((COL_START + i * COL_STEP) * 10) / 10)
)
const DEBUG_COLS_ODD = Array.from({ length: 12 }, (_, i) =>
  debugShift(Math.round((COL_START + COL_STAGGER + i * COL_STEP) * 10) / 10)
).filter(c => c >= 2)

interface Props {
  plants: Plant[]
  selectedId: number | null
  highlightedIds: Set<number>
  treatedIds: Set<number>
  onTreeClick: (plant: Plant) => void
}

/** Combined scale + translate — updated atomically to avoid React anti-patterns. */
type Transform = { scale: number; x: number; y: number }

export function OrchardMap({ plants, selectedId, highlightedIds, treatedIds, onTreeClick }: Props) {
  const containerRef  = useRef<HTMLDivElement>(null)
  const [tf, setTf]   = useState<Transform>({ scale: 1, x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  // mapHeight drives proportional marker sizes — constant visual proportion
  // across all viewport sizes regardless of px screen dimensions.
  const [mapHeight, setMapHeight] = useState(640)
  // Debug grid — toggle with D key; shows row lines + per-tree coords for calibration
  const [debugGrid, setDebugGrid] = useState(false)
  /** Stores only the *previous* mouse position — no stale transform snapshot. */
  const dragRef       = useRef<{ prevX: number; prevY: number } | null>(null)

  // ── Clamp translate so the image stays mostly on-screen ──────────────────
  const clamp = useCallback((tx: number, ty: number, s: number): { x: number; y: number } => {
    const c = containerRef.current
    if (!c) return { x: tx, y: ty }
    const { width: cw, height: ch } = c.getBoundingClientRect()
    const maxX = cw * 0.8
    const minX = cw * (0.2 - s)      // right edge must stay ≥ 20% into container
    const maxY = ch * 0.8
    const minY = ch * (0.2 - s)
    return {
      x: Math.min(maxX, Math.max(minX, tx)),
      y: Math.min(maxY, Math.max(minY, ty)),
    }
  }, [])

  // ── Non-passive wheel listener (required for e.preventDefault()) ──────────
  // setTf updater is pure — no side effects, both scale+translate updated atomically.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect = el.getBoundingClientRect()
      setTf(prev => {
        const r = computeWheelZoom({
          prevScale:       prev.scale,
          deltaY:          e.deltaY,
          mouseX:          e.clientX - rect.left,
          mouseY:          e.clientY - rect.top,
          translateX:      prev.x,
          translateY:      prev.y,
          containerWidth:  rect.width,
          containerHeight: rect.height,
          minZoom: MIN_ZOOM,
          maxZoom: MAX_ZOOM,
        })
        return { scale: r.scale, x: r.translateX, y: r.translateY }
      })
    }
    el.addEventListener('wheel', onWheel as EventListener, { passive: false } as AddEventListenerOptions)
    return () => el.removeEventListener('wheel', onWheel as EventListener)
  }, [])

  // ── D key toggles calibration debug grid ─────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') setDebugGrid(prev => !prev)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // ── Proportional marker size — tracks container height ───────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const { height } = el.getBoundingClientRect()
      if (height > 0) setMapHeight(height)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // ── Drag to pan (only when zoomed in) ─────────────────────────────────────
  // Delta-based: dragRef stores only the *previous* mouse position.
  // Each move computes dx/dy from prev, then applies to prev.x/prev.y via
  // the functional updater — no stale closure on the initial transform.
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (tf.scale <= 1) return
    e.preventDefault()
    dragRef.current = { prevX: e.clientX, prevY: e.clientY }
    setIsDragging(true)
  }, [tf.scale])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const drag = dragRef.current
      if (!drag) return
      const dx = e.clientX - drag.prevX
      const dy = e.clientY - drag.prevY
      drag.prevX = e.clientX   // advance the anchor every frame
      drag.prevY = e.clientY
      setTf(prev => {
        const clamped = clamp(prev.x + dx, prev.y + dy, prev.scale)
        return { ...prev, x: clamped.x, y: clamped.y }
      })
    }
    const handleMouseUp = () => {
      dragRef.current = null
      setIsDragging(false)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup',   handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup',   handleMouseUp)
    }
  }, [clamp])

  // ── Double-click: zoom to 2× at cursor, or reset if near max ─────────────
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    const c = containerRef.current
    if (!c) return
    if (tf.scale >= MAX_ZOOM * 0.9) {
      setTf({ scale: 1, x: 0, y: 0 })
      return
    }
    const rect     = c.getBoundingClientRect()
    const mouseX   = e.clientX - rect.left
    const mouseY   = e.clientY - rect.top
    const newScale = Math.min(MAX_ZOOM, tf.scale * 2)
    const contentX = (mouseX - tf.x) / tf.scale
    const contentY = (mouseY - tf.y) / tf.scale
    const newTx    = mouseX - contentX * newScale
    const newTy    = mouseY - contentY * newScale
    const clamped  = clamp(newTx, newTy, newScale)
    setTf({ scale: newScale, x: clamped.x, y: clamped.y })
  }, [tf, clamp])

  // ── Button zoom controls ───────────────────────────────────────────────────
  const zoomIn = useCallback(() => {
    const c = containerRef.current
    if (!c) return
    const { width: cw, height: ch } = c.getBoundingClientRect()
    setTf(prev => {
      const newScale = Math.min(MAX_ZOOM, prev.scale + ZOOM_STEP)
      const clamped  = clamp(
        cw / 2 - (cw / 2 - prev.x) * (newScale / prev.scale),
        ch / 2 - (ch / 2 - prev.y) * (newScale / prev.scale),
        newScale,
      )
      return { scale: newScale, x: clamped.x, y: clamped.y }
    })
  }, [clamp])

  const zoomOut = useCallback(() => {
    const c = containerRef.current
    if (!c) return
    const { width: cw, height: ch } = c.getBoundingClientRect()
    setTf(prev => {
      const newScale = Math.max(MIN_ZOOM, prev.scale - ZOOM_STEP)
      const clamped  = clamp(
        cw / 2 - (cw / 2 - prev.x) * (newScale / prev.scale),
        ch / 2 - (ch / 2 - prev.y) * (newScale / prev.scale),
        newScale,
      )
      return { scale: newScale, x: clamped.x, y: clamped.y }
    })
  }, [clamp])

  const resetZoom = useCallback(() => setTf({ scale: 1, x: 0, y: 0 }), [])

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        background: '#191E1A',
        cursor: isDragging ? 'grabbing' : tf.scale > 1 ? 'grab' : 'default',
        userSelect: 'none',
      }}
    >
      {/* ── Transformed wrapper (image + SVG move together) ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: '0 0',
          transform: `translate(${tf.x}px, ${tf.y}px) scale(${tf.scale})`,
          willChange: 'transform',
        }}
      >
        {/* Aerial photo — objectFit intentionally omitted (defaults to fill).
            fill keeps the full image visible so SVG % coords align 1:1. */}
        <img
          src="/orchard-aerial.png"
          alt="Aerial view of Az. Agr. Greco orchard"
          draggable={false}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />

        {/* Tree marker overlay — absent trees (road boundary + bare-earth spots) are excluded */}
        <TreeCircles
          plants={plants.filter(p => !ABSENT_GRID_INDICES.has(p.gridIndex))}
          selectedId={selectedId}
          highlightedIds={highlightedIds}
          treatedIds={treatedIds}
          zoom={tf.scale}
          mapHeight={mapHeight}
          showDebug={debugGrid}
          onTreeClick={onTreeClick}
        />

        {/* Debug grid — horizontal row lines */}
        {debugGrid && DEBUG_ROWS.map(rowCy => (
          <div
            key={`row-${rowCy}`}
            aria-hidden="true"
            style={{
              position: 'absolute', left: 0, right: 0,
              top: `${rowCy}%`,
              height: `${1 / tf.scale}px`,
              background: 'rgba(255,230,0,0.65)',
              pointerEvents: 'none',
              display: 'flex', alignItems: 'center',
            }}
          >
            <span style={{
              background: 'rgba(0,0,0,0.82)', color: '#FFE600',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: `${9 / tf.scale}px`,
              padding: `${1.5 / tf.scale}px ${4 / tf.scale}px`,
              borderRadius: `${2 / tf.scale}px`,
              lineHeight: 1, whiteSpace: 'nowrap',
              marginLeft: `${4 / tf.scale}px`,
            }}>
              cy={rowCy}
            </span>
          </div>
        ))}

        {/* Debug grid — vertical column lines: even rows (cyan) */}
        {debugGrid && DEBUG_COLS_EVEN.map(colCx => (
          <div
            key={`ce-${colCx}`}
            aria-hidden="true"
            style={{
              position: 'absolute', top: 0, bottom: 0,
              left: `${colCx}%`,
              width: `${1 / tf.scale}px`,
              background: 'rgba(0,210,255,0.45)',
              pointerEvents: 'none',
              display: 'flex', alignItems: 'flex-start',
            }}
          >
            <span style={{
              background: 'rgba(0,0,0,0.75)', color: '#00D2FF',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: `${8 / tf.scale}px`,
              padding: `${1 / tf.scale}px ${2 / tf.scale}px`,
              lineHeight: 1, whiteSpace: 'nowrap',
              marginTop: `${4 / tf.scale}px`,
              writingMode: 'vertical-rl',
            }}>
              {colCx}
            </span>
          </div>
        ))}

        {/* Debug grid — vertical column lines: odd rows (orange) */}
        {debugGrid && DEBUG_COLS_ODD.map(colCx => (
          <div
            key={`co-${colCx}`}
            aria-hidden="true"
            style={{
              position: 'absolute', top: 0, bottom: 0,
              left: `${colCx}%`,
              width: `${1 / tf.scale}px`,
              background: 'rgba(255,140,0,0.45)',
              pointerEvents: 'none',
              display: 'flex', alignItems: 'flex-start',
            }}
          >
            <span style={{
              background: 'rgba(0,0,0,0.75)', color: '#FF8C00',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: `${8 / tf.scale}px`,
              padding: `${1 / tf.scale}px ${2 / tf.scale}px`,
              lineHeight: 1, whiteSpace: 'nowrap',
              marginTop: `${24 / tf.scale}px`,
              writingMode: 'vertical-rl',
            }}>
              {colCx}
            </span>
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
            fontSize: `${9 / tf.scale}px`,
            color: 'rgba(232,225,207,0.35)',
            pointerEvents: 'none',
          }}
        >
          Last flight · 24 May · 06:47 · Drone survey
        </div>
      </div>

      {/* Debug banner — outside transform, fixed screen position */}
      {debugGrid && (
        <div
          aria-hidden="true"
          style={{
            position:   'absolute',
            top: '8px', left: '8px', right: '56px',
            zIndex:      20,
            background:  'rgba(0,0,0,0.88)',
            color:       '#FFE600',
            fontFamily:  "'IBM Plex Mono', monospace",
            fontSize:    '10px',
            padding:     '6px 12px',
            borderRadius:'4px',
            pointerEvents: 'none',
            display:     'flex',
            gap:         '20px',
            flexWrap:    'wrap',
          }}
        >
          <span>⚙ DEBUG · press D to exit</span>
          <span>Yellow lines = row cy positions (% of height)</span>
          <span>Each marker = tree ID · cx / cy</span>
        </div>
      )}

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

      {/* Zoom controls — outside transform, stays at fixed screen position */}
      <ZoomControls
        zoom={tf.scale}
        minZoom={MIN_ZOOM}
        maxZoom={MAX_ZOOM}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetZoom}
      />
    </div>
  )
}
