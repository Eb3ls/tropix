import { ArrowRight, ArrowDown } from 'lucide-react'
import type { CSSProperties } from 'react'

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

const stats: { label: string; value: string }[] = [
  { label: 'CROPS COVERED',    value: 'Avocado · Mango' },
  { label: 'FLIGHT FREQUENCY', value: 'Daily' },
  { label: 'PILOT COHORT',     value: 'Q2 2026 · Sicily' },
]

const instruments = [
  { code: 'DISEASE DETECTION LEAD', value: '14', unit: 'days' },
  { code: 'SENSOR GRANULARITY', value: 'Per', unit: 'tree' },
  { code: 'YIELD FORECAST ACCURACY', value: '±25', unit: '%' },
] as const

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
          filter: 'saturate(0.8) contrast(0.95) brightness(0.85)',
        }}
      />

      {/* Gradient overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(100deg, rgba(25,30,26,0.92) 0%, rgba(25,30,26,0.72) 55%, rgba(25,30,26,0.30) 100%)',
        }}
      />

      {/* Grain texture */}
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

      {/* Main content — split layout */}
      <div
        className="relative flex-1 mx-auto w-full px-6 sb:px-20"
        style={{
          maxWidth: '1280px',
          paddingTop: 'clamp(80px, 9vw, 140px)',
          paddingBottom: 'clamp(60px, 6vw, 100px)',
          display: 'flex', alignItems: 'center', gap: '48px',
        }}
      >
        {/* Left — 60% */}
        <div style={{ flex: '0 0 58%', maxWidth: '58%' }}>
          {/* Eyebrow */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', ...anim(80) }}>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#CC5427', fontWeight: 500,
            }}>
              TRP-00
            </span>
            <span aria-hidden="true" style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#CC5427', fontWeight: 500,
            }}>
              {' · '}
            </span>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'rgba(232,225,207,0.5)',
            }}>
              PRECISION FARMING
            </span>
            <div style={{ width: '24px', height: '1px', background: 'rgba(204, 84, 39, 0.5)' }} />
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'rgba(232,225,207,0.5)',
            }}>
              2026 PILOT OPEN
            </span>
          </div>

          {/* H1 */}
          <h1
            style={{
              ...anim(200),
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(52px, 6vw, 84px)',
              lineHeight: 1.02,
              fontWeight: 400,
              color: '#E8E1CF',
              letterSpacing: '-0.02em',
              textWrap: 'balance',
              marginBottom: '28px',
            }}
          >
            Mediterranean avocado and mango,{' '}
            <em style={{ fontStyle: 'italic', color: '#CC5427' }}>measured tree by tree.</em>
          </h1>

          {/* Lede */}
          <p
            style={{
              ...anim(340),
              fontFamily: "'Barlow Semi Condensed', sans-serif",
              fontSize: '18px', lineHeight: 1.55,
              color: 'rgba(232, 225, 207, 0.82)',
              maxWidth: '520px', marginBottom: '40px',
            }}
          >
            The first precision-farming platform built for Mediterranean avocado and mango.
            Pathogen detection before visible symptoms, water-stress monitoring, and yield
            forecasting — at per-tree resolution.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', ...anim(460) }}>
            {/* Primary */}
            <a
              href="#apply"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#CC5427', color: '#F0EADB',
                fontFamily: "'Barlow Semi Condensed', sans-serif",
                fontSize: '15px', fontWeight: 600,
                padding: '13px 24px', borderRadius: '4px',
                textDecoration: 'none',
                transition: 'background 200ms cubic-bezier(0.2, 0.7, 0.2, 1)',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#A8421C')}
              onMouseLeave={e => (e.currentTarget.style.background = '#CC5427')}
            >
              Apply for 2026 Sicily pilot <ArrowDown size={15} />
            </a>

            {/* Secondary */}
            <a
              href="#in-season"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                color: 'rgba(232,225,207,0.75)',
                fontFamily: "'Barlow Semi Condensed', sans-serif",
                fontSize: '15px', fontWeight: 500,
                padding: '12px 20px', borderRadius: '4px',
                border: '1px solid rgba(232,225,207,0.22)',
                textDecoration: 'none',
                transition: 'border-color 200ms, color 200ms',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(232,225,207,0.5)'
                e.currentTarget.style.color = '#E8E1CF'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(232,225,207,0.22)'
                e.currentTarget.style.color = 'rgba(232,225,207,0.75)'
              }}
            >
              See a full season <ArrowDown size={15} />
            </a>

            {/* Demo link */}
            <a
              href="#/demo"
              onClick={e => {
                e.preventDefault()
                window.location.hash = '#/demo'
                window.dispatchEvent(new HashChangeEvent('hashchange'))
              }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                color: 'rgba(232,225,207,0.55)',
                fontFamily: "'Barlow Semi Condensed', sans-serif",
                fontSize: '14px', fontWeight: 400,
                textDecoration: 'none',
                transition: 'color 200ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#CC5427')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,225,207,0.55)')}
            >
              View demo <ArrowRight size={13} />
            </a>
          </div>
        </div>

        {/* Right — Instrument Panel, hidden on mobile */}
        <div className="hidden sb:flex" style={{ flex: '1' }}>
          <div style={{
            border: '1px solid rgba(232,225,207,0.12)',
            padding: '32px',
            display: 'flex', flexDirection: 'column', gap: '0',
            alignSelf: 'center',
            width: '100%',
          }}>
            {/* Panel header */}
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase',
              color: '#CC5427', marginBottom: '28px',
            }}>
              FIELD READINGS · SIC-01
            </div>

            {/* Readings */}
            {instruments.map((inst, i) => (
              <div
                key={inst.code}
                style={{
                  paddingBottom: '20px',
                  borderBottom: i < 2 ? '1px solid rgba(232,225,207,0.1)' : undefined,
                  marginBottom: i < 2 ? '20px' : undefined,
                }}
              >
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'rgba(232,225,207,0.4)', marginBottom: '6px',
                }}>
                  {inst.code}
                </div>
                <div style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '42px', lineHeight: 1,
                  color: '#E8E1CF', letterSpacing: '-0.02em',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {inst.value}{' '}
                  <span style={{ fontSize: '18px', color: 'rgba(232,225,207,0.55)' }}>{inst.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div
        className="relative w-full"
        style={{ borderTop: '1px solid rgba(232,225,207,0.14)', ...anim(580) }}
      >
        <div
          className="mx-auto grid grid-cols-1 sb:grid-cols-3 px-6 sb:px-20"
          style={{ maxWidth: '1280px' }}
        >
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                padding: '24px 0',
                borderLeft: i > 0 ? '1px solid rgba(232,225,207,0.10)' : undefined,
                paddingLeft: i > 0 ? '24px' : undefined,
              }}
            >
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'rgba(232,225,207,0.45)', marginBottom: '6px',
              }}>
                {stat.label}
              </div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontVariantNumeric: 'tabular-nums',
                fontSize: '22px', lineHeight: 1.2,
                color: '#E8E1CF',
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
