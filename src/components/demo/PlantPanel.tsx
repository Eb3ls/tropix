import { X, Leaf } from 'lucide-react'
import type { Plant } from '../../data/demoData'
import { plantLabel, ZONE_LABEL } from '../../data/demoData'
import { DiseaseCard, IrrigationCard, FertilizerCard } from './DemoCards'

interface Props {
  plant: Plant
  onClose: () => void
  treated: boolean
  overdue: boolean
  onMarkTreated: () => void
}

export function PlantPanel({ plant, onClose, treated, overdue, onMarkTreated }: Props) {
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

        {/* OVERDUE warning */}
        {overdue && !treated && (
          <div style={{
            marginTop: '8px',
            padding: '5px 10px',
            background: 'rgba(184,58,46,0.08)',
            border: '1px solid rgba(184,58,46,0.25)',
            borderRadius: '4px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: '#B83A2E',
            letterSpacing: '0.07em',
          }}>
            OVERDUE · 24h since detection · act immediately
          </div>
        )}

        {/* Treated confirmation */}
        {treated && (
          <div style={{
            marginTop: '8px',
            padding: '5px 10px',
            background: 'rgba(184,134,11,0.08)',
            border: '1px solid rgba(184,134,11,0.25)',
            borderRadius: '4px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: '#B8860B',
            letterSpacing: '0.06em',
          }}>
            Treatment recorded · System monitoring for recovery
            <span style={{ display: 'inline-block', marginLeft: '6px', animation: 'treePulse 2s ease-in-out infinite' }}>●</span>
          </div>
        )}
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

      {/* ── Mark treated footer (only for non-healthy, non-treated plants) ── */}
      {plant.status !== 'healthy' && !treated && (
        <div style={{
          padding: '14px 18px',
          borderTop: '1px solid #BDB5A0',
          background: '#E8E1CF',
          flexShrink: 0,
        }}>
          <button
            onClick={onMarkTreated}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '6px', width: '100%', padding: '9px 12px',
              background: 'transparent', border: '1px solid #BDB5A0',
              borderRadius: '4px', cursor: 'pointer',
              fontFamily: "'Barlow Semi Condensed', sans-serif",
              fontSize: '13px', fontWeight: 500, color: '#7A7060',
              transition: 'all 180ms',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(58,122,78,0.07)'; e.currentTarget.style.borderColor = 'rgba(58,122,78,0.25)'; e.currentTarget.style.color = '#3A7A4E' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#BDB5A0'; e.currentTarget.style.color = '#7A7060' }}
          >
            ✓ Mark treatment done
          </button>
        </div>
      )}
    </div>
  )
}
