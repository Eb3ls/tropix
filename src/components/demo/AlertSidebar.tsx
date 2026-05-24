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
  const alertPlants    = plants.filter(p => p.status !== 'healthy')
  const healthyCount   = plants.filter(p => p.status === 'healthy').length
  const alertCount     = alertPlants.filter(p => p.status === 'alert').length
  const pendingActions = interventions.filter(i => !i.done)

  return (
    <div style={{
      width: '220px',
      flexShrink: 0,
      background: '#F0EADB',
      borderRight: '1px solid #BDB5A0',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      overflowX: 'hidden',
    }}>

      {/* ── Farm health chip ── */}
      <div style={{
        padding: '14px 16px 10px',
        borderBottom: '1px solid #BDB5A0',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3A7A4E', display: 'inline-block' }} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#7A7060', fontVariantNumeric: 'tabular-nums' }}>
            {healthyCount} healthy
          </span>
        </span>
        <span style={{ color: '#BDB5A0', fontSize: '10px' }}>·</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#B83A2E', display: 'inline-block' }} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: '#7A7060', fontVariantNumeric: 'tabular-nums' }}>
            {alertCount} alerts
          </span>
        </span>
      </div>

      {/* ── Weather strip ── */}
      <div style={{ borderBottom: '1px solid #BDB5A0' }}>
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
                background: isSelected ? 'rgba(25,30,26,0.06)' : 'transparent',
                border: 'none',
                borderLeft: `2px solid ${isTreated ? '#B8860B' : STATUS_COLOR[plant.status]}`,
                cursor: 'pointer',
                transition: 'background 150ms',
              }}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'rgba(25,30,26,0.04)' }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent' }}
            >
              {/* Tree label + overdue */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <span style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#191E1A',
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
                  color: '#7A7060',
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
                  color: '#CC5427',
                }}>
                  {daysEarly}d before symptoms
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Action list ── */}
      <div style={{ padding: '12px 0 16px', borderTop: '1px solid #BDB5A0' }}>
        <div style={{
          padding: '0 16px 8px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#BDB5A0',
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
                background: isHighlighted ? 'rgba(25,30,26,0.06)' : 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 150ms',
              }}
              onMouseEnter={e => { if (!isHighlighted) e.currentTarget.style.background = 'rgba(25,30,26,0.04)' }}
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
                  color: '#191E1A',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {item.title}
                </div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px',
                  color: '#7A7060',
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
