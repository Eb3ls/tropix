import { AlertTriangle, Droplets, Leaf, ChevronRight } from 'lucide-react'
import type { DiseaseRec, IrrigationRec, FertilizerRec } from '../../data/demoData'

export function DiseaseCard({ d }: { d: DiseaseRec }) {
  return (
    <div style={{
      background: 'rgba(184,58,46,0.04)', border: '1px solid rgba(184,58,46,0.18)',
      borderLeft: '3px solid #B83A2E', borderRadius: '8px', padding: '16px', marginBottom: '10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <AlertTriangle size={13} style={{ color: '#B83A2E', flexShrink: 0 }} strokeWidth={2} />
        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#B83A2E' }}>
          Malattia rilevata
        </span>
      </div>
      <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: '15px', color: '#0A1410', marginBottom: '10px', lineHeight: 1.3 }}>
        {d.name}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '11px', color: '#7A7363' }}>Probabilità</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#B83A2E', fontWeight: 700 }}>
            {d.probability}%
          </span>
        </div>
        <div style={{ height: '3px', background: 'rgba(184,58,46,0.12)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${d.probability}%`, height: '100%', background: '#B83A2E', borderRadius: '2px' }} />
        </div>
      </div>
      <div style={{ fontSize: '11px', color: '#524C42', marginBottom: '2px' }}>
        Rilevata:{' '}
        <span style={{ fontFamily: "'JetBrains Mono', monospace" }}>{d.detectedAt}</span>
        {' '}·{' '}
        <strong>{d.daysBeforeSymptoms} giorni prima dei sintomi visibili</strong>
      </div>
      <div style={{ borderTop: '1px solid rgba(201,190,166,0.35)', marginTop: '10px', paddingTop: '10px' }}>
        <div style={{ fontSize: '10px', color: '#7A7363', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>
          Azione raccomandata
        </div>
        <div style={{ fontSize: '12px', color: '#0A1410', lineHeight: 1.55 }}>{d.action}</div>
      </div>
      <button style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        marginTop: '12px', width: '100%', padding: '8px 12px',
        background: '#0A1410', color: '#F4EFE3', fontSize: '12px', fontWeight: 500,
        borderRadius: '6px', border: 'none', cursor: 'pointer', fontFamily: "'Inter Tight', sans-serif",
      }}>
        Contatta agronomo <ChevronRight size={12} />
      </button>
    </div>
  )
}

export function IrrigationCard({ r }: { r: IrrigationRec }) {
  const stressed = r.sapFlowPct < 60
  return (
    <div style={{
      background: 'rgba(47,74,61,0.04)', border: '1px solid rgba(47,74,61,0.16)',
      borderLeft: '3px solid #2F4A3D', borderRadius: '8px', padding: '16px', marginBottom: '10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <Droplets size={13} style={{ color: '#2F4A3D', flexShrink: 0 }} strokeWidth={2} />
        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#2F4A3D' }}>
          Irrigazione
        </span>
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: '#0A1410', marginBottom: '6px' }}>
        {r.scheduledFor} · {r.duration}
      </div>
      <div style={{ fontSize: '12px', color: '#524C42', marginBottom: '10px', lineHeight: 1.5 }}>{r.reasoning}</div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '11px', color: '#7A7363' }}>Sap-flow vs baseline</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 700, color: stressed ? '#B83A2E' : '#D9882B' }}>
            {r.sapFlowPct}%
          </span>
        </div>
        <div style={{ height: '3px', background: 'rgba(201,190,166,0.35)', borderRadius: '2px', overflow: 'hidden' }}>
          <div style={{ width: `${r.sapFlowPct}%`, height: '100%', background: stressed ? '#B83A2E' : '#D9882B', borderRadius: '2px' }} />
        </div>
      </div>
    </div>
  )
}

export function FertilizerCard({ f }: { f: FertilizerRec }) {
  return (
    <div style={{
      background: 'rgba(70,101,88,0.04)', border: '1px solid rgba(70,101,88,0.16)',
      borderLeft: '3px solid #466558', borderRadius: '8px', padding: '16px', marginBottom: '10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
        <Leaf size={13} style={{ color: '#466558', flexShrink: 0 }} strokeWidth={2} />
        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#466558' }}>
          Fertilizzante
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        {[
          { label: 'Carenza', value: f.nutrient },
          { label: 'Dose', value: f.dose },
        ].map(item => (
          <div key={item.label}>
            <div style={{ fontSize: '10px', color: '#7A7363', marginBottom: '3px' }}>{item.label}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#0A1410', fontWeight: 600 }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid rgba(201,190,166,0.35)', paddingTop: '10px' }}>
        <div style={{ fontSize: '12px', color: '#524C42' }}>{f.product}</div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#7A7363', marginTop: '3px' }}>
          Pianificato: {f.scheduledFor}
        </div>
      </div>
    </div>
  )
}
