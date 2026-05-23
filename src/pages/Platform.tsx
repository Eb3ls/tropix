import { useState } from 'react'
import {
  LayoutGrid, Bell, FileText, Settings, AlertTriangle,
  Wifi, Wind, Droplets, ChevronRight, ArrowLeft
} from 'lucide-react'

// ─── Tree grid data ───────────────────────────────────────────────────────────
const COLS = 14
const ROWS = 10

type TreeStatus = 'healthy' | 'monitoring' | 'alert' | 'empty'

function getTreeStatus(idx: number): TreeStatus {
  const empty = new Set([0, 1, 12, 13, 126, 127, 138, 139])
  if (empty.has(idx)) return 'empty'
  if (idx === 62) return 'alert'          // Tree 47 in Block C
  if ([8, 23, 41, 78, 99, 115].includes(idx)) return 'monitoring'
  return 'healthy'
}

const trees = Array.from({ length: COLS * ROWS }, (_, i) => ({
  id: i + 1,
  status: getTreeStatus(i),
}))

const treeColor: Record<TreeStatus, string> = {
  healthy: '#3A7A4E',
  monitoring: '#D9882B',
  alert: '#B83A2E',
  empty: 'transparent',
}

// ─── Activity feed ────────────────────────────────────────────────────────────
const activity = [
  { time: 'Today 07:23', label: 'Alert generated', detail: 'Tree 47 · Phytophthora signature', critical: true },
  { time: 'Today 06:47', label: 'Drone flight complete', detail: '8.3 ha · 127 trees surveyed', critical: false },
  { time: 'Yesterday 14:00', label: 'Sap-flow anomaly', detail: 'Tree 47 · below baseline threshold', critical: false },
  { time: '2 days ago 08:12', label: 'Weather station', detail: '24 °C · humidity 71 % · wind 12 km/h', critical: false },
]

// ─── Sap-flow sparkline data (Tree 47, last 7 days) ───────────────────────────
const sapReadings = [
  { day: 'Mon', value: 82, baseline: 78 },
  { day: 'Tue', value: 79, baseline: 78 },
  { day: 'Wed', value: 74, baseline: 78 },
  { day: 'Thu', value: 68, baseline: 78 },
  { day: 'Fri', value: 61, baseline: 78 },
  { day: 'Sat', value: 54, baseline: 78 },
  { day: 'Sun', value: 47, baseline: 78 },
]

// ─── Sidebar nav ─────────────────────────────────────────────────────────────
const sidebarLinks = [
  { icon: LayoutGrid, label: 'Orchard', active: true },
  { icon: Bell, label: 'Alerts', badge: 1 },
  { icon: FileText, label: 'Reports' },
  { icon: Settings, label: 'Settings' },
]

