import { AlertTriangle, Droplets, Leaf } from 'lucide-react'
import type { DiseaseRec, IrrigationRec, FertilizerRec } from '../../data/demoData'

export function DiseaseCard({ d }: { d: DiseaseRec }) {
  return (
    <div
      style={{
        background: 'rgba(184,58,46,0.04)',
        border: '1px solid rgba(184,58,46,0.18)',
        borderLeft: '3px solid #B83A2E',
        borderRadius: '4px',
        padding: '16px',
        marginBottom: '10px',
      }}
    >
      {/* Eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <AlertTriangle size={12} style={{ color: '#B83A2E', flexShrink: 0 }} strokeWidth={2} aria-hidden="true" />
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#B83A2E',
          }}
        >
          Disease detected
        </span>
      </div>

      {/* Disease name */}
      <div
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontStyle: 'italic',
          fontSize: '15px',
          color: '#191E1A',
          marginBottom: '12px',
          lineHeight: 1.3,
        }}
      >
        {d.name}
      </div>

      {/* Probability bar */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: '11px', color: '#7A7060' }}>
            Probability
          </span>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '12px',
              fontVariantNumeric: 'tabular-nums',
              color: '#B83A2E',
              fontWeight: 600,
            }}
          >
            {d.probability}%
          </span>
        </div>
        <div style={{ height: '4px', background: 'rgba(184,58,46,0.12)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${d.probability}%`, height: '100%', background: '#B83A2E', borderRadius: '2px' }} />
        </div>
      </div>

      {/* Meta */}
      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11px',
          color: '#7A7060',
          marginBottom: '2px',
        }}
      >
        Detected: {d.detectedAt}
        <span aria-hidden="true" style={{ color: '#BDB5A0' }}> · </span>
        <strong style={{ color: '#B83A2E' }}>{d.daysBeforeSymptoms} days before visible symptoms</strong>
      </div>

      {/* Action */}
      <div style={{ borderTop: '1px solid rgba(189,181,160,0.35)', marginTop: '10px', paddingTop: '10px' }}>
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: '#7A7060',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '5px',
          }}
        >
          Recommended action
        </div>
        <div
          style={{
            fontFamily: "'Barlow Semi Condensed', sans-serif",
            fontSize: '13px',
            color: '#191E1A',
            lineHeight: 1.55,
          }}
        >
          {d.action}
        </div>
      </div>

      {/* Agronomist notification */}
      <div style={{
        marginTop: '12px',
        padding: '8px 10px',
        background: 'rgba(84,99,87,0.06)',
        border: '1px solid rgba(84,99,87,0.18)',
        borderRadius: '4px',
        fontFamily: "'Barlow Semi Condensed', sans-serif",
        fontSize: '12px',
        color: '#7A7060',
        lineHeight: 1.5,
      }}>
        Alert sent to <strong style={{ color: '#546357' }}>Dr. M. Conti</strong> (agronomist) · 23 May 07:31
        <br />
        <span style={{ color: '#CC5427', cursor: 'pointer', textDecoration: 'underline' }}>
          Contact via TropiX →
        </span>
      </div>
    </div>
  )
}

export function IrrigationCard({ r }: { r: IrrigationRec }) {
  const stressed = r.sapFlowPct < 60
  const barColor = stressed ? '#B83A2E' : '#CC5427'

  return (
    <div
      style={{
        background: 'rgba(58,122,78,0.03)',
        border: '1px solid rgba(58,122,78,0.18)',
        borderLeft: '3px solid #3A7A4E',
        borderRadius: '4px',
        padding: '16px',
        marginBottom: '10px',
      }}
    >
      {/* Eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <Droplets size={12} style={{ color: '#3A7A4E', flexShrink: 0 }} strokeWidth={2} aria-hidden="true" />
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#3A7A4E',
          }}
        >
          Irrigation
        </span>
      </div>

      <div
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '14px',
          fontVariantNumeric: 'tabular-nums',
          color: '#191E1A',
          marginBottom: '6px',
        }}
      >
        {r.scheduledFor} · {r.duration}
      </div>

      <div
        style={{
          fontFamily: "'Barlow Semi Condensed', sans-serif",
          fontSize: '13px',
          color: '#7A7060',
          marginBottom: '10px',
          lineHeight: 1.5,
        }}
      >
        {r.reasoning}
      </div>

      {/* Sap-flow bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span
            title="Compared to 14-day average for this tree"
            style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: '11px', color: '#7A7060', cursor: 'help' }}
          >
            Sap-flow vs baseline
          </span>
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '12px',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 600,
              color: barColor,
            }}
          >
            {r.sapFlowPct}%
          </span>
        </div>
        <div style={{ height: '4px', background: 'rgba(189,181,160,0.35)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${r.sapFlowPct}%`, height: '100%', background: barColor, borderRadius: '2px' }} />
        </div>
      </div>
    </div>
  )
}

export function FertilizerCard({ f }: { f: FertilizerRec }) {
  return (
    <div
      style={{
        background: 'rgba(84,99,87,0.03)',
        border: '1px solid rgba(84,99,87,0.18)',
        borderLeft: '3px solid #546357',
        borderRadius: '4px',
        padding: '16px',
        marginBottom: '10px',
      }}
    >
      {/* Eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <Leaf size={12} style={{ color: '#546357', flexShrink: 0 }} strokeWidth={2} aria-hidden="true" />
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#546357',
          }}
        >
          Fertilizer
        </span>
      </div>

      {/* Data grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        {[
          { label: 'Deficiency', value: f.nutrient },
          { label: 'Dose',       value: f.dose     },
        ].map(item => (
          <div key={item.label}>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                color: '#7A7060',
                marginBottom: '3px',
              }}
            >
              {item.label}
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '12px',
                fontVariantNumeric: 'tabular-nums',
                color: '#191E1A',
                fontWeight: 600,
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px solid rgba(189,181,160,0.35)', paddingTop: '10px' }}>
        <div style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: '13px', color: '#7A7060' }}>
          {f.product}
        </div>
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px',
            color: '#BDB5A0',
            marginTop: '3px',
          }}
        >
          Scheduled: {f.scheduledFor}
        </div>
      </div>
    </div>
  )
}
