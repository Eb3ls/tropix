import { ArrowRight, ArrowDownRight } from 'lucide-react'
import type { CSSProperties } from 'react'

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

const stats = [
  { label: 'DISEASE DETECTION LEAD', value: '14 days' },
  { label: 'SENSOR GRANULARITY', value: 'Per tree' },
  { label: 'PILOT COHORT', value: 'Q2 2026 · Sicily' },
]

/** Staggered CSS animation helper */
function anim(delayMs: number): CSSProperties {
  return { animation: `fadeUp 680ms ${delayMs}ms cubic-bezier(0.2, 0.7, 0.2, 1) both` }
}

export function Hero() {
  return (
    <section
      className="relative"
      style={{ minHeight: '760px', display: 'flex', flexDirection: 'column' }}
    >
      {/* Background image */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/orchard-aerial.png)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'saturate(0.85) contrast(0.95)',
        }}
      />

      {/* Gradient — left-heavy for legibility */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(10,20,16,0.88) 0%, rgba(10,20,16,0.65) 50%, rgba(10,20,16,0.18) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(10,20,16,0.22) 0%, rgba(10,20,16,0.55) 100%)',
        }}
      />

      {/* Grain texture — adds tactile depth */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: GRAIN,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
          opacity: 0.035,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />

      {/* Main content */}
      <div
        className="relative flex-1 mx-auto w-full"
        style={{
          maxWidth: '1280px',
          padding: 'clamp(64px, 8vw, 120px) 80px 140px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
        }}
      >
        <div style={{ maxWidth: '760px' }}>
          {/* Eyebrow */}
          <div
            className="flex items-center gap-3 mb-6"
            style={{ color: '#F0C381', ...anim(80) }}
          >
            <div
              aria-hidden="true"
              style={{ width: '32px', height: '1px', background: '#D9882B', flexShrink: 0 }}
            />
            <span style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 500 }}>
              2026 PILOT COHORT NOW OPEN · 8 FARMS · SICILY
            </span>
          </div>

          {/* H1 — bigger, tighter tracking */}
          <h1
            style={{
              ...anim(220),
              fontFamily: "'Instrument Serif', serif",
              fontSize: 'clamp(52px, 7vw, 88px)',
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
              fontWeight: 400,
              color: '#F4EFE3',
              textWrap: 'balance',
              marginBottom: '28px',
            }}
          >
            Mediterranean avocado and mango,{' '}
            <em style={{ fontStyle: 'italic', color: '#F0C381' }}>
              measured tree by tree.
            </em>
          </h1>

          {/* Lede */}
          <p
            style={{
              ...anim(360),
              fontSize: '19px', lineHeight: 1.55,
              color: 'rgba(244, 239, 227, 0.88)',
              marginBottom: '40px', maxWidth: '580px',
            }}
          >
            The first precision-farming platform trained specifically on{' '}
            <em>Persea americana</em> and{' '}
            <em>Mangifera indica</em>. Not adapted from cereal or vineyard data.
            Disease detection 14 days before visible symptoms. Per tree.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap items-center gap-4"
            style={anim(480)}
          >
            {/* Primary — filled */}
            <a
              href="#apply"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#D9882B', color: '#F4EFE3',
                fontSize: '15px', fontWeight: 500,
                padding: '14px 24px', borderRadius: '8px',
                textDecoration: 'none',
                transition: 'background 200ms cubic-bezier(0.2, 0.7, 0.2, 1)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#A86415')}
              onMouseLeave={e => (e.currentTarget.style.background = '#D9882B')}
            >
              Apply for the 2026 Sicily pilot
              <ArrowRight size={16} />
            </a>

            {/* Secondary — outline */}
            <a
              href="#in-season"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                color: 'rgba(244, 239, 227, 0.82)', fontSize: '15px', fontWeight: 400,
                padding: '13px 20px', borderRadius: '8px',
                border: '1px solid rgba(244, 239, 227, 0.28)',
                textDecoration: 'none',
                transition: 'border-color 200ms cubic-bezier(0.2, 0.7, 0.2, 1), color 200ms cubic-bezier(0.2, 0.7, 0.2, 1)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(244, 239, 227, 0.6)'
                e.currentTarget.style.color = '#F4EFE3'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(244, 239, 227, 0.28)'
                e.currentTarget.style.color = 'rgba(244, 239, 227, 0.82)'
              }}
            >
              See what a season looks like
              <ArrowDownRight size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div
        className="relative w-full"
        style={{ borderTop: '1px solid rgba(244, 239, 227, 0.18)', ...anim(580) }}
      >
        <div
          className="mx-auto grid grid-cols-1 sb:grid-cols-3"
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
                  fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'rgba(244, 239, 227, 0.5)', marginBottom: '6px',
                  fontFamily: "'Inter Tight', sans-serif", fontWeight: 500,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontVariantNumeric: 'tabular-nums',
                  fontSize: '22px', lineHeight: 1.2,
                  color: '#F4EFE3', letterSpacing: '-0.01em',
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
