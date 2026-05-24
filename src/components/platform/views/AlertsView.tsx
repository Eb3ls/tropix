import { Phone } from 'lucide-react'
import { alerts, type Alert } from '../../../data/platformData'

const severityConfig = {
  critical: {
    color: '#B83A2E',
    bg: 'rgba(184,58,46,0.06)',
    border: '3px solid #B83A2E',
    label: 'CRITICAL',
    description: 'Immediate action required',
  },
  warning: {
    color: '#CC5427',
    bg: 'rgba(204,84,39,0.06)',
    border: '3px solid #CC5427',
    label: 'WARNING',
    description: 'Monitor closely',
  },
  info: {
    color: '#7A7060',
    bg: 'transparent',
    border: '1px solid #BDB5A0',
    label: 'INFO',
    description: 'For your information',
  },
}

function AlertRow({ alert }: { alert: Alert }) {
  const sc = severityConfig[alert.severity]
  return (
    <div
      style={{
        background: '#F0EADB',
        border: '1px solid #BDB5A0',
        borderLeft: sc.border,
        borderRadius: '4px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        opacity: alert.resolved ? 0.55 : 1,
        position: 'relative',
      }}
    >
      {/* Severity badge */}
      <div style={{ flexShrink: 0, minWidth: '76px' }}>
        <span
          style={{
            display: 'inline-block',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            padding: '3px 8px',
            background: alert.resolved ? 'rgba(122,112,96,0.08)' : sc.bg,
            color: alert.resolved ? '#7A7060' : sc.color,
            borderRadius: '9999px',
            textTransform: 'uppercase',
          }}
        >
          {sc.label}
        </span>
        <div
          style={{
            fontFamily: "'Barlow Semi Condensed', sans-serif",
            fontSize: '10px',
            color: '#BDB5A0',
            marginTop: '4px',
            paddingLeft: '2px',
          }}
        >
          {sc.description}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontStyle: 'italic',
            fontSize: '15px',
            color: '#191E1A',
            marginBottom: '5px',
            lineHeight: 1.25,
          }}
        >
          {alert.disease}
        </div>
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px',
            color: '#7A7060',
          }}
        >
          {alert.tree
            ? `Tree ${alert.tree} · Block ${alert.block}`
            : `All Block ${alert.block}`}
          <span aria-hidden="true" style={{ color: '#BDB5A0' }}> · </span>
          {alert.time}
        </div>
      </div>

      {/* Right side */}
      {alert.resolved ? (
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: '#BDB5A0',
            background: 'rgba(189,181,160,0.12)',
            border: '1px solid rgba(189,181,160,0.3)',
            padding: '3px 8px',
            borderRadius: '9999px',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          Resolved
        </span>
      ) : alert.severity === 'critical' ? (
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            background: '#B83A2E',
            color: '#F0EADB',
            fontFamily: "'Barlow Semi Condensed', sans-serif",
            fontSize: '12px',
            fontWeight: 600,
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            transition: 'background 150ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#9A2E23')}
          onMouseLeave={e => (e.currentTarget.style.background = '#B83A2E')}
        >
          <Phone size={12} aria-hidden="true" /> Call agronomist
        </button>
      ) : null}
    </div>
  )
}

export function AlertsView() {
  const active   = alerts.filter(a => !a.resolved)
  const resolved = alerts.filter(a => a.resolved)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Top bar */}
      <div
        style={{
          padding: '14px 32px',
          borderBottom: '1px solid #BDB5A0',
          background: '#E8E1CF',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#CC5427',
            marginBottom: '3px',
          }}
        >
          ALT-01 <span aria-hidden="true" style={{ color: '#BDB5A0' }}>·</span> Active alerts
        </div>
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '20px',
            fontWeight: 400,
            color: '#191E1A',
            margin: 0,
          }}
        >
          Alerts
        </h1>
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >

        {/* Active */}
        <section>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '10px',
            }}
          >
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#7A7060',
              }}
            >
              Active — {active.length}
            </span>
            {active.length > 0 && (
              <div
                style={{
                  height: '1px',
                  flex: 1,
                  background: '#BDB5A0',
                }}
                aria-hidden="true"
              />
            )}
          </div>

          {active.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {active.map(a => (
                <AlertRow key={a.id} alert={a} />
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: '40px 32px',
                textAlign: 'center',
                background: '#F0EADB',
                border: '1px solid #BDB5A0',
                borderRadius: '4px',
              }}
            >
              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#3A7A4E',
                  marginBottom: '6px',
                }}
              >
                All clear
              </div>
              <div
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: '18px',
                  color: '#7A7060',
                }}
              >
                No active alerts
              </div>
            </div>
          )}
        </section>

        {/* Resolved */}
        {resolved.length > 0 && (
          <section>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '10px',
              }}
            >
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#7A7060',
                }}
              >
                Resolved — last 30 days
              </span>
              <div
                style={{ height: '1px', flex: 1, background: '#BDB5A0' }}
                aria-hidden="true"
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {resolved.map(a => (
                <AlertRow key={a.id} alert={a} />
              ))}
            </div>
          </section>
        )}

        <div style={{ height: '8px' }} />
      </div>
    </div>
  )
}
