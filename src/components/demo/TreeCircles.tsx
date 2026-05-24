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
