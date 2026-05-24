import { X, Leaf } from 'lucide-react'
import type { Plant } from '../../data/demoData'
import { plantLabel, ZONE_LABEL } from '../../data/demoData'
import { DiseaseCard, IrrigationCard, FertilizerCard } from './DemoCards'

interface Props {
  plant: Plant
  onClose: () => void
}

export function PlantPanel({ plant, onClose }: Props) {
  const statusLabel = plant.status === 'alert' ? 'Alert' : plant.status === 'monitoring' ? 'Monitoring' : 'Healthy'
  const statusColors = {
    alert:      { bg: 'rgba(184,58,46,0.08)', border: 'rgba(184,58,46,0.28)', text: '#B83A2E' },
    monitoring: { bg: 'rgba(204,84,39,0.08)', border: 'rgba(204,84,39,0.28)', text: '#CC5427' },
    healthy:    { bg: 'rgba(58,122,78,0.08)',  border: 'rgba(58,122,78,0.28)', text: '#3A7A4E' },
  }
  const sc = statusColors[plant.status]

  return (
    <div
      style={{
        width: '356px',
        height: '100%',
        overflowY: 'auto',
        background: '#F0EADB',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Sticky header ── */}
      <div
        style={{
          padding: '16px 18px 14px',
          borderBottom: '1px solid #BDB5A0',
          background: '#E8E1CF',
          position: 'sticky',
          top: 0,
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: '6px',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '18px',
                fontVariantNumeric: 'tabular-nums',
                fontWeight: 700,
                color: '#191E1A',
                lineHeight: 1,
                marginBottom: '4px',
              }}
            >
              Tree {plantLabel(plant)}
            </div>
            <div
              style={{
                fontFamily: "'Barlow Semi Condensed', sans-serif",
                fontSize: '12px',
                color: '#7A7060',
              }}
            >
              Zone {ZONE_LABEL[plant.zone]}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
            {/* Status chip */}
            <span
              style={{
                padding: '3px 10px',
                borderRadius: '9999px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                background: sc.bg,
                border: `1px solid ${sc.border}`,
                color: sc.text,
              }}
            >
              {statusLabel}
            </span>
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Close tree panel"
              style={{
                width: '26px',
                height: '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: '1px solid #BDB5A0',
                borderRadius: '4px',
                cursor: 'pointer',
                color: '#7A7060',
                transition: 'background 150ms, color 150ms',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#191E1A'
                e.currentTarget.style.color = '#E8E1CF'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#7A7060'
              }}
            >
              <X size={13} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Cultivar (italic) */}
        <div
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontStyle: 'italic',
            fontSize: '12px',
            color: '#7A7060',
          }}
        >
          <em>{plant.cultivar}</em>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ flex: 1, padding: '16px 18px' }}>
        {plant.status === 'healthy' ? (
          <div style={{ textAlign: 'center', padding: '36px 16px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                margin: '0 auto 12px',
                background: 'rgba(58,122,78,0.10)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Leaf size={20} style={{ color: '#3A7A4E' }} strokeWidth={1.5} aria-hidden="true" />
            </div>
            <div
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: '16px',
                color: '#191E1A',
                marginBottom: '10px',
              }}
            >
              No anomalies detected
            </div>
            <div
              style={{
                fontFamily: "'Barlow Semi Condensed', sans-serif",
                fontSize: '13px',
                color: '#7A7060',
                lineHeight: 1.7,
              }}
            >
              All parameters within normal range.<br />
              Last drone flight: today 06:47<br />
              Sap-flow: within baseline<br />
              NDVI: optimal
            </div>
          </div>
        ) : (
          <>
            {plant.disease    && <DiseaseCard    d={plant.disease}    />}
            {plant.irrigation && <IrrigationCard r={plant.irrigation} />}
            {plant.fertilizer && <FertilizerCard f={plant.fertilizer} />}
          </>
        )}
      </div>

      {/* ── Budget widget ── */}
      <div
        style={{
          padding: '14px 18px',
          borderTop: '1px solid #BDB5A0',
          background: '#E8E1CF',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#7A7060',
            marginBottom: '10px',
          }}
        >
          Fertilizer budget · 2026 season
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '5px',
          }}
        >
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '14px',
              fontVariantNumeric: 'tabular-nums',
              color: '#191E1A',
              fontWeight: 700,
            }}
          >
            €720{' '}
            <span style={{ fontWeight: 400, color: '#7A7060', fontSize: '12px' }}>/ €1,100</span>
          </div>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '12px',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 600,
              color: '#CC5427',
            }}
          >
            65%
          </span>
        </div>
        {/* Budget bar */}
        <div
          style={{
            height: '4px',
            background: 'rgba(189,181,160,0.35)',
            borderRadius: '2px',
            overflow: 'hidden',
            marginBottom: '6px',
          }}
        >
          <div style={{ width: '65%', height: '100%', background: '#CC5427', borderRadius: '2px' }} />
        </div>
        <div
          style={{
            fontFamily: "'Barlow Semi Condensed', sans-serif",
            fontSize: '11px',
            color: '#BDB5A0',
          }}
        >
          AI end-of-season forecast:{' '}
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#7A7060', fontVariantNumeric: 'tabular-nums' }}>
            €1,050
          </span>
        </div>
      </div>
    </div>
  )
}
