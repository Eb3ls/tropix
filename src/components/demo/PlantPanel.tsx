import { X, Leaf } from 'lucide-react'
import type { Plant } from '../../data/demoData'
import { plantLabel } from '../../data/demoData'
import { DiseaseCard, IrrigationCard, FertilizerCard } from './DemoCards'

interface Props {
  plant: Plant
  onClose: () => void
}

export function PlantPanel({ plant, onClose }: Props) {
  return (
    <div style={{ width: '356px', height: '100%', overflowY: 'auto', background: '#FAF6EC', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '18px 18px 14px', borderBottom: '1px solid #C9BEA6', background: '#F4EFE3', position: 'sticky', top: 0, zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '18px', fontWeight: 700, color: '#0A1410', lineHeight: 1, marginBottom: '4px' }}>
              Albero {plantLabel(plant)}
            </div>
            <div style={{ fontSize: '12px', color: '#7A7363' }}>Zona {plant.zone}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
            <span style={{
              padding: '3px 10px', borderRadius: '9999px',
              fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
              background: plant.status === 'alert' ? 'rgba(184,58,46,0.09)' :
                          plant.status === 'monitoring' ? 'rgba(217,136,43,0.09)' : 'rgba(58,122,78,0.09)',
              border: `1px solid ${plant.status === 'alert' ? 'rgba(184,58,46,0.28)' :
                                    plant.status === 'monitoring' ? 'rgba(217,136,43,0.28)' : 'rgba(58,122,78,0.28)'}`,
              color: plant.status === 'alert' ? '#B83A2E' : plant.status === 'monitoring' ? '#A86415' : '#3A7A4E',
            }}>
              {plant.status === 'alert' ? 'Alert' : plant.status === 'monitoring' ? 'Monitoraggio' : 'Sano'}
            </span>
            <button onClick={onClose} style={{ width: '26px', height: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: '1px solid #C9BEA6', borderRadius: '6px', cursor: 'pointer', color: '#7A7363' }}>
              <X size={13} />
            </button>
          </div>
        </div>
        <div style={{ fontSize: '11px', color: '#A99E85', fontStyle: 'italic', fontFamily: "'Instrument Serif', serif" }}>
          {plant.cultivar}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: '16px 18px' }}>
        {plant.status === 'healthy' ? (
          <div style={{ textAlign: 'center', padding: '36px 16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', margin: '0 auto 12px', background: 'rgba(58,122,78,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={20} style={{ color: '#3A7A4E' }} strokeWidth={1.5} />
            </div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: '#0A1410', marginBottom: '8px' }}>Nessuna anomalia rilevata</div>
            <div style={{ fontSize: '12px', color: '#7A7363', lineHeight: 1.7 }}>
              Parametri nella norma.<br />
              Ultimo volo drone: oggi 06:47<br />
              Sap-flow: in range baseline<br />
              NDVI: ottimale
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

      {/* Budget widget */}
      <div style={{ padding: '14px 18px', borderTop: '1px solid #C9BEA6', background: '#F4EFE3', flexShrink: 0 }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#524C42', marginBottom: '10px' }}>
          Budget fertilizzanti · stagione 2026
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '5px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', color: '#0A1410', fontWeight: 700 }}>
            €720{' '}<span style={{ fontWeight: 400, color: '#7A7363', fontSize: '12px' }}>/ €1.100</span>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 600, color: '#D9882B' }}>65%</span>
        </div>
        <div style={{ height: '3px', background: 'rgba(201,190,166,0.35)', borderRadius: '2px', overflow: 'hidden', marginBottom: '6px' }}>
          <div style={{ width: '65%', height: '100%', background: '#D9882B', borderRadius: '2px' }} />
        </div>
        <div style={{ fontSize: '11px', color: '#A99E85' }}>
          Proiezione AI fine stagione:{' '}
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#7A7363' }}>€1.050</span>
        </div>
      </div>
    </div>
  )
}
