import { useRef, useState, useCallback, useEffect } from 'react'
import { TreeCircles } from './TreeCircles'
import { ZoomControls } from './ZoomControls'
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

export function OrchardMap({ plants, selectedId, highlightedIds, treatedIds, onTreeClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale]         = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  // Mirror translate in a ref so wheel handler never reads a stale closure value
  const translateRef = useRef({ x: 0, y: 0 })
  useEffect(() => { translateRef.current = translate }, [translate])

  const dragRef = useRef<{ startX: number; startY: number; tx: number; ty: number } | null>(null)

  // ── Clamp translate so the image doesn't pan completely off screen ──────────
  const clampTranslate = useCallback((tx: number, ty: number, s: number) => {
    const c = containerRef.current
    if (!c) return { x: tx, y: ty }
    const { width: cw, height: ch } = c.getBoundingClientRect()
    const maxX = cw * 0.8
    const minX = cw * (1 - s * 0.8)
    const maxY = ch * 0.8
    const minY = ch * (1 - s * 0.8)
    return {
      x: Math.min(maxX, Math.max(minX, tx)),
      y: Math.min(maxY, Math.max(minY, ty)),
    }
  }, [])

  // ── Non-passive wheel listener (required for e.preventDefault() to work) ───
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const rect   = el.getBoundingClientRect()
      const mouseX = e.clientX - rect.left
      const mouseY = e.clientY - rect.top

      setScale(prevScale => {
        const factor   = e.deltaY < 0 ? 1.12 : 1 / 1.12
        const newScale = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prevScale * factor))
        const { x: tx, y: ty } = translateRef.current
        const contentX = (mouseX - tx) / prevScale
        const contentY = (mouseY - ty) / prevScale
        const newTx    = mouseX - contentX * newScale
        const newTy    = mouseY - contentY * newScale
        const clamped  = clampTranslate(newTx, newTy, newScale)
        setTranslate(clamped)
        return newScale
      })
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel, { passive: false })
  }, [clampTranslate])

  // ── Drag to pan (only when zoomed in) ──────────────────────────────────────
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (scale <= 1) return
    dragRef.current = { startX: e.clientX, startY: e.clientY, tx: translate.x, ty: translate.y }
  }, [scale, translate])

  // Ref for current scale — used in drag handler to avoid churn of re-registration
  const scaleRef = useRef(scale)
  useEffect(() => { scaleRef.current = scale }, [scale])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return
      const dx = e.clientX - dragRef.current.startX
      const dy = e.clientY - dragRef.current.startY
      const clamped = clampTranslate(
        dragRef.current.tx + dx,
        dragRef.current.ty + dy,
        scaleRef.current,
      )
      setTranslate(clamped)
    }
    const handleMouseUp = () => { dragRef.current = null }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup',   handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup',   handleMouseUp)
    }
  }, [clampTranslate])

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
  const zoomIn = useCallback(() => {
    const c = containerRef.current
    if (!c) return
    const { width: cw, height: ch } = c.getBoundingClientRect()
    const newScale = Math.min(MAX_ZOOM, scale + ZOOM_STEP)
    const newTx    = cw / 2 - (cw / 2 - translate.x) * (newScale / scale)
    const newTy    = ch / 2 - (ch / 2 - translate.y) * (newScale / scale)
    setScale(newScale)
    setTranslate(clampTranslate(newTx, newTy, newScale))
  }, [scale, translate, clampTranslate])

  const zoomOut = useCallback(() => {
    const c = containerRef.current
    if (!c) return
    const { width: cw, height: ch } = c.getBoundingClientRect()
    const newScale = Math.max(MIN_ZOOM, scale - ZOOM_STEP)
    const newTx    = cw / 2 - (cw / 2 - translate.x) * (newScale / scale)
    const newTy    = ch / 2 - (ch / 2 - translate.y) * (newScale / scale)
    setScale(newScale)
    setTranslate(clampTranslate(newTx, newTy, newScale))
  }, [scale, translate, clampTranslate])

  const resetZoom = useCallback(() => {
    setScale(1)
    setTranslate({ x: 0, y: 0 })
  }, [])

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
        {/* Aerial photo — loaded from public/ as a URL string */}
        <img
          src="/orchard-aerial.png"
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
