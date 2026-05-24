import { useState, useMemo } from 'react'
import { ArrowLeft, ChevronRight, Check } from 'lucide-react'
import {
  ALL_PLANTS, INITIAL_INTERVENTIONS, CULTIVARS, STATUS_COLOR,
  PRIORITY_STYLE, ZONE_LABEL, plantLabel,
  type Plant, type Tab, type Priority, type Zone, type Intervention,
} from '../data/demoData'
import { PlantPanel } from '../components/demo/PlantPanel'

// Same grain as landing Hero
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

export function Demo() {
  const [activeTab, setActiveTab]         = useState<Tab>('all')
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null)
  const [interventions, setInterventions] = useState<Intervention[]>(INITIAL_INTERVENTIONS)

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

  function handleTabClick(tab: Tab)    { setActiveTab(tab); setSelectedPlant(null) }
  function toggleDone(id: string)      { setInterventions(prev => prev.map(i => i.id === id ? { ...i, done: !i.done } : i)) }
  function handlePlantClick(p: Plant)  { setSelectedPlant(prev => prev?.id === p.id ? null : p) }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        background: '#E8E1CF',
        fontFamily: "'Barlow Semi Condensed', sans-serif",
      }}
    >

      {/* ── Header ── */}
      <header
        style={{
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          height: '52px',
          flexShrink: 0,
          background: '#191E1A',
          borderBottom: '1px solid rgba(232,225,207,0.08)',
        }}
      >
        {/* Grain overlay */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: GRAIN,
            backgroundRepeat: 'repeat',
            backgroundSize: '256px 256px',
            opacity: 0.025,
            mixBlendMode: 'overlay',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Wordmark */}
          <span
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: '20px',
              color: '#E8E1CF',
              fontWeight: 400,
              letterSpacing: '-0.01em',
            }}
          >
            Trop<em style={{ color: '#CC5427', fontStyle: 'italic' }}>X</em>
          </span>

          <div aria-hidden="true" style={{ width: '1px', height: '20px', background: 'rgba(232,225,207,0.1)' }} />

          <span
            style={{
              fontFamily: "'Barlow Semi Condensed', sans-serif",
              fontSize: '13px',
              color: 'rgba(232,225,207,0.62)',
            }}
          >
            Az. Agr. Greco · Ragusa, Sicilia · 8.3 ha
          </span>

          {/* Demo badge */}
          <span
            style={{
              padding: '2px 8px',
              borderRadius: '4px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.09em',
              fontWeight: 700,
              background: 'rgba(204,84,39,0.15)',
              border: '1px solid rgba(204,84,39,0.3)',
              color: '#CC5427',
            }}
          >
            DEMO
          </span>
        </div>

        {/* Back link */}
        <a
          href="#"
          onClick={e => {
            e.preventDefault()
            window.location.hash = ''
            window.dispatchEvent(new HashChangeEvent('hashchange'))
          }}
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: "'Barlow Semi Condensed', sans-serif",
            fontSize: '13px',
            color: 'rgba(232,225,207,0.35)',
            textDecoration: 'none',
            transition: 'color 200ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(232,225,207,0.7)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,225,207,0.35)')}
        >
          <ArrowLeft size={14} aria-hidden="true" /> Back to site
        </a>
      </header>

      {/* ── Stats strip (light instrument panel) ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          flexShrink: 0,
          background: '#F0EADB',
          borderBottom: '1px solid #BDB5A0',
        }}
      >
        {[
          {
            code: 'TREES MONITORED',
            value: '120',
            sub: 'Hass · Fuerte · Tommy Atkins',
            accent: undefined as string | undefined,
          },
          {
            code: 'ACTIVE ALERTS',
            value: String(alertCount),
            sub: 'Phytophthora · Colletotrichum',
            accent: '#B83A2E',
          },
          {
            code: 'UNDER WATCH',
            value: String(monitoringCount),
            sub: 'Irrigation · nutrients',
            accent: '#CC5427',
          },
          {
            code: 'URGENT ACTIONS',
            value: String(urgentCount),
            sub: 'To complete today or tomorrow',
            accent: '#CC5427',
          },
        ].map((s, i) => (
          <div
            key={s.code}
            style={{
              padding: '14px 28px',
              borderLeft: i > 0 ? '1px solid #BDB5A0' : 'none',
              minWidth: '160px',
            }}
          >
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#7A7060',
                marginBottom: '5px',
              }}
            >
              {s.code}
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '22px',
                fontVariantNumeric: 'tabular-nums',
                lineHeight: 1,
                color: s.accent ?? '#191E1A',
                marginBottom: '3px',
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: "'Barlow Semi Condensed', sans-serif",
                fontSize: '11px',
                color: '#BDB5A0',
              }}
            >
              {s.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── Tab bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexShrink: 0,
          padding: '0 32px',
          borderBottom: '1px solid #BDB5A0',
          background: '#E8E1CF',
        }}
      >
        {([
          { id: 'all',           label: 'All trees'                                           },
          { id: 'risk',          label: 'At-risk trees',      count: alertCount + monitoringCount },
          { id: 'interventions', label: 'Scheduled actions',  count: interventions.filter(i => !i.done).length },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '13px 16px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #CC5427' : '2px solid transparent',
              fontFamily: "'Barlow Semi Condensed', sans-serif",
              fontSize: '13px',
              fontWeight: activeTab === tab.id ? 500 : 400,
              color: activeTab === tab.id ? '#191E1A' : '#7A7060',
              cursor: 'pointer',
              marginBottom: '-1px',
              transition: 'color 180ms',
            }}
          >
            {tab.label}
            {'count' in tab && tab.count > 0 && (
              <span
                style={{
                  padding: '1px 7px',
                  borderRadius: '9999px',
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px',
                  fontVariantNumeric: 'tabular-nums',
                  fontWeight: 700,
                  background: activeTab === tab.id ? '#CC5427' : 'rgba(189,181,160,0.4)',
                  color: activeTab === tab.id ? '#F0EADB' : '#7A7060',
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Main area ── */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>

          {/* ── Tab: All trees ── */}
          {activeTab === 'all' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {zones.map(zone => {
                const zonePlants = ALL_PLANTS.filter(p => p.zone === zone)
                return (
                  <div key={zone}>
                    {/* Zone header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <span
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: '10px',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#7A7060',
                        }}
                      >
                        Zone {ZONE_LABEL[zone]}
                      </span>
                      <div style={{ flex: 1, height: '1px', background: '#BDB5A0' }} aria-hidden="true" />
                      <span
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: '11px',
                          color: '#BDB5A0',
                          fontStyle: 'italic',
                        }}
                      >
                        {CULTIVARS[zone].split(' — ')[1]} · {zonePlants.length} trees
                      </span>
                    </div>

                    {/* Dot grid */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(12, 1fr)',
                        gap: '6px',
                        maxWidth: '480px',
                      }}
                    >
                      {zonePlants.map(plant => {
                        const isSelected = selectedPlant?.id === plant.id
                        return (
                          <div
                            key={plant.id}
                            title={`${plantLabel(plant)} · ${plant.status}`}
                            onClick={() => handlePlantClick(plant)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handlePlantClick(plant) }}
                            style={{
                              aspectRatio: '1',
                              borderRadius: '50%',
                              background: STATUS_COLOR[plant.status],
                              opacity: selectedPlant && !isSelected ? 0.35 : 0.85,
                              cursor: 'pointer',
                              minWidth: '12px',
                              minHeight: '12px',
                              transition: 'transform 120ms, opacity 120ms',
                              transform: isSelected ? 'scale(1.45)' : 'scale(1)',
                              outline: isSelected ? '2px solid #CC5427' : 'none',
                              outlineOffset: '2px',
                              animation: plant.status === 'alert' ? 'demoPulse 2.2s ease-in-out infinite' : 'none',
                            }}
                          />
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {/* Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', paddingTop: '4px' }}>
                {[
                  { label: 'Healthy',    color: '#3A7A4E' },
                  { label: 'Monitoring', color: '#CC5427' },
                  { label: 'Alert',      color: '#B83A2E' },
                ].map(l => (
                  <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <div aria-hidden="true" style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color }} />
                    <span style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: '11px', color: '#7A7060' }}>
                      {l.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Tab: At-risk trees ── */}
          {activeTab === 'risk' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '680px' }}>
              {zones.map(zone => {
                const zonePlants = atRiskPlants.filter(p => p.zone === zone)
                if (zonePlants.length === 0) return null
                return (
                  <div key={zone}>
                    {/* Zone header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                      <span
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: '10px',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: '#7A7060',
                        }}
                      >
                        Zone {ZONE_LABEL[zone]}
                      </span>
                      <div style={{ flex: 1, height: '1px', background: '#BDB5A0' }} aria-hidden="true" />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {zonePlants.map(plant => {
                        const isSelected  = selectedPlant?.id === plant.id
                        const isAlert     = plant.status === 'alert'
                        return (
                          <div
                            key={plant.id}
                            onClick={() => handlePlantClick(plant)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handlePlantClick(plant) }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '12px 16px',
                              cursor: 'pointer',
                              borderRadius: '4px',
                              background: isSelected ? '#E8E1CF' : '#F0EADB',
                              border: `1px solid ${isAlert ? 'rgba(184,58,46,0.28)' : '#BDB5A0'}`,
                              borderLeft: `3px solid ${STATUS_COLOR[plant.status]}`,
                              transition: 'background 150ms',
                              boxShadow: isSelected ? '0 1px 3px rgba(25,30,26,0.08)' : 'none',
                            }}
                          >
                            <span
                              style={{
                                fontFamily: "'IBM Plex Mono', monospace",
                                fontSize: '13px',
                                fontWeight: 600,
                                fontVariantNumeric: 'tabular-nums',
                                color: '#191E1A',
                                minWidth: '52px',
                              }}
                            >
                              {plantLabel(plant)}
                            </span>
                            <span
                              style={{
                                flex: 1,
                                fontFamily: "'Barlow Semi Condensed', sans-serif",
                                fontSize: '13px',
                                color: '#7A7060',
                              }}
                            >
                              {plant.disease ? (
                                <em
                                  style={{
                                    fontFamily: "'DM Serif Display', serif",
                                    fontStyle: 'italic',
                                    fontSize: '13px',
                                    color: '#191E1A',
                                  }}
                                >
                                  {plant.disease.name}
                                </em>
                              ) : plant.irrigation && plant.fertilizer
                                ? 'Water stress + nutrient deficiency'
                                : plant.irrigation
                                ? 'Water stress detected'
                                : 'Nutrient deficiency'}
                            </span>
                            {plant.disease && (
                              <span
                                style={{
                                  fontFamily: "'IBM Plex Mono', monospace",
                                  fontSize: '12px',
                                  fontVariantNumeric: 'tabular-nums',
                                  fontWeight: 700,
                                  color: '#B83A2E',
                                }}
                              >
                                {plant.disease.probability}%
                              </span>
                            )}
                            <ChevronRight size={13} style={{ color: '#BDB5A0', flexShrink: 0 }} aria-hidden="true" />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── Tab: Scheduled actions ── */}
          {activeTab === 'interventions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '720px' }}>
              {sortedInterventions.map(item => {
                const ps = PRIORITY_STYLE[item.priority]
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '14px',
                      padding: '16px 18px',
                      borderRadius: '4px',
                      background: item.done ? 'rgba(189,181,160,0.10)' : '#F0EADB',
                      border: `1px solid ${item.done ? 'rgba(189,181,160,0.3)' : ps.border}`,
                      borderLeft: `3px solid ${item.done ? '#BDB5A0' : ps.text}`,
                      opacity: item.done ? 0.6 : 1,
                      transition: 'opacity 200ms',
                    }}
                  >
                    {/* Priority badge */}
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        flexShrink: 0,
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '10px',
                        fontWeight: 700,
                        letterSpacing: '0.07em',
                        textAlign: 'center',
                        minWidth: '62px',
                        marginTop: '1px',
                        background: item.done ? 'rgba(189,181,160,0.2)' : ps.bg,
                        border: `1px solid ${item.done ? 'rgba(189,181,160,0.4)' : ps.border}`,
                        color: item.done ? '#BDB5A0' : ps.text,
                      }}
                    >
                      {item.done ? 'DONE' : ps.label}
                    </span>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          justifyContent: 'space-between',
                          gap: '8px',
                          marginBottom: '4px',
                        }}
                      >
                        <span
                          style={{
                            fontFamily: "'Barlow Semi Condensed', sans-serif",
                            fontSize: '14px',
                            fontWeight: 500,
                            color: item.done ? '#BDB5A0' : '#191E1A',
                            textDecoration: item.done ? 'line-through' : 'none',
                          }}
                        >
                          {item.title}
                        </span>
                        <span
                          style={{
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: '11px',
                            flexShrink: 0,
                            color: item.done ? '#BDB5A0' : item.priority === 'urgent' ? '#B83A2E' : '#7A7060',
                          }}
                        >
                          {item.scheduledFor}
                        </span>
                      </div>
                      <div
                        style={{
                          fontFamily: "'Barlow Semi Condensed', sans-serif",
                          fontSize: '13px',
                          color: item.done ? '#BDB5A0' : '#7A7060',
                          marginBottom: '8px',
                          lineHeight: 1.45,
                        }}
                      >
                        {item.detail}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontFamily: "'IBM Plex Mono', monospace",
                              fontSize: '11px',
                              fontVariantNumeric: 'tabular-nums',
                              color: '#BDB5A0',
                            }}
                          >
                            {item.plantLabels}
                          </span>
                          {item.plantCount > 1 && (
                            <span
                              style={{
                                padding: '1px 6px',
                                borderRadius: '4px',
                                fontFamily: "'Barlow Semi Condensed', sans-serif",
                                fontSize: '10px',
                                color: '#7A7060',
                                background: 'rgba(189,181,160,0.28)',
                              }}
                            >
                              {item.plantCount} trees
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => toggleDone(item.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontFamily: "'Barlow Semi Condensed', sans-serif",
                            fontSize: '12px',
                            fontWeight: 500,
                            background: item.done ? 'rgba(58,122,78,0.10)' : 'transparent',
                            border: `1px solid ${item.done ? 'rgba(58,122,78,0.3)' : '#BDB5A0'}`,
                            color: item.done ? '#3A7A4E' : '#7A7060',
                            transition: 'all 180ms',
                          }}
                          onMouseEnter={e => {
                            if (!item.done) {
                              e.currentTarget.style.background  = 'rgba(58,122,78,0.07)'
                              e.currentTarget.style.borderColor = 'rgba(58,122,78,0.25)'
                              e.currentTarget.style.color       = '#3A7A4E'
                            }
                          }}
                          onMouseLeave={e => {
                            if (!item.done) {
                              e.currentTarget.style.background  = 'transparent'
                              e.currentTarget.style.borderColor = '#BDB5A0'
                              e.currentTarget.style.color       = '#7A7060'
                            }
                          }}
                        >
                          <Check size={11} strokeWidth={2.5} aria-hidden="true" />
                          {item.done ? 'Completed' : 'Mark done'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Right panel (slide in) ── */}
        <div
          style={{
            width: selectedPlant ? '356px' : '0',
            flexShrink: 0,
            overflow: 'hidden',
            transition: 'width 280ms cubic-bezier(0.2, 0.7, 0.2, 1)',
            borderLeft: selectedPlant ? '1px solid #BDB5A0' : 'none',
          }}
        >
          {selectedPlant && (
            <PlantPanel plant={selectedPlant} onClose={() => setSelectedPlant(null)} />
          )}
        </div>
      </div>

      <style>{`
        @keyframes demoPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(184,58,46,0.55); }
          50%       { box-shadow: 0 0 0 5px rgba(184,58,46,0);  }
        }
      `}</style>
    </div>
  )
}