// ─── Component ───────────────────────────────────────────────────────────────
export function Platform() {
  const [selectedTree, setSelectedTree] = useState<number | null>(62)

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        fontFamily: "'Inter Tight', sans-serif",
        background: '#F4EFE3',
      }}
    >
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside
        style={{
          width: '220px',
          flexShrink: 0,
          background: '#0A1410',
          display: 'flex',
          flexDirection: 'column',
          padding: '0',
          borderRight: '1px solid rgba(244,239,227,0.08)',
        }}
      >
        {/* Wordmark */}
        <div style={{ padding: '20px 24px 0', marginBottom: '32px' }}>
          <a
            href="#"
            onClick={() => { window.location.hash = ''; window.dispatchEvent(new HashChangeEvent('hashchange')) }}
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: '24px',
              color: '#F4EFE3',
              fontWeight: 400,
              textDecoration: 'none',
              display: 'block',
            }}
          >
            Trop<em style={{ color: '#D9882B', fontStyle: 'italic' }}>X</em>
          </a>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '0 12px' }}>
          {sidebarLinks.map(item => {
            const Icon = item.icon
            return (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  marginBottom: '2px',
                  background: item.active ? 'rgba(244,239,227,0.08)' : 'transparent',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Icon
                    size={16}
                    strokeWidth={item.active ? 2 : 1.5}
                    style={{ color: item.active ? '#F0C381' : 'rgba(244,239,227,0.45)' }}
                  />
                  <span
                    style={{
                      fontSize: '14px',
                      color: item.active ? '#F4EFE3' : 'rgba(244,239,227,0.5)',
                      fontWeight: item.active ? 500 : 400,
                    }}
                  >
                    {item.label}
                  </span>
                </div>
                {item.badge ? (
                  <span
                    style={{
                      background: '#B83A2E',
                      color: '#F4EFE3',
                      fontSize: '11px',
                      fontWeight: 600,
                      borderRadius: '9999px',
                      padding: '1px 6px',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </div>
            )
          })}
        </nav>

        {/* Farm info */}
        <div
          style={{
            margin: '12px',
            padding: '14px',
            background: 'rgba(244,239,227,0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(244,239,227,0.08)',
          }}
        >
          <div style={{ fontSize: '11px', color: 'rgba(244,239,227,0.35)', marginBottom: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Farm
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(244,239,227,0.7)', fontWeight: 500, lineHeight: 1.3 }}>
            Az. Agr. Greco
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(244,239,227,0.35)', marginTop: '2px' }}>
            Ragusa, Sicilia
          </div>
        </div>

        {/* Back to landing */}
        <a
          href="#"
          onClick={e => { e.preventDefault(); window.location.hash = ''; window.dispatchEvent(new HashChangeEvent('hashchange')) }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '0 12px 16px',
            padding: '10px 12px',
            fontSize: '13px',
            color: 'rgba(244,239,227,0.35)',
            textDecoration: 'none',
            borderRadius: '8px',
            transition: 'color 200ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(244,239,227,0.65)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(244,239,227,0.35)')}
        >
          <ArrowLeft size={14} />
          Back to site
        </a>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 32px',
            borderBottom: '1px solid #C9BEA6',
            background: '#F4EFE3',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: '22px',
                fontWeight: 400,
                color: '#0A1410',
                margin: 0,
              }}
            >
              Orchard overview
            </h1>
            <div style={{ fontSize: '13px', color: '#7A7363', marginTop: '2px' }}>
              Az. Agr. Greco · Ragusa · 8.3 ha
            </div>
          </div>

          {/* Status chips */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                background: 'rgba(184,58,46,0.08)',
                border: '1px solid rgba(184,58,46,0.25)',
                borderRadius: '9999px',
                fontSize: '12px',
                color: '#B83A2E',
                fontWeight: 500,
              }}
            >
              <AlertTriangle size={12} />
              1 active alert
            </div>
            <div
              style={{
                padding: '6px 12px',
                background: '#FAF6EC',
                border: '1px solid #C9BEA6',
                borderRadius: '9999px',
                fontSize: '12px',
                color: '#524C42',
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              Last flight: today 06:47
            </div>
          </div>
        </div>

        <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* ── Alert card ──────────────────────────────────────────────── */}
          <div
            style={{
              background: '#FAF6EC',
              border: '1px solid rgba(184,58,46,0.35)',
              borderLeft: '3px solid #B83A2E',
              borderRadius: '12px',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '16px',
            }}
          >
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  background: 'rgba(184,58,46,0.1)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <AlertTriangle size={18} style={{ color: '#B83A2E' }} strokeWidth={1.75} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#B83A2E',
                    marginBottom: '6px',
                  }}
                >
                  CRITICAL · Tree 47 · Block C
                </div>
                <div
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: 'italic',
                    fontSize: '18px',
                    color: '#0A1410',
                    marginBottom: '6px',
                  }}
                >
                  Possible Phytophthora cinnamomi root-zone signature detected
                </div>
                <div style={{ fontSize: '13px', color: '#524C42', lineHeight: 1.5 }}>
                  Cross-validated: multispectral anomaly + sap-flow stress below baseline threshold.
                  14 days before expected visual canopy symptoms.
                </div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '12px',
                    color: '#7A7363',
                    marginTop: '8px',
                  }}
                >
                  Detected today 07:23 · Confidence: high
                </div>
              </div>
            </div>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                background: '#0A1410',
                color: '#F4EFE3',
                fontSize: '13px',
                fontWeight: 500,
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                fontFamily: "'Inter Tight', sans-serif",
              }}
            >
              Contact agronomist
              <ChevronRight size={14} />
            </button>
          </div>

          {/* ── Two-column grid ─────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>

            {/* Orchard tree map */}
            <div
              style={{
                background: '#FAF6EC',
                border: '1px solid #C9BEA6',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500, color: '#0A1410' }}>Tree health map</div>
                  <div style={{ fontSize: '12px', color: '#7A7363', marginTop: '2px' }}>
                    127 trees · Hass avocado · flight today 06:47
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {[
                    { label: 'Healthy', color: '#3A7A4E' },
                    { label: 'Monitoring', color: '#D9882B' },
                    { label: 'Alert', color: '#B83A2E' },
                  ].map(l => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color }} />
                      <span style={{ fontSize: '11px', color: '#7A7363' }}>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tree grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                  gap: '6px',
                  padding: '4px',
                }}
              >
                {trees.map(tree => {
                  const isAlert = tree.status === 'alert'
                  const isEmpty = tree.status === 'empty'
                  const isSelected = selectedTree === tree.id - 1
                  return (
                    <div
                      key={tree.id}
                      title={isEmpty ? undefined : `Tree ${tree.id}`}
                      onClick={() => !isEmpty && setSelectedTree(tree.id - 1)}
                      style={{
                        width: '100%',
                        aspectRatio: '1',
                        borderRadius: '50%',
                        background: isEmpty ? 'transparent' : treeColor[tree.status],
                        opacity: isEmpty ? 0 : (isSelected ? 1 : 0.75),
                        cursor: isEmpty ? 'default' : 'pointer',
                        transition: 'transform 120ms, opacity 120ms',
                        transform: isSelected ? 'scale(1.35)' : 'scale(1)',
                        outline: isSelected && !isEmpty ? '2px solid #D9882B' : 'none',
                        outlineOffset: '2px',
                        animation: isAlert ? 'pulse 2s ease-in-out infinite' : 'none',
                        minWidth: '10px',
                        minHeight: '10px',
                      }}
                    />
                  )
                })}
              </div>

              <style>{`
                @keyframes pulse {
                  0%, 100% { box-shadow: 0 0 0 0 rgba(184,58,46,0.6); }
                  50% { box-shadow: 0 0 0 6px rgba(184,58,46,0); }
                }
              `}</style>
            </div>

            {/* Activity feed */}
            <div
              style={{
                background: '#FAF6EC',
                border: '1px solid #C9BEA6',
                borderRadius: '12px',
                padding: '24px',
              }}
            >
              <div style={{ fontSize: '14px', fontWeight: 500, color: '#0A1410', marginBottom: '20px' }}>
                Recent activity
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {activity.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      paddingBottom: i < activity.length - 1 ? '16px' : '0',
                      marginBottom: i < activity.length - 1 ? '16px' : '0',
                      borderBottom: i < activity.length - 1 ? '1px solid rgba(201,190,166,0.5)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          color: item.critical ? '#B83A2E' : '#0A1410',
                        }}
                      >
                        {item.label}
                      </span>
                      <span
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '11px',
                          color: '#7A7363',
                        }}
                      >
                        {item.time.split(' ')[0]}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#7A7363' }}>{item.detail}</div>
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '11px',
                        color: '#A99E85',
                        marginTop: '2px',
                      }}
                    >
                      {item.time.split(' ').slice(1).join(' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Sap-flow strip ──────────────────────────────────────────── */}
          <div
            style={{
              background: '#FAF6EC',
              border: '1px solid #C9BEA6',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#0A1410' }}>
                  Sap-flow · Tree 47 · Last 7 days
                </div>
                <div style={{ fontSize: '12px', color: '#7A7363', marginTop: '2px' }}>
                  Continuous sensor · Block C · Hass avocado
                </div>
              </div>
              <div
                style={{
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
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

            <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', height: '80px' }}>
              {sapReadings.map((r, i) => {
                const isLast = i === sapReadings.length - 1
                const pct = (r.value / 100) * 100
                const basePct = (r.baseline / 100) * 100
                const isBelowBase = r.value < r.baseline
                return (
                  <div
                    key={r.day}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}
                  >
                    {/* Bar */}
                    <div style={{ width: '100%', height: '64px', position: 'relative', display: 'flex', alignItems: 'flex-end' }}>
                      {/* Baseline line */}
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          bottom: `${basePct * 0.64}px`,
                          borderTop: '1px dashed #A99E85',
                          zIndex: 2,
                        }}
                      />
                      {/* Value bar */}
                      <div
                        style={{
                          width: '100%',
                          height: `${pct * 0.64}px`,
                          background: isBelowBase
                            ? (isLast ? '#B83A2E' : 'rgba(184,58,46,0.5)')
                            : 'rgba(58,122,78,0.5)',
                          borderRadius: '3px 3px 0 0',
                          transition: 'height 400ms cubic-bezier(0.2,0.7,0.2,1)',
                        }}
                      />
                    </div>
                    {/* Day label */}
                    <div
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: '10px',
                        color: isLast ? '#B83A2E' : '#7A7363',
                        fontWeight: isLast ? 600 : 400,
                      }}
                    >
                      {r.day}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Sensor readings row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
                marginTop: '20px',
                paddingTop: '20px',
                borderTop: '1px solid rgba(201,190,166,0.5)',
              }}
            >
              {[
                { icon: Droplets, label: 'Sap-flow today', value: '47 %', sub: 'of baseline', alert: true },
                { icon: Wind, label: 'Soil moisture', value: '18 %', sub: 'vol · sensor A', alert: false },
                { icon: Wifi, label: 'Sensor status', value: 'Online', sub: 'last sync 07:23', alert: false },
              ].map(s => {
                const Icon = s.icon
                return (
                  <div
                    key={s.label}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '12px',
                      background: s.alert ? 'rgba(184,58,46,0.05)' : '#F4EFE3',
                      borderRadius: '8px',
                      border: s.alert ? '1px solid rgba(184,58,46,0.2)' : '1px solid #C9BEA6',
                    }}
                  >
                    <Icon size={16} style={{ color: s.alert ? '#B83A2E' : '#7A7363', marginTop: '2px', flexShrink: 0 }} strokeWidth={1.5} />
                    <div>
                      <div style={{ fontSize: '11px', color: '#7A7363', marginBottom: '3px' }}>{s.label}</div>
                      <div
                        style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: '16px',
                          color: s.alert ? '#B83A2E' : '#0A1410',
                          fontWeight: 500,
                          lineHeight: 1,
                        }}
                      >
                        {s.value}
                      </div>
                      <div style={{ fontSize: '11px', color: '#A99E85', marginTop: '2px' }}>{s.sub}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
