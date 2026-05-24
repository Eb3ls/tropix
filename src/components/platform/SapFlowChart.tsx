import { sapReadings } from '../../data/platformData'

const PADDING = { top: 28, right: 28, bottom: 40, left: 48 }
const VIEW_W  = 620
const VIEW_H  = 210

export function SapFlowChart() {
  const data   = sapReadings
  const chartW = VIEW_W - PADDING.left - PADDING.right
  const chartH = VIEW_H - PADDING.top  - PADDING.bottom

  const allVals = data.flatMap(d => [d.value, d.baseline])
  const minVal  = Math.floor(Math.min(...allVals) / 10) * 10 - 10
  const maxVal  = Math.ceil( Math.max(...allVals) / 10) * 10 + 10

  const toX = (i: number) => (i / (data.length - 1)) * chartW
  const toY = (v: number) => chartH - ((v - minVal) / (maxVal - minVal)) * chartH

  const linePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(d.value).toFixed(1)}`)
    .join(' ')

  const areaPath = [
    ...data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(d.value).toFixed(1)}`),
    `L ${toX(data.length - 1).toFixed(1)} ${chartH.toFixed(1)}`,
    `L 0 ${chartH.toFixed(1)}`,
    'Z',
  ].join(' ')

  const baselineY = toY(data[0].baseline)

  // Calculate 7-day trend delta
  const first = data[0].value
  const last  = data[data.length - 1].value
  const delta = last - first
  const deltaStr = delta > 0 ? `+${delta}` : `${delta}`

  // 4 evenly-spaced Y ticks
  const step = (maxVal - minVal) / 3
  const yTicks = [0, 1, 2, 3].map(i => Math.round(minVal + i * step))

  return (
    <div
      style={{
        background: '#F0EADB',
        border: '1px solid #BDB5A0',
        borderLeft: '2px solid #B83A2E',
        borderRadius: '4px',
        padding: '24px',
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          marginBottom: '16px',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          {/* Eyebrow */}
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#B83A2E',
              marginBottom: '4px',
            }}
          >
            SAP-FLOW · TREE 47 · BLOCK C
          </div>
          <div
            style={{
              fontFamily: "'Barlow Semi Condensed', sans-serif",
              fontSize: '13px',
              color: '#7A7060',
            }}
          >
            Last 7 days · ml/h · continuous sensor
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
          {/* Trend summary */}
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              color: '#B83A2E',
              background: 'rgba(184,58,46,0.06)',
              border: '1px solid rgba(184,58,46,0.18)',
              borderRadius: '9999px',
              padding: '3px 10px',
              whiteSpace: 'nowrap',
            }}
          >
            {deltaStr} ml/h over 7 days · ↓ below safe threshold
          </div>
          {/* Legend */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <svg width="20" height="10" aria-hidden="true">
                <line x1="0" y1="5" x2="20" y2="5" stroke="#BDB5A0" strokeWidth="1.5" strokeDasharray="4 4" />
              </svg>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#7A7060' }}>
                Baseline
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <svg width="20" height="10" aria-hidden="true">
                <circle cx="10" cy="5" r="3" fill="#F0EADB" stroke="#B83A2E" strokeWidth="1.5" />
              </svg>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#7A7060' }}>
                Actual
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SVG chart ── */}
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        style={{ width: '100%', display: 'block', overflow: 'visible' }}
        aria-label="Sap-flow chart — Tree 47, last 7 days in ml/h"
        role="img"
      >
        <g transform={`translate(${PADDING.left}, ${PADDING.top})`}>

          {/* Y-axis grid + labels */}
          {yTicks.map(tick => (
            <g key={tick}>
              <line
                x1={0} y1={toY(tick)}
                x2={chartW} y2={toY(tick)}
                stroke="#BDB5A0"
                strokeWidth="0.5"
                strokeDasharray="2 6"
              />
              <text
                x={-10}
                y={toY(tick) + 4}
                textAnchor="end"
                fontFamily="'IBM Plex Mono', monospace"
                fontSize="10"
                fill="#7A7060"
              >
                {tick}
              </text>
            </g>
          ))}

          {/* "Safe threshold" label on baseline */}
          <text
            x={chartW + 6}
            y={baselineY + 4}
            fontFamily="'IBM Plex Mono', monospace"
            fontSize="9"
            fill="#BDB5A0"
            textAnchor="start"
          >
            Safe
          </text>

          {/* Area fill under actual line */}
          <path d={areaPath} fill="rgba(184,58,46,0.06)" />

          {/* Baseline dashed */}
          <line
            x1={0} y1={baselineY}
            x2={chartW} y2={baselineY}
            stroke="#BDB5A0"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Actual line */}
          <path
            d={linePath}
            fill="none"
            stroke="#B83A2E"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Data points */}
          {data.map((d, i) => (
            <circle
              key={d.day + '-pt'}
              cx={toX(i)}
              cy={toY(d.value)}
              r="4.5"
              fill="#F0EADB"
              stroke="#B83A2E"
              strokeWidth="1.5"
            />
          ))}

          {/* Value label on last point */}
          <text
            x={toX(data.length - 1)}
            y={toY(last) - 10}
            textAnchor="middle"
            fontFamily="'IBM Plex Mono', monospace"
            fontSize="11"
            fill="#B83A2E"
            fontWeight="600"
          >
            {last}
          </text>

          {/* X-axis labels */}
          {data.map((d, i) => (
            <text
              key={d.day + '-x'}
              x={toX(i)}
              y={chartH + 24}
              textAnchor="middle"
              fontFamily="'IBM Plex Mono', monospace"
              fontSize="10"
              fill={i === data.length - 1 ? '#B83A2E' : '#7A7060'}
              fontWeight={i === data.length - 1 ? '600' : '400'}
            >
              {d.day}
            </text>
          ))}
        </g>
      </svg>

      {/* ── Bottom summary strip ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1px',
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #BDB5A0',
        }}
      >
        {[
          { label: 'Current',  value: `${last} ml/h`,  sub: 'Today',       alert: true  },
          { label: 'Baseline', value: `${data[0].baseline} ml/h`, sub: 'Healthy avg', alert: false },
          { label: 'Deficit',  value: `−${data[0].baseline - last} ml/h`, sub: 'Gap from safe', alert: true  },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center', padding: '8px 0' }}>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#7A7060', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
              {s.label}
            </div>
            <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '18px', fontVariantNumeric: 'tabular-nums', color: s.alert ? '#B83A2E' : '#191E1A', lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: '11px', color: '#7A7060', marginTop: '2px' }}>
              {s.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
