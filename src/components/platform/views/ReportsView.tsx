import { FileText, Download, Clock } from 'lucide-react'
import { reports } from '../../../data/platformData'

// Decorative large-number background (like System.tsx in the landing)
const reportIcons: Record<string, string> = {
  'Weekly scouting summary': '01',
  'Sap-flow trend analysis':  '02',
  'Disease risk assessment':  '03',
  'Yield forecast — Hass':    '04',
}

export function ReportsView() {
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
          RPT-01 <span aria-hidden="true" style={{ color: '#BDB5A0' }}>·</span> Reports
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
          Reports
        </h1>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 32px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '16px',
            maxWidth: '880px',
          }}
        >
          {reports.map(r => {
            const isGenerating = r.status === 'generating'
            const num = reportIcons[r.title] ?? '—'

            return (
              <div
                key={r.title}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  background: '#F0EADB',
                  border: '1px solid #BDB5A0',
                  borderLeft: isGenerating ? '2px solid #CC5427' : '2px solid #BDB5A0',
                  borderRadius: '4px',
                  padding: '24px',
                  boxShadow: '0 1px 2px rgba(25,30,26,0.06)',
                  transition: 'box-shadow 200ms',
                }}
                onMouseEnter={e =>
                  ((e.currentTarget as HTMLDivElement).style.boxShadow =
                    '0 4px 12px -4px rgba(25,30,26,0.14)')
                }
                onMouseLeave={e =>
                  ((e.currentTarget as HTMLDivElement).style.boxShadow =
                    '0 1px 2px rgba(25,30,26,0.06)')
                }
              >
                {/* Decorative background number (landing-style) */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    right: '-6px',
                    top: '-10px',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '96px',
                    lineHeight: 1,
                    color: 'rgba(204,84,39,0.06)',
                    letterSpacing: '-0.06em',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  {num}
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      border: '1px solid #BDB5A0',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      background: 'rgba(204,84,39,0.03)',
                    }}
                  >
                    {isGenerating ? (
                      <Clock size={16} style={{ color: '#CC5427' }} strokeWidth={1.5} aria-hidden="true" />
                    ) : (
                      <FileText size={16} style={{ color: '#191E1A' }} strokeWidth={1.5} aria-hidden="true" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontSize: '16px',
                        color: '#191E1A',
                        marginBottom: '4px',
                        lineHeight: 1.2,
                      }}
                    >
                      {r.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '11px',
                        color: '#7A7060',
                      }}
                    >
                      {r.period}
                    </div>
                  </div>
                </div>

                {/* Action */}
                {isGenerating ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '10px',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#CC5427',
                        background: 'rgba(204,84,39,0.08)',
                        border: '1px solid rgba(204,84,39,0.2)',
                        padding: '3px 9px',
                        borderRadius: '9999px',
                      }}
                    >
                      Generating…
                    </span>
                    <span style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: '11px', color: '#BDB5A0' }}>
                      Ready in ~2 hours
                    </span>
                  </div>
                ) : (
                  <a
                    href="#"
                    onClick={e => e.preventDefault()}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: "'Barlow Semi Condensed', sans-serif",
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#191E1A',
                      textDecoration: 'none',
                      borderBottom: '1px solid #BDB5A0',
                      paddingBottom: '1px',
                      transition: 'border-color 200ms',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#191E1A')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#BDB5A0')}
                  >
                    <Download size={13} aria-hidden="true" /> Download PDF
                  </a>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ height: '8px' }} />
      </div>
    </div>
  )
}
