// src/components/demo/TreeCircles.tsx
//
// CSS-div markers — border-radius:50% guarantees perfect circles.
// Sizes derived from mapHeight so markers maintain consistent visual proportion
// regardless of viewport size.
import { type CSSProperties } from 'react'
import { type Plant, STATUS_COLOR, plantLabel } from '../../data/demoData'

// Size ratios relative to map container height.
// At mapHeight=640: ring=26px, alert dot=12px, healthy dot=7px — good proportions.
const RING_RATIO = 0.040          // outer ring diameter
const DOT_RATIO = {
  alert:      0.019,
  monitoring: 0.015,
  healthy:    0.013,   // slightly larger — needs to pop against green aerial foliage
}
const RING_STROKE_RATIO = 0.0023  // ring border width
const HIT_RATIO         = 0.068   // invisible click target

const TREATED_COLOR = '#B8860B'

interface Props {
  plants:         Plant[]
  selectedId:     number | null
  highlightedIds: Set<number>
  treatedIds:     Set<number>
  zoom:           number
  /** Map container height in px — sizes are derived as ratios of this value. */
  mapHeight:      number
  /** When true, shows tree ID + cx/cy on each marker for position calibration. */
  showDebug?:     boolean
  onTreeClick:    (plant: Plant) => void
}

const pulse: CSSProperties = { animation: 'markerRingPulse 2.4s ease-in-out infinite' }

export function TreeCircles({
  plants, selectedId, highlightedIds, treatedIds, zoom, mapHeight, showDebug = false, onTreeClick,
}: Props) {
  // s counteracts parent CSS transform:scale(zoom) → constant screen size at all zoom levels
  const s = 1 / zoom

  // Derive all sizes from mapHeight (proportional) × s (zoom compensation)
  const ringD   = mapHeight * RING_RATIO   * s
  const hitD    = mapHeight * HIT_RATIO    * s
  const strokeW = mapHeight * RING_STROKE_RATIO * s
  const dotD    = {
    alert:      mapHeight * DOT_RATIO.alert      * s,
    monitoring: mapHeight * DOT_RATIO.monitoring * s,
    healthy:    mapHeight * DOT_RATIO.healthy     * s,
  }

  return (
    <>
      <style>{`
        @keyframes markerRingPulse {
          0%, 100% { opacity: 0.9; }
          50%       { opacity: 0.15; }
        }
      `}</style>

      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {plants.map(plant => {
          const { cx, cy } = plant.coords
          const isSelected    = plant.gridIndex === selectedId
          const isHighlighted = highlightedIds.has(plant.gridIndex)
          const isTreated     = treatedIds.has(plant.gridIndex)

          // ── Dot ──────────────────────────────────────────────────────────
          const statusKey  = plant.status as keyof typeof dotD
          const thisDotD   = isTreated ? dotD.monitoring : (dotD[statusKey] ?? dotD.healthy)
          const dotColor   = isTreated ? TREATED_COLOR : STATUS_COLOR[plant.status]
          const dotOpacity = isSelected || isHighlighted ? 1
            : isTreated                     ? 0.65
            : plant.status === 'alert'      ? 0.95
            : plant.status === 'monitoring' ? 0.78
            : 0.82   // healthy — raised from 0.40 to pop against aerial foliage

          // ── Ring ─────────────────────────────────────────────────────────
          const ringColor   = isSelected || isHighlighted ? '#E8E1CF' : STATUS_COLOR[plant.status]
          const ringOpacity = isSelected || isHighlighted ? 1
            : plant.status === 'alert'      ? 0.92
            : plant.status === 'monitoring' ? 0.65
            : 0.72   // healthy — raised from 0.44
          const thisStroke  = isSelected || isHighlighted ? strokeW * 1.4 : strokeW
          const isPulsing   = plant.status === 'alert' && !isTreated && !isSelected && !isHighlighted

          const label   = plantLabel(plant)
          const tooltip = `${label} · ${isTreated ? 'Treated — awaiting confirmation' : plant.status}${
            plant.disease ? ` · ${plant.disease.name} ${plant.disease.probability}%` : ''
          }`

          return (
            <div
              key={plant.id}
              role="button"
              tabIndex={0}
              aria-label={tooltip}
              title={tooltip}
              onClick={() => onTreeClick(plant)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onTreeClick(plant) }
              }}
              style={{
                position:   'absolute',
                left:       `${cx}%`,
                top:        `${cy}%`,
                width:      `${hitD}px`,
                height:     `${hitD}px`,
                transform:  'translate(-50%, -50%)',
                display:    'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor:         'pointer',
                pointerEvents:  'auto',
              }}
            >
              {/* Ring — visible on all trees */}
              <div
                aria-hidden="true"
                style={{
                  position:     'absolute',
                  width:        `${ringD}px`,
                  height:       `${ringD}px`,
                  borderRadius: '50%',
                  border:       `${thisStroke}px solid ${ringColor}`,
                  opacity:       ringOpacity,
                  boxSizing:    'border-box',
                  ...(isPulsing ? pulse : {}),
                }}
              />

              {/* Center dot */}
              <div
                aria-hidden="true"
                style={{
                  width:           `${thisDotD}px`,
                  height:          `${thisDotD}px`,
                  borderRadius:    '50%',
                  backgroundColor: dotColor,
                  opacity:         dotOpacity,
                  flexShrink:      0,
                }}
              />

              {/* Multi-condition badge ×N */}
              {plant.conditionCount > 1 && (
                <span
                  aria-hidden="true"
                  style={{
                    position:   'absolute',
                    top:        `${-3 * s}px`,
                    right:      `${-1 * s}px`,
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize:   `${mapHeight * 0.012 * s}px`,
                    color:       ringColor,
                    lineHeight:  1,
                    pointerEvents: 'none',
                  }}
                >
                  ×{plant.conditionCount}
                </span>
              )}

              {/* Debug label — tree ID + coords, shown only when showDebug=true */}
              {showDebug && (
                <div
                  aria-hidden="true"
                  style={{
                    position:    'absolute',
                    top:         `${(ringD / 2 + 3 * s)}px`,
                    left:        '50%',
                    transform:   'translateX(-50%)',
                    background:  'rgba(0,0,0,0.82)',
                    color:       '#FFE600',
                    fontFamily:  "'IBM Plex Mono', monospace",
                    fontSize:    `${9 * s}px`,
                    padding:     `${1.5 * s}px ${3 * s}px`,
                    borderRadius:`${2 * s}px`,
                    whiteSpace:  'nowrap',
                    pointerEvents: 'none',
                    lineHeight:   1.4,
                    textAlign:   'center',
                  }}
                >
                  {label}<br />
                  <span style={{ opacity: 0.75 }}>{cx} / {cy}</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
