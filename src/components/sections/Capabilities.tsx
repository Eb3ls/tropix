const metrics = [
  {
    tag: 'DISEASE DETECTION',
    value: '14',
    unit: 'days',
    title: 'Phytophthora cinnamomi',
    description:
      'Median lead time on root-rot symptoms before visible canopy distress. Multispectral signature + sap-flow anomaly cross-validation.',
  },
  {
    tag: 'BLOOM INTENSITY',
    value: '±8',
    unit: '%',
    title: 'Panicle count',
    description:
      'Per-tree flower counting from drone-pass imagery. Variance against manual ground-truth counts across 142 trees, sample season Q2 2025.',
  },
  {
    tag: 'YIELD FORECAST',
    value: '±25',
    unit: '%',
    title: 'Pre-harvest yield',
    description:
      'Six to eight weeks before pick-date, per-orchard tonnage estimate. Calibrated against verified harvest weights from three pilot sites.',
  },
]

export function Capabilities() {
  return (
    <section
      id="capabilities"
      style={{ background: '#0A1410', padding: '96px 0' }}
    >
      <div className="mx-auto" style={{ maxWidth: '1280px', padding: '0 80px' }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div
            style={{ width: '24px', height: '1px', background: '#D9882B', flexShrink: 0 }}
          />
          <span
            style={{
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 500,
              color: '#F0C381',
            }}
          >
            WHAT THE PLATFORM ACTUALLY DOES
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 'clamp(36px, 4.5vw, 56px)',
            lineHeight: 1.05,
            fontWeight: 400,
            color: '#F4EFE3',
            marginBottom: '16px',
            maxWidth: '680px',
            textWrap: 'balance',
          }}
        >
          Numbers that move with the season, not the marketing.
        </h2>
        <p
          style={{
            fontSize: '17px',
            lineHeight: 1.55,
            color: 'rgba(244, 239, 227, 0.65)',
            maxWidth: '600px',
            marginBottom: '64px',
          }}
        >
          Pilot accuracy benchmarks measured on Sicilian Hass and Reed avocado
          orchards, 2024–2025 validation set.
        </p>

        {/* Metric grid */}
        <div
          className="grid grid-cols-1 sb:grid-cols-3"
          style={{
            background: 'rgba(244, 239, 227, 0.08)',
            gap: '1px',
          }}
        >
          {metrics.map(m => (
            <div
              key={m.tag}
              style={{
                background: '#0A1410',
                padding: '40px 32px',
              }}
            >
              {/* Tag */}
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#F0C381',
                  marginBottom: '16px',
                }}
              >
                {m.tag}
              </div>

              {/* Value + unit */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '4px',
                  marginBottom: '12px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontVariantNumeric: 'tabular-nums',
                    fontSize: '44px',
                    lineHeight: 1,
                    letterSpacing: '-0.02em',
                    color: '#F0C381',
                  }}
                >
                  {m.value}
                </span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '22px',
                    lineHeight: 1,
                    color: '#F0C381',
                  }}
                >
                  {m.unit}
                </span>
              </div>

              {/* Title */}
              <h4
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: 'italic',
                  fontSize: '22px',
                  lineHeight: 1.3,
                  fontWeight: 400,
                  color: '#F4EFE3',
                  marginBottom: '12px',
                }}
              >
                {m.title}
              </h4>

              {/* Description */}
              <p
                style={{
                  fontSize: '14px',
                  lineHeight: 1.55,
                  color: 'rgba(244, 239, 227, 0.6)',
                }}
              >
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
