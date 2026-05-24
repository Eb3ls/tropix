import { useRef, useState, useCallback, useEffect } from 'react'
import { TreeCircles } from './TreeCircles'
import { ZoomControls } from './ZoomControls'
import { computeWheelZoom } from './orchardMapMath'
import { type Plant, CULTIVARS, ZONE_LABEL, type Zone } from '../../data/demoData'

const MIN_ZOOM = 0.8
const MAX_ZOOM = 4.0
const ZOOM_STEP = 0.25

const ZONES: Array<{ zone: Zone; cy: string }> = [
  { zone: 'Nord',   cy: '2%'  },
  { zone: 'Centro', cy: '43%' },
  { zone: 'Sud',    cy: '69%' },
]

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
  const containerRef = useRef<HTMLDivElement>(null)
  const [tf, setTf]  = useState<Transform>({ scale: 1, x: 0, y: 0 })
  const dragRef      = useRef<{ startX: number; startY: number; tx: number; ty: number } | null>(null)

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

  // ── Drag to pan (only when zoomed in) ─────────────────────────────────────
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (tf.scale <= 1) return
    dragRef.current = { startX: e.clientX, startY: e.clientY, tx: tf.x, ty: tf.y }
  }, [tf])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const drag = dragRef.current
      if (!drag) return
      const dx = e.clientX - drag.startX
      const dy = e.clientY - drag.startY
      setTf(prev => {
        const clamped = clamp(drag.tx + dx, drag.ty + dy, prev.scale)
        return { ...prev, x: clamped.x, y: clamped.y }
      })
    }
    const handleMouseUp = () => { dragRef.current = null }
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
        cursor: tf.scale > 1 ? 'grab' : 'default',
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
        {/* Aerial photo — loaded from public/ as a URL string */}
        <img
          src="/orchard-aerial.png"
          alt="Aerial view of Az. Agr. Greco orchard"
          draggable={false}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />

        {/* SVG circle overlay */}
        <TreeCircles
          plants={plants}
          selectedId={selectedId}
          highlightedIds={highlightedIds}
          treatedIds={treatedIds}
          zoom={tf.scale}
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
              fontSize: `${11 / tf.scale}px`,
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
            fontSize: `${9 / tf.scale}px`,
            color: 'rgba(232,225,207,0.35)',
            pointerEvents: 'none',
          }}
        >
          Last flight · 24 May · 06:47 · Drone survey
        </div>
      </div>

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
