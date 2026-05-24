export function SettingsView() {
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
          SET-01 <span aria-hidden="true" style={{ color: '#BDB5A0' }}>·</span> Settings
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
          Settings
        </h1>
      </div>

      {/* Placeholder */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#BDB5A0',
              marginBottom: '8px',
            }}
          >
            Coming soon
          </div>
          <div
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: '22px',
              color: '#7A7060',
              marginBottom: '12px',
            }}
          >
            Farm settings
          </div>
          <div
            style={{
              fontFamily: "'Barlow Semi Condensed', sans-serif",
              fontSize: '14px',
              color: '#BDB5A0',
              maxWidth: '280px',
              lineHeight: 1.5,
            }}
          >
            Alert thresholds, notification preferences, and agronomist contacts will appear here.
          </div>
        </div>
      </div>
    </div>
  )
}
