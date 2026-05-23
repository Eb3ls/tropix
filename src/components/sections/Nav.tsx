export function Nav() {
  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        height: '64px',
        background: 'rgba(232, 225, 207, 0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid #BDB5A0',
      }}
    >
      <div
        className="mx-auto flex h-full items-center justify-between px-6 sb:px-20"
        style={{ maxWidth: '1280px' }}
      >
        {/* Wordmark */}
        <a
          href="/"
          className="no-underline"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '28px',
            lineHeight: 1,
            color: '#191E1A',
            fontWeight: 400,
          }}
        >
          Tropi<em style={{ color: '#CC5427', fontStyle: 'italic' }}>X</em>
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
              { label: 'Platform', href: '#/platform' },
            ].map(({ label, href }) => (
              <a
                key={href}
                href={href}
                style={{
                  fontSize: '14px',
                  color: '#7A7060',
                  textDecoration: 'none',
                  transition: 'color 200ms cubic-bezier(0.2, 0.7, 0.2, 1)',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#191E1A')}
                onMouseLeave={e => (e.currentTarget.style.color = '#7A7060')}
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
              background: '#CC5427',
              color: '#F0EADB',
              fontSize: '14px',
              fontWeight: 500,
              padding: '10px 18px',
              borderRadius: '4px',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              transition: 'background 200ms cubic-bezier(0.2, 0.7, 0.2, 1)',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#A8421C')}
            onMouseLeave={e => (e.currentTarget.style.background = '#CC5427')}
          >
            Apply for pilot
          </a>
        </div>
      </div>
    </nav>
  )
}
