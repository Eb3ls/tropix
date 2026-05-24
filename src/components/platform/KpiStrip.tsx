// Landing-style dark instrument panel — matches Hero's "FIELD READINGS · SIC-01" aesthetic
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

const readings = [
  {
    code: 'TREES SURVEYED',
    value: '127',
    unit: '/ 127',
    note: 'Last flight today',
    alert: false,
  },
  {
    code: 'ACTIVE ALERTS',
    value: '1',
    unit: '',
    note: 'Immediate action required',
    alert: true,
  },
  {
    code: 'AVG SAP-FLOW',
    value: '47',
    unit: 'ml/h',
    note: '−39% vs baseline · declining',
    alert: true,
  },
  {
    code: 'NEXT HARVEST',
    value: '~6',
    unit: 'wks',
    note: 'Yield estimate — Hass',
    alert: false,
  },
] as const

export function KpiStrip() {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: '#191E1A',
        border: '1px solid rgba(232,225,207,0.1)',
        borderRadius: '4px',
      }}
    >
      {/* Grain */}
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

      {/* Panel header */}
      <div
        style={{
          position: 'relative',
          padding: '14px 24px 0',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: '#CC5427',
          marginBottom: '12px',
        }}
      >
        FIELD READINGS · ORD-00
      </div>

      {/* Metrics row */}
      <div
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          padding: '0 24px 18px',
        }}
      >
        {readings.map((item, i) => (
          <div
            key={item.code}
            style={{
              paddingRight: i < readings.length - 1 ? '24px' : '0',
              paddingLeft: i > 0 ? '24px' : '0',
              borderRight:
                i < readings.length - 1
                  ? '1px solid rgba(232,225,207,0.08)'
                  : 'none',
            }}
          >
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(232,225,207,0.38)',
                marginBottom: '6px',
              }}
            >
              {item.code}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '6px',
                marginBottom: '4px',
              }}
            >
              <span
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '32px',
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                  color: item.alert ? '#B83A2E' : '#E8E1CF',
                }}
              >
                {item.value}
              </span>
              {item.unit && (
                <span
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '13px',
                    fontVariantNumeric: 'tabular-nums',
                    color: 'rgba(232,225,207,0.38)',
                  }}
                >
                  {item.unit}
                </span>
              )}
            </div>
            <div
              style={{
                fontFamily: "'Barlow Semi Condensed', sans-serif",
                fontSize: '11px',
                color: item.alert
                  ? 'rgba(184,58,46,0.8)'
                  : 'rgba(232,225,207,0.35)',
              }}
            >
              {item.note}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
