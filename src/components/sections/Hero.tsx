import { ArrowRight, ArrowDownRight } from 'lucide-react'

const stats = [
  { label: 'MARKET SIZE', value: '€171.8M' },
  { label: 'CAGR', value: '20.9 %' },
  { label: 'VERTICAL PLATFORMS TODAY', value: '0' },
  { label: 'PILOT LAUNCHES', value: 'Q2 2026 · Sicily' },
]

export function Hero() {
  return (
    <section
      className="relative"
      style={{ minHeight: '720px', display: 'flex', flexDirection: 'column' }}
    >
      {/* Background image */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/orchard-aerial.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'saturate(0.85) contrast(0.95)',
        }}
      />

      {/* Gradient overlays */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(90deg, rgba(10,20,16,0.78) 0%, rgba(10,20,16,0.55) 50%, rgba(10,20,16,0.15) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(180deg, rgba(10,20,16,0.35) 0%, rgba(10,20,16,0.45) 100%)',
        }}
      />

      {/* Content */}
      <div
        className="relative flex-1 mx-auto w-full"
        style={{
          maxWidth: '1280px',
          padding: '80px 80px 140px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ maxWidth: '720px' }}>
          {/* Eyebrow */}
          <div
            className="flex items-center gap-3 mb-6"
            style={{ color: '#F0C381' }}
          >
            <div
              aria-hidden="true"
              style={{ width: '32px', height: '1px', background: '#D9882B', flexShrink: 0 }}
            />
            <span
              style={{
                fontSize: '12px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                fontWeight: 500,
              }}
            >
              PRECISION FARMING · MEDITERRANEAN TROPICAL FRUIT
            </span>
          </div>

          {/* H1 */}
          <h1
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: 'clamp(48px, 6vw, 80px)',
              lineHeight: 1.02,
              letterSpacing: '-0.015em',
              fontWeight: 400,
              color: '#F4EFE3',
              textWrap: 'balance',
              marginBottom: '24px',
            }}
          >
            Mediterranean avocado and mango, measured tree by tree.
          </h1>

          {/* Lede */}
          <p
            style={{
              fontSize: '19px',
              lineHeight: 1.5,
              color: 'rgba(244, 239, 227, 0.85)',
              marginBottom: '40px',
              maxWidth: '600px',
            }}
          >
            A precision-farming platform built for <em>Persea americana</em> and{' '}
            <em>Mangifera indica</em> in the Mediterranean basin — not adapted
            from cereal or vineyard software.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#apply"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#D9882B',
                color: '#F4EFE3',
                fontSize: '15px',
                fontWeight: 500,
                padding: '14px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'background 200ms cubic-bezier(0.2, 0.7, 0.2, 1)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#A86415')}
              onMouseLeave={e => (e.currentTarget.style.background = '#D9882B')}
            >
              Apply for the 2026 Sicily pilot
              <ArrowRight size={16} />
            </a>
            <a
              href="#system"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                color: '#F4EFE3',
                fontSize: '15px',
                fontWeight: 400,
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                transition: 'opacity 200ms cubic-bezier(0.2, 0.7, 0.2, 1)',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              See how it works
              <ArrowDownRight size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div
        className="relative w-full"
        style={{
          borderTop: '1px solid rgba(244, 239, 227, 0.18)',
        }}
      >
        <div
          className="mx-auto grid grid-cols-2 sb:grid-cols-4"
          style={{ maxWidth: '1280px', padding: '0 80px' }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: '24px 0',
                borderLeft: i > 0 ? '1px solid rgba(244, 239, 227, 0.12)' : undefined,
                paddingLeft: i > 0 ? '24px' : undefined,
              }}
            >
              <div
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#F0C381',
                  marginBottom: '6px',
                  fontFamily: "'Inter Tight', sans-serif",
                  fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontVariantNumeric: 'tabular-nums',
                  fontSize: '24px',
                  lineHeight: 1.2,
                  color: '#F4EFE3',
                  letterSpacing: '-0.01em',
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
