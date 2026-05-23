import { useState, useMemo } from 'react'
import { ArrowLeft, ChevronRight, Check } from 'lucide-react'
import {
  ALL_PLANTS, INITIAL_INTERVENTIONS, CULTIVARS, STATUS_COLOR, PRIORITY_STYLE, plantLabel,
  type Plant, type Tab, type Priority, type Zone, type Intervention,
} from '../data/demoData'
import { PlantPanel } from '../components/demo/PlantPanel'

export function Demo() {
  const [activeTab, setActiveTab]           = useState<Tab>('all')
  const [selectedPlant, setSelectedPlant]   = useState<Plant | null>(null)
  const [interventions, setInterventions]   = useState<Intervention[]>(INITIAL_INTERVENTIONS)

  const alertCount      = ALL_PLANTS.filter(p => p.status === 'alert').length
  const monitoringCount = ALL_PLANTS.filter(p => p.status === 'monitoring').length
  const urgentCount     = interventions.filter(i => (i.priority === 'urgent' || i.priority === 'high') && !i.done).length
  const atRiskPlants    = useMemo(() => ALL_PLANTS.filter(p => p.status !== 'healthy'), [])
  const zones: Zone[]   = ['Nord', 'Centro', 'Sud']

  const sortedInterventions = useMemo(() => {
    const order: Priority[] = ['urgent', 'high', 'medium', 'low']
    return [...interventions].sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1
      return order.indexOf(a.priority) - order.indexOf(b.priority)
    })
  }, [interventions])

  function handleTabClick(tab: Tab) { setActiveTab(tab); setSelectedPlant(null) }
  function toggleDone(id: string) { setInterventions(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i)) }
  function handlePlantClick(plant: Plant) { setSelectedPlant(prev => prev?.id === plant.id ? null : plant) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', fontFamily: "'Inter Tight', sans-serif", background: '#F4EFE3' }}>

      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', height: '56px', flexShrink: 0, background: '#0A1410', borderBottom: '1px solid rgba(244,239,227,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ fontFamily: "'Instrument Serif', serif", fontSize: '22px', color: '#F4EFE3', fontWeight: 400 }}>
            Trop<em style={{ color: '#D9882B', fontStyle: 'italic' }}>X</em>
          </span>
          <div style={{ width: '1px', height: '20px', background: 'rgba(244,239,227,0.1)' }} />
          <span style={{ fontSize: '13px', color: 'rgba(244,239,227,0.45)' }}>Az. Agr. Greco · Ragusa, Sicilia · 8.3 ha</span>
          <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.09em', fontFamily: "'JetBrains Mono', monospace", background: 'rgba(217,136,43,0.15)', border: '1px solid rgba(217,136,43,0.3)', color: '#F0C381' }}>
            DEMO
          </span>
        </div>
        <a
          href="#"
          onClick={e => { e.preventDefault(); window.location.hash = ''; window.dispatchEvent(new HashChangeEvent('hashchange')) }}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'rgba(244,239,227,0.38)', textDecoration: 'none', transition: 'color 200ms cubic-bezier(0.2,0.7,0.2,1)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(244,239,227,0.7)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(244,239,227,0.38)')}
        >
          <ArrowLeft size={14} /> Torna al sito
        </a>
      </header>

      {/* Stats strip */}
      <div style={{ display: 'flex', alignItems: 'stretch', flexShrink: 0, borderBottom: '1px solid #C9BEA6', background: '#FAF6EC' }}>
        {[
          { label: 'PIANTE MONITORATE', value: '120',                  sub: 'Hass · Fuerte · Tommy Atkins' },
          { label: 'ALERT ATTIVI',       value: String(alertCount),      sub: 'Phytophthora · Colletotrichum', accent: '#B83A2E' },
          { label: 'IN MONITORAGGIO',    value: String(monitoringCount), sub: 'irrigazione · fertilizzanti',   accent: '#D9882B' },
          { label: 'INTERVENTI URGENTI', value: String(urgentCount),     sub: 'da eseguire oggi o domani',     accent: '#A86415' },
        ].map((s, i) => (
          <div key={s.label} style={{ padding: '14px 28px', borderLeft: i > 0 ? '1px solid #C9BEA6' : 'none', minWidth: '160px' }}>
            <div style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#7A7363', marginBottom: '5px' }}>{s.label}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '22px', fontWeight: 600, lineHeight: 1, color: s.accent ?? '#0A1410', marginBottom: '3px' }}>{s.value}</div>
            <div style={{ fontSize: '11px', color: '#A99E85' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, padding: '0 32px', borderBottom: '1px solid #C9BEA6', background: '#F4EFE3' }}>
        {([
          { id: 'all',           label: 'Tutte le piante' },
          { id: 'risk',          label: 'Piante a rischio',      count: alertCount + monitoringCount },
          { id: 'interventions', label: 'Interventi pianificati', count: interventions.filter(i => !i.done).length },
        ] as const).map(tab => (
          <button key={tab.id} onClick={() => handleTabClick(tab.id)} style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '14px 16px', background: 'none', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #D9882B' : '2px solid transparent', fontSize: '13px', fontWeight: activeTab === tab.id ? 500 : 400, color: activeTab === tab.id ? '#0A1410' : '#7A7363', cursor: 'pointer', fontFamily: "'Inter Tight', sans-serif", marginBottom: '-1px', transition: 'color 180ms' }}>
            {tab.label}
            {'count' in tab && tab.count > 0 && (
              <span style={{ padding: '1px 7px', borderRadius: '9999px', fontSize: '10px', fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", background: activeTab === tab.id ? '#D9882B' : 'rgba(201,190,166,0.45)', color: activeTab === tab.id ? '#F4EFE3' : '#524C42' }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>

          {/* Tab: Tutte le piante */}
          {activeTab === 'all' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {zones.map(zone => {
                const zonePlants = ALL_PLANTS.filter(p => p.zone === zone)
                return (
                  <div key={zone}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#524C42' }}>Zona {zone}</span>
                      <div style={{ flex: 1, height: '1px', background: '#C9BEA6' }} />
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#A99E85' }}>
                        {CULTIVARS[zone].split(' — ')[1]} · {zonePlants.length} piante
                      </span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '6px', maxWidth: '480px' }}>
                      {zonePlants.map(plant => {
                        const isSelected = selectedPlant?.id === plant.id
                        return (
                          <div key={plant.id} title={`${plantLabel(plant)} · ${plant.status}`} onClick={() => handlePlantClick(plant)} style={{ aspectRatio: '1', borderRadius: '50%', background: STATUS_COLOR[plant.status], opacity: selectedPlant && !isSelected ? 0.45 : 0.82, cursor: 'pointer', minWidth: '12px', minHeight: '12px', transition: 'transform 120ms, opacity 120ms', transform: isSelected ? 'scale(1.45)' : 'scale(1)', outline: isSelected ? '2px solid #D9882B' : 'none', outlineOffset: '2px', animation: plant.status === 'alert' ? 'treePulse 2.2s ease-in-out infinite' : 'none' }} />
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '4px' }}>
                {[{ label: 'Sano', color: '#3A7A4E' }, { label: 'Monitoraggio', color: '#D9882B' }, { label: 'Alert', color: '#B83A2E' }].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color }} />
                    <span style={{ fontSize: '11px', color: '#7A7363' }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Piante a rischio */}
          {activeTab === 'risk' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '680px' }}>
              {zones.map(zone => {
                const zonePlants = atRiskPlants.filter(p => p.zone === zone)
                if (zonePlants.length === 0) return null
                return (
                  <div key={zone}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#524C42' }}>Zona {zone}</span>
                      <div style={{ flex: 1, height: '1px', background: '#C9BEA6' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {zonePlants.map(plant => {
                        const isSelected = selectedPlant?.id === plant.id
                        return (
                          <div key={plant.id} onClick={() => handlePlantClick(plant)} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', cursor: 'pointer', borderRadius: '8px', background: isSelected ? '#F4EFE3' : '#FAF6EC', border: `1px solid ${plant.status === 'alert' ? 'rgba(184,58,46,0.28)' : '#C9BEA6'}`, borderLeft: `3px solid ${STATUS_COLOR[plant.status]}`, transition: 'background 150ms' }}>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: 600, color: '#0A1410', minWidth: '52px' }}>{plantLabel(plant)}</span>
                            <span style={{ flex: 1, fontSize: '12px', color: '#524C42' }}>
                              {plant.disease ? (
                                <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic', fontSize: '13px' }}>{plant.disease.name}</em>
                              ) : plant.irrigation && plant.fertilizer ? 'Stress idrico + carenza nutrienti'
                                : plant.irrigation ? 'Stress idrico rilevato' : 'Carenza nutrienti'}
                            </span>
                            {plant.disease && (
                              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: 700, color: '#B83A2E' }}>{plant.disease.probability}%</span>
                            )}
                            <ChevronRight size={13} style={{ color: '#A99E85', flexShrink: 0 }} />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Tab: Interventi pianificati */}
          {activeTab === 'interventions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '720px' }}>
              {sortedInterventions.map(intervention => {
                const ps = PRIORITY_STYLE[intervention.priority]
                return (
                  <div key={intervention.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '16px 18px', borderRadius: '8px', background: intervention.done ? 'rgba(201,190,166,0.12)' : '#FAF6EC', border: `1px solid ${intervention.done ? 'rgba(201,190,166,0.3)' : ps.border}`, borderLeft: `3px solid ${intervention.done ? '#C9BEA6' : ps.text}`, opacity: intervention.done ? 0.6 : 1, transition: 'opacity 200ms' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', flexShrink: 0, fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center', minWidth: '62px', marginTop: '1px', background: intervention.done ? 'rgba(201,190,166,0.2)' : ps.bg, border: `1px solid ${intervention.done ? 'rgba(201,190,166,0.4)' : ps.border}`, color: intervention.done ? '#A99E85' : ps.text }}>
                      {intervention.done ? 'FATTO' : ps.label}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 500, color: intervention.done ? '#A99E85' : '#0A1410', textDecoration: intervention.done ? 'line-through' : 'none' }}>{intervention.title}</span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', flexShrink: 0, color: intervention.done ? '#A99E85' : (intervention.priority === 'urgent' ? '#B83A2E' : '#7A7363') }}>{intervention.scheduledFor}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: intervention.done ? '#A99E85' : '#524C42', marginBottom: '6px' }}>{intervention.detail}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#A99E85' }}>{intervention.plantLabels}</span>
                          {intervention.plantCount > 1 && (
                            <span style={{ padding: '1px 6px', borderRadius: '4px', fontSize: '10px', color: '#524C42', background: 'rgba(201,190,166,0.28)' }}>{intervention.plantCount} piante</span>
                          )}
                        </div>
                        <button onClick={() => toggleDone(intervention.id)}
                          style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px', fontWeight: 500, fontFamily: "'Inter Tight', sans-serif", background: intervention.done ? 'rgba(58,122,78,0.1)' : 'transparent', border: `1px solid ${intervention.done ? 'rgba(58,122,78,0.3)' : '#C9BEA6'}`, color: intervention.done ? '#3A7A4E' : '#7A7363', transition: 'all 180ms' }}
                          onMouseEnter={e => { if (!intervention.done) { e.currentTarget.style.background = 'rgba(58,122,78,0.07)'; e.currentTarget.style.borderColor = 'rgba(58,122,78,0.25)'; e.currentTarget.style.color = '#3A7A4E' } }}
                          onMouseLeave={e => { if (!intervention.done) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#C9BEA6'; e.currentTarget.style.color = '#7A7363' } }}
                        >
                          <Check size={11} strokeWidth={2.5} />
                          {intervention.done ? 'Completato' : 'Segna come fatto'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Right panel */}
        <div style={{ width: selectedPlant ? '356px' : '0', flexShrink: 0, overflow: 'hidden', transition: 'width 280ms cubic-bezier(0.2, 0.7, 0.2, 1)', borderLeft: selectedPlant ? '1px solid #C9BEA6' : 'none' }}>
          {selectedPlant && (
            <PlantPanel plant={selectedPlant} onClose={() => setSelectedPlant(null)} />
          )}
        </div>
      </div>

      <style>{`
        @keyframes treePulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(184,58,46,0.55); }
          50%       { box-shadow: 0 0 0 5px rgba(184,58,46,0); }
        }
      `}</style>
    </div>
  )
}
