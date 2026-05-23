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
        background: '#EBE4D2',
        borderTop: '1px solid #C9BEA6',
        borderBottom: '1px solid #C9BEA6',
        padding: '96px 0',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: '1280px', padding: '0 80px' }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div style={{ width: '24px', height: '1px', background: '#D9882B', flexShrink: 0 }} />
          <span
            style={{
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 500,
              color: '#A86415',
            }}
          >
            THE OPPORTUNITY
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 'clamp(36px, 4.5vw, 56px)',
            lineHeight: 1.05,
            fontWeight: 400,
            color: '#0A1410',
            marginBottom: '20px',
            maxWidth: '760px',
            textWrap: 'balance',
          }}
        >
          A €172 million European market with no vertical incumbent.
        </h2>

        <p style={{ fontSize: '19px', lineHeight: 1.5, color: '#524C42', maxWidth: '640px' }}>
          Mediterranean avocado and mango cultivation has grown faster than any
          other premium fruit in the basin. Existing AgriTech platforms target
          cereals, vineyards, and large-scale arable. None of them speak{' '}
          <em style={{ fontFamily: "'Instrument Serif', serif" }}>drupacea</em>.
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
                  borderTop: '1px solid #C9BEA6',
                  padding: '28px 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontVariantNumeric: 'tabular-nums',
                      fontSize: '52px',
                      lineHeight: 1,
                      letterSpacing: '-0.02em',
                      color: '#0A1410',
                    }}
                  >
                    {fig.value}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '28px',
                      lineHeight: 1,
                      color: '#7A7363',
                    }}
                  >
                    {fig.unit}
                  </span>
                </div>
                <p style={{ fontSize: '15px', lineHeight: 1.55, color: '#524C42' }}>
                  {fig.label}
                </p>
              </div>
            ))}
            <div style={{ borderTop: '1px solid #C9BEA6' }} />
          </div>

          {/* Right: competitor card */}
          <div
            style={{
              background: '#F4EFE3',
              border: '1px solid #C9BEA6',
              borderRadius: '12px',
              padding: '32px',
            }}
          >
            <h4
              style={{
                fontSize: '14px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#524C42',
                marginBottom: '20px',
                fontFamily: "'Inter Tight', sans-serif",
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
                    color: '#0A1410',
                  }}
                >
                  <span>{c.name}</span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '12px',
                      color: c.highlight ? '#A86415' : '#7A7363',
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
