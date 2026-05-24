const figures = [
  {
    value: '€171.8',
    unit: 'M',
    label: 'Mediterranean avocado & mango market value, 2025 — projected €430M by 2030.',
  },
  {
    value: '20.9',
    unit: '%',
    label: 'Compound annual growth rate of avocado hectarage in Sicily, Calabria & Puglia.',
  },
  {
    value: '~3,200',
    unit: 'ha',
    label: 'Sicilian land already converted from citrus to tropical fruit cultivation.',
  },
]

const competitors = [
  { name: 'xFarm', tag: 'Cereal · Vineyard' },
  { name: 'AGRIVI', tag: 'Arable · Generic' },
  { name: 'Farmonaut', tag: 'Satellite · Arable' },
  { name: 'GeoPard', tag: 'Cereal · Variable-rate' },
  { name: 'Evja', tag: 'Vegetable · Sensor' },
  { name: 'TropiX', tag: 'Avocado · Mango', highlight: true },
]

export function Market() {
  return (
    <section
      id="market"
      style={{
        background: '#E8E1CF',
        borderTop: '1px solid #BDB5A0',
        borderBottom: '1px solid #BDB5A0',
        padding: '96px 0',
      }}
    >
      <div className="mx-auto px-6 sb:px-20" style={{ maxWidth: '1280px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#CC5427', fontWeight: 500 }}>
            MKT-05
          </span>
          <span aria-hidden="true">{' · '}</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#BDB5A0' }}>
            THE OPPORTUNITY
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(36px, 4.5vw, 56px)',
            lineHeight: 1.05,
            fontWeight: 400,
            color: '#191E1A',
            marginBottom: '20px',
            maxWidth: '760px',
            textWrap: 'balance',
          }}
        >
          A €171.8 million European market with no vertical incumbent.
        </h2>

        <p style={{ fontSize: '19px', lineHeight: 1.5, color: '#7A7060', maxWidth: '640px' }}>
          Mediterranean avocado and mango cultivation has grown faster than any
          other premium fruit in the basin. Existing AgriTech platforms target
          cereals, vineyards, and large-scale arable. None of them speak{' '}
          <em style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic' }}>drupacea</em>.
        </p>

        {/* Two-column grid */}
        <div
          className="grid grid-cols-1 sb:grid-cols-[1.2fr_1fr]"
          style={{ gap: '64px', marginTop: '56px', alignItems: 'end' }}
        >
          {/* Left: figures */}
          <div>
            {figures.map((fig, i) => (
              <div
                key={i}
                style={{
                  borderTop: '1px solid #BDB5A0',
                  padding: '28px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontVariantNumeric: 'tabular-nums',
                      fontSize: '52px',
                      lineHeight: 1,
                      letterSpacing: '-0.02em',
                      color: '#191E1A',
                    }}
                  >
                    {fig.value}
                  </span>
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '28px',
                      lineHeight: 1,
                      color: '#7A7060',
                    }}
                  >
                    {fig.unit}
                  </span>
                </div>
                <p style={{ fontSize: '15px', lineHeight: 1.55, color: '#7A7060' }}>
                  {fig.label}
                </p>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #BDB5A0' }} />
          </div>

          {/* Right: competitor card */}
          <div
            style={{
              background: '#F0EADB',
              border: '1px solid #BDB5A0',
              borderRadius: '4px',
              padding: '32px',
            }}
          >
            <h4
              style={{
                fontSize: '14px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#7A7060',
                marginBottom: '20px',
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: 500,
              }}
            >
              AGRITECH COMPETITORS
            </h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {competitors.map(c => (
                <li
                  key={c.name}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '15px',
                    fontWeight: c.highlight ? 600 : 400,
                    color: '#191E1A',
                    ...(c.highlight ? {
                      borderLeft: '2px solid #CC5427',
                      paddingLeft: '8px',
                      background: 'rgba(204, 84, 39, 0.04)',
                    } : {}),
                  }}
                >
                  <span>{c.name}</span>
                  <span
                    style={{
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '12px',
                      color: c.highlight ? '#CC5427' : '#BDB5A0',
                    }}
                  >
                    {c.tag}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
