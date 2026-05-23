import { useState } from 'react'
import { AlertTriangle, ChevronRight } from 'lucide-react'
import { COLS, trees, treeColor, activity } from '../data/platformData'
import { PlatformSidebar } from '../components/platform/Sidebar'
import { SapFlowChart } from '../components/platform/SapFlowChart'

export function Platform() {
  const [selectedTree, setSelectedTree] = useState<number | null>(62)

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', fontFamily: "'Inter Tight', sans-serif", background: '#F4EFE3' }}>
      <PlatformSidebar />

      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 32px', borderBottom: '1px solid #C9BEA6', background: '#F4EFE3', position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <h1 style={{ fontFamily: "'Instrument Serif', serif", fontSize: '22px', fontWeight: 400, color: '#0A1410', margin: 0 }}>Orchard overview</h1>
            <div style={{ fontSize: '13px', color: '#7A7363', marginTop: '2px' }}>Az. Agr. Greco · Ragusa · 8.3 ha</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'rgba(184,58,46,0.08)', border: '1px solid rgba(184,58,46,0.25)', borderRadius: '9999px', fontSize: '12px', color: '#B83A2E', fontWeight: 500 }}>
              <AlertTriangle size={12} /> 1 active alert
            </div>
            <div style={{ padding: '6px 12px', background: '#FAF6EC', border: '1px solid #C9BEA6', borderRadius: '9999px', fontSize: '12px', color: '#524C42', fontFamily: "'JetBrains Mono', monospace" }}>
              Last flight: today 06:47
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Alert card */}
          <div style={{ background: '#FAF6EC', border: '1px solid rgba(184,58,46,0.35)', borderLeft: '3px solid #B83A2E', borderRadius: '12px', padding: '20px 24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ width: '36px', height: '36px', background: 'rgba(184,58,46,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                <AlertTriangle size={18} style={{ color: '#B83A2E' }} strokeWidth={1.75} />
              </div>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#B83A2E', marginBottom: '6px' }}>
                  CRITICAL · Tree 47 · Block C
                </div>
                <div style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: '18px', color: '#0A1410', marginBottom: '6px' }}>
                  Possible Phytophthora cinnamomi root-zone signature detected
                </div>
                <div style={{ fontSize: '13px', color: '#524C42', lineHeight: 1.5 }}>
                  Cross-validated: multispectral anomaly + sap-flow stress below baseline threshold. 14 days before expected visual canopy symptoms.
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', color: '#7A7363', marginTop: '8px' }}>
                  Detected today 07:23 · Confidence: high
                </div>
              </div>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: '#0A1410', color: '#F4EFE3', fontSize: '13px', fontWeight: 500, borderRadius: '8px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: "'Inter Tight', sans-serif" }}>
              Contact agronomist <ChevronRight size={14} />
            </button>
          </div>

          {/* Tree map + Activity feed */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>

            {/* Tree map */}
            <div style={{ background: '#FAF6EC', border: '1px solid #C9BEA6', borderRadius: '12px', padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#0A1410' }}>Tree health map</div>
                  <div style={{ fontSize: '12px', color: '#7A7363', marginTop: '2px' }}>127 trees · Hass avocado · flight today 06:47</div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {[{ label: 'Healthy', color: '#3A7A4E' }, { label: 'Monitoring', color: '#D9882B' }, { label: 'Alert', color: '#B83A2E' }].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color }} />
                      <span style={{ fontSize: '11px', color: '#7A7363' }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: '6px', padding: '4px' }}>
                {trees.map(tree => {
                  const isAlert  = tree.status === 'alert'
                  const isEmpty  = tree.status === 'empty'
                  const isSelected = selectedTree === tree.id - 1
                  return (
                    <div key={tree.id} title={isEmpty ? undefined : `Tree ${tree.id}`}
                      onClick={() => !isEmpty && setSelectedTree(tree.id - 1)}
                      style={{ width: '100%', aspectRatio: '1', borderRadius: '50%', background: isEmpty ? 'transparent' : treeColor[tree.status], opacity: isEmpty ? 0 : (isSelected ? 1 : 0.75), cursor: isEmpty ? 'default' : 'pointer', transition: 'transform 120ms, opacity 120ms', transform: isSelected ? 'scale(1.35)' : 'scale(1)', outline: isSelected && !isEmpty ? '2px solid #D9882B' : 'none', outlineOffset: '2px', animation: isAlert ? 'pulse 2s ease-in-out infinite' : 'none', minWidth: '10px', minHeight: '10px' }}
                    />
                  )
                })}
              </div>
              <style>{`@keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(184,58,46,0.6); } 50% { box-shadow: 0 0 0 6px rgba(184,58,46,0); } }`}</style>
            </div>

            {/* Activity feed */}
            <div style={{ background: '#FAF6EC', border: '1px solid #C9BEA6', borderRadius: '12px', padding: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#0A1410', marginBottom: '20px' }}>Recent activity</div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {activity.map((item, i) => (
                  <div key={i} style={{ paddingBottom: i < activity.length - 1 ? '16px' : '0', marginBottom: i < activity.length - 1 ? '16px' : '0', borderBottom: i < activity.length - 1 ? '1px solid rgba(201,190,166,0.5)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: item.critical ? '#B83A2E' : '#0A1410' }}>{item.label}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#7A7363' }}>{item.time.split(' ')[0]}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#7A7363' }}>{item.detail}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#A99E85', marginTop: '2px' }}>{item.time.split(' ').slice(1).join(' ')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <SapFlowChart />
        </div>
      </main>
    </div>
  )
}
