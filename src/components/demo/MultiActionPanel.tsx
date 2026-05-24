// src/components/demo/MultiActionPanel.tsx
import { type ReactNode } from 'react'
import { X, Check, Droplets, Leaf, AlertTriangle } from 'lucide-react'
import { type Intervention, type Plant, PRIORITY_STYLE, plantLabel, STATUS_COLOR } from '../../data/demoData'

const TYPE_ICON: Record<Intervention['type'], ReactNode> = {
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
