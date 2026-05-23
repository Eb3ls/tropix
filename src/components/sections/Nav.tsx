export function Nav() {
  return (
    <nav
      className="sticky top-0 z-50 border-b border-pietra-300"
      style={{
        height: '64px',
        background: 'rgba(244, 239, 227, 0.92)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="mx-auto flex h-full items-center justify-between"
        style={{ maxWidth: '1280px', padding: '0 80px' }}
      >
        {/* Wordmark */}
        <a
          href="/"
          className="no-underline"
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: '28px',
            lineHeight: 1,
            color: '#0A1410',
            fontWeight: 400,
          }}
        >
          Trop
          <em style={{ color: '#D9882B', fontStyle: 'italic' }}>X</em>
        </a>

        {/* Right side */}
        <div className="flex items-center gap-8">
          {/* Links — hidden on mobile, visible at 900px+ */}
          <div className="hidden sb:flex items-center gap-6">
            {[
              { label: 'System', href: '#system' },
              { label: 'Capabilities', href: '#capabilities' },
              { label: 'Pilot', href: '#pilot' },
              { label: 'Team', href: '#team' },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                style={{
                  fontSize: '14px',
                  color: '#524C42',
                  textDecoration: 'none',
                  transition: 'color 200ms cubic-bezier(0.2, 0.7, 0.2, 1)',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#0A1410')}
                onMouseLeave={e => (e.currentTarget.style.color = '#524C42')}
              >
                {label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            href="#apply"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#D9882B',
              color: '#F4EFE3',
              fontSize: '14px',
              fontWeight: 500,
              padding: '10px 18px',
              borderRadius: '8px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'background 200ms cubic-bezier(0.2, 0.7, 0.2, 1)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#A86415')}
            onMouseLeave={e => (e.currentTarget.style.background = '#D9882B')}
          >
            Apply for pilot
          </a>
        </div>
      </div>
    </nav>
  )
}
