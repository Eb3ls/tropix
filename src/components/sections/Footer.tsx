const nav = [
  {
    heading: 'PLATFORM',
    links: [
      { label: 'System', href: '#system' },
      { label: 'Capabilities', href: '#capabilities' },
      { label: 'Sicily pilot', href: '#pilot' },
      { label: 'Buyer portal', href: '#' },
    ],
  },
  {
    heading: 'COMPANY',
    links: [
      { label: 'Team', href: '#team' },
      { label: 'Press', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    heading: 'INVESTORS',
    links: [
      { label: 'Pitch deck', href: '#' },
      { label: 'Executive summary', href: '#' },
      { label: 'investors@tropix.eu', href: 'mailto:investors@tropix.eu' },
    ],
  },
]

export function Footer() {
  return (
    <footer style={{ background: '#0A1410', padding: '64px 0 0' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px', padding: '0 80px' }}>
        {/* Main grid */}
        <div
          className="grid grid-cols-1 sb:grid-cols-[2fr_1fr_1fr_1fr]"
          style={{ gap: '48px', marginBottom: '48px' }}
        >
          {/* Brand col */}
          <div>
            <div
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: '28px',
                lineHeight: 1,
                color: '#F4EFE3',
                fontWeight: 400,
                marginBottom: '16px',
              }}
            >
              Trop<em style={{ color: '#D9882B', fontStyle: 'italic' }}>X</em>
            </div>
            <p
              style={{
                fontSize: '14px',
                lineHeight: 1.55,
                color: 'rgba(244, 239, 227, 0.6)',
                maxWidth: '280px',
              }}
            >
              Precision-farming platform for avocado and mango cultivation in
              the Mediterranean basin. Founded in Trento, operating in Sicily.
            </p>
          </div>

          {/* Nav cols */}
          {nav.map(col => (
            <div key={col.heading}>
              <p
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#F0C381',
                  marginBottom: '16px',
                  fontWeight: 500,
                }}
              >
                {col.heading}
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {col.links.map(link => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      style={{
                        fontSize: '14px',
                        color: 'rgba(244, 239, 227, 0.75)',
                        textDecoration: 'none',
                        transition: 'color 200ms cubic-bezier(0.2, 0.7, 0.2, 1)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#F4EFE3')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(244, 239, 227, 0.75)')}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-wrap justify-between items-center gap-4"
          style={{
            borderTop: '1px solid rgba(244, 239, 227, 0.15)',
            padding: '24px 0 32px',
          }}
        >
          <span style={{ fontSize: '12px', color: 'rgba(244, 239, 227, 0.45)' }}>
            © 2026 TropiX S.r.l. · P.IVA 02XXXXXX · Trento, Italia
          </span>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy', 'Terms', 'Cookie policy'].map(label => (
              <a
                key={label}
                href="#"
                style={{
                  fontSize: '12px',
                  color: 'rgba(244, 239, 227, 0.45)',
                  textDecoration: 'none',
                  transition: 'color 200ms cubic-bezier(0.2, 0.7, 0.2, 1)',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(244, 239, 227, 0.75)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(244, 239, 227, 0.45)')}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
