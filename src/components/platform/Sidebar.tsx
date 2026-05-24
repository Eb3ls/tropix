import { LayoutGrid, Bell, FileText, Settings, ArrowLeft, Thermometer, Wind, Droplets } from 'lucide-react'

export type ViewType = 'orchard' | 'alerts' | 'reports' | 'settings'

interface SidebarProps {
  activeView: ViewType
  onNavigate: (view: ViewType) => void
}

const navLinks: { icon: React.ElementType; label: string; view: ViewType; badge?: number }[] = [
  { icon: LayoutGrid, label: 'Orchard',  view: 'orchard'              },
  { icon: Bell,       label: 'Alerts',   view: 'alerts',  badge: 1   },
  { icon: FileText,   label: 'Reports',  view: 'reports'              },
  { icon: Settings,   label: 'Settings', view: 'settings'             },
]

// Static weather data — would come from API in production
const weather = [
  { icon: Thermometer, value: '24°C' },
  { icon: Droplets,    value: '71%'  },
  { icon: Wind,        value: '12 km/h' },
]

export function PlatformSidebar({ activeView, onNavigate }: SidebarProps) {
  return (
    <aside
      style={{
        width: '220px',
        flexShrink: 0,
        background: '#191E1A',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(232,225,207,0.08)',
      }}
    >
      {/* ── Wordmark ── */}
      <div style={{ padding: '20px 24px 0', marginBottom: '32px' }}>
        <a
          href="#"
          onClick={() => {
            window.location.hash = ''
            window.dispatchEvent(new HashChangeEvent('hashchange'))
          }}
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '22px',
            color: '#E8E1CF',
            fontWeight: 400,
            textDecoration: 'none',
            display: 'block',
            letterSpacing: '-0.01em',
          }}
        >
          Trop<em style={{ color: '#CC5427', fontStyle: 'italic' }}>X</em>
        </a>
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '9px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(232,225,207,0.25)',
            marginTop: '2px',
          }}
        >
          Platform · v0.1
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav aria-label="Dashboard navigation" style={{ flex: 1, padding: '0 12px' }}>
        {navLinks.map(item => {
          const Icon    = item.icon
          const isActive = activeView === item.view
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.view)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '4px',
                marginBottom: '2px',
                background: isActive ? 'rgba(232,225,207,0.09)' : 'transparent',
                cursor: 'pointer',
                border: 'none',
                transition: 'background 150ms',
                textAlign: 'left',
              }}
              onMouseEnter={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(232,225,207,0.04)'
              }}
              onMouseLeave={e => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon
                  size={16}
                  strokeWidth={isActive ? 2 : 1.5}
                  style={{ color: isActive ? '#E8E1CF' : 'rgba(232,225,207,0.35)' }}
                  aria-hidden="true"
                />
                <span
                  style={{
                    fontFamily: "'Barlow Semi Condensed', sans-serif",
                    fontSize: '14px',
                    color: isActive ? '#E8E1CF' : 'rgba(232,225,207,0.45)',
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  {item.label}
                </span>
              </div>
              {item.badge != null && (
                <span
                  style={{
                    background: '#B83A2E',
                    color: '#F0EADB',
                    fontSize: '11px',
                    fontFamily: "'IBM Plex Mono', monospace",
                    borderRadius: '9999px',
                    padding: '1px 6px',
                    lineHeight: 1.4,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* ── Weather strip ── */}
      <div
        style={{
          margin: '8px 12px',
          padding: '12px 14px',
          background: 'rgba(232,225,207,0.04)',
          borderRadius: '4px',
          border: '1px solid rgba(232,225,207,0.08)',
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '9px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(232,225,207,0.25)',
            marginBottom: '8px',
          }}
        >
          Field weather · now
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {weather.map(({ icon: Icon, value }, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Icon size={12} style={{ color: 'rgba(232,225,207,0.3)', flexShrink: 0 }} strokeWidth={1.5} aria-hidden="true" />
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '12px',
                  fontVariantNumeric: 'tabular-nums',
                  color: 'rgba(232,225,207,0.55)',
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Farm info ── */}
      <div
        style={{
          margin: '8px 12px',
          padding: '12px 14px',
          background: 'rgba(232,225,207,0.04)',
          borderRadius: '4px',
          border: '1px solid rgba(232,225,207,0.08)',
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '9px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'rgba(232,225,207,0.25)',
            marginBottom: '4px',
          }}
        >
          Farm
        </div>
        <div
          style={{
            fontFamily: "'Barlow Semi Condensed', sans-serif",
            fontSize: '13px',
            color: 'rgba(232,225,207,0.65)',
            fontWeight: 500,
            lineHeight: 1.3,
          }}
        >
          Az. Agr. Greco
        </div>
        <div
          style={{
            fontFamily: "'Barlow Semi Condensed', sans-serif",
            fontSize: '11px',
            color: 'rgba(232,225,207,0.3)',
            marginTop: '2px',
          }}
        >
          Ragusa, Sicilia · 8.3 ha
        </div>
      </div>

      {/* ── Back to site ── */}
      <a
        href="#"
        onClick={e => {
          e.preventDefault()
          window.location.hash = ''
          window.dispatchEvent(new HashChangeEvent('hashchange'))
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          margin: '8px 12px 16px',
          padding: '10px 12px',
          fontFamily: "'Barlow Semi Condensed', sans-serif",
          fontSize: '13px',
          color: 'rgba(232,225,207,0.3)',
          textDecoration: 'none',
          borderRadius: '4px',
          transition: 'color 200ms',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(232,225,207,0.6)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,225,207,0.3)')}
      >
        <ArrowLeft size={14} aria-hidden="true" /> Back to site
      </a>
    </aside>
  )
}
