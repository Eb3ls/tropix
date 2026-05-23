const founders = [
  { initial: 'F', name: 'Founder One', role: 'AI / Computer Vision' },
  { initial: 'F', name: 'Founder Two', role: 'AI / Machine Learning' },
  { initial: 'F', name: 'Founder Three', role: 'AI / Software Engineering' },
  { initial: 'F', name: 'Founder Four', role: 'Industrial Engineering' },
  { initial: 'F', name: 'Founder Five', role: 'Computer Science' },
]

const partners = [
  'Fondazione Edmund Mach',
  'ELGO-DIMITRA',
  'CSIC',
  'HIT Trentino',
  'Invitalia',
]

export function Team() {
  return (
    <section
      id="team"
      style={{
        background: '#EBE4D2',
        borderTop: '1px solid #C9BEA6',
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
              color: '#524C42',
            }}
          >
            THE TEAM
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 'clamp(36px, 4.5vw, 56px)',
            lineHeight: 1.05,
            fontWeight: 400,
            color: '#0A1410',
            marginBottom: '16px',
            textWrap: 'balance',
          }}
        >
          Built in Trento. Tested in Sicily.
        </h2>
        <p style={{ fontSize: '17px', lineHeight: 1.55, color: '#524C42', maxWidth: '560px', marginBottom: '56px' }}>
          Five founders — three AI software engineers, one industrial engineer,
          one computer-science student. Seed round in progress.
        </p>

        {/* Team grid */}
        <div className="grid grid-cols-2 sb:grid-cols-5" style={{ gap: '16px', marginBottom: '64px' }}>
          {founders.map((f, i) => (
            <div
              key={i}
              style={{
                background: '#F4EFE3',
                border: '1px solid #C9BEA6',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              {/* Avatar placeholder */}
              <div
                style={{
                  aspectRatio: '1',
                  background: '#14271E',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: 'italic',
                    fontSize: '36px',
                    color: '#F0C381',
                    lineHeight: 1,
                  }}
                >
                  {f.initial}
                </span>
              </div>
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#0A1410',
                  marginBottom: '4px',
                }}
              >
                {f.name}
              </div>
              <div style={{ fontSize: '12px', color: '#7A7363' }}>{f.role}</div>
            </div>
          ))}
        </div>

        {/* Partners strip */}
        <div style={{ borderTop: '1px solid #C9BEA6', paddingTop: '40px' }}>
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#7A7363',
              textAlign: 'center',
              marginBottom: '24px',
            }}
          >
            IN CONVERSATION WITH
          </p>
          <div
            className="flex flex-wrap justify-center items-center"
            style={{ gap: '32px' }}
          >
            {partners.map(p => (
              <span
                key={p}
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: 'italic',
                  fontSize: '20px',
                  color: '#7A7363',
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
