import { Droplets, Wind, Wifi } from 'lucide-react'
import { sapReadings } from '../../data/platformData'

export function SapFlowChart() {
  return (
    <div style={{ background: '#FAF6EC', border: '1px solid #C9BEA6', borderRadius: '12px', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 500, color: '#0A1410' }}>Sap-flow · Tree 47 · Last 7 days</div>
          <div style={{ fontSize: '12px', color: '#7A7363', marginTop: '2px' }}>Continuous sensor · Block C · Hass avocado</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '20px', height: '2px', background: '#C9BEA6', borderStyle: 'dashed', borderWidth: '0 0 1px', borderColor: '#A99E85' }} />
            <span style={{ fontSize: '11px', color: '#7A7363' }}>Baseline</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#B83A2E' }} />
            <span style={{ fontSize: '11px', color: '#7A7363' }}>Current</span>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '80px' }}>
        {sapReadings.map((r, i) => {
          const isLast = i === sapReadings.length - 1
          const pct = (r.value / 100) * 100
          const basePct = (r.baseline / 100) * 100
          const isBelowBase = r.value < r.baseline
          return (
            <div key={r.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ width: '100%', height: '64px', position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: `${basePct * 0.64}px`, borderTop: '1px dashed #A99E85', zIndex: 2 }} />
                <div style={{
                  width: '100%', height: `${pct * 0.64}px`,
                  background: isBelowBase ? (isLast ? '#B83A2E' : 'rgba(184,58,46,0.5)') : 'rgba(58,122,78,0.5)',
                  borderRadius: '3px 3px 0 0',
                  transition: 'height 400ms cubic-bezier(0.2,0.7,0.2,1)',
                }} />
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', color: isLast ? '#B83A2E' : '#7A7363', fontWeight: isLast ? 600 : 400 }}>
                {r.day}
              </div>
            </div>
          )
        })}
      </div>

      {/* Sensor readings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(201,190,166,0.5)' }}>
        {[
          { icon: Droplets, label: 'Sap-flow today', value: '47 %', sub: 'of baseline',    alert: true  },
          { icon: Wind,     label: 'Soil moisture',  value: '18 %', sub: 'vol · sensor A', alert: false },
          { icon: Wifi,     label: 'Sensor status',  value: 'Online', sub: 'last sync 07:23', alert: false },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '12px', background: s.alert ? 'rgba(184,58,46,0.05)' : '#F4EFE3', borderRadius: '8px', border: s.alert ? '1px solid rgba(184,58,46,0.2)' : '1px solid #C9BEA6' }}>
              <Icon size={16} style={{ color: s.alert ? '#B83A2E' : '#7A7363', marginTop: '2px', flexShrink: 0 }} strokeWidth={1.5} />
              <div>
                <div style={{ fontSize: '11px', color: '#7A7363', marginBottom: '3px' }}>{s.label}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '16px', color: s.alert ? '#B83A2E' : '#0A1410', fontWeight: 500, lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '11px', color: '#A99E85', marginTop: '2px' }}>{s.sub}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
