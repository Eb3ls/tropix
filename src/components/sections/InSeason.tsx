import { useEffect, useRef, useState } from 'react'

const events = [
  {
    timing: 'EVERY DAY',
    heading: 'The drone surveys your orchard.',
    body: 'A multispectral quadcopter completes a full autonomous flight of your orchard before 8am. No operator needed on your end. The data is processed on your local edge unit. It never leaves your property unless you choose to share it.',
    detail: 'Edge compute on-site  ·  no connectivity required',
  },
  {
    timing: 'SAME MORNING',
    heading: 'Anomalies surface within hours.',
    body: 'The edge unit cross-validates multispectral signatures against continuous sap-flow data from sensors on representative trees. Trees that fall outside expected parameters for their age, cultivar, and microclimate are flagged. Trees that look normal stay quiet.',
    detail: 'Per-tree baseline  ·  updated with each flight  ·  microlocal weather reference',
  },
  {
    timing: 'WITHIN 24 HOURS',
    heading: 'You know before the tree shows it.',
    body: (
      <>
        Your phone receives an alert: possible{' '}
        <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
          Phytophthora cinnamomi
        </em>{' '}
        root-zone signature, Tree 47, Block C. You see it before the canopy does. You act before
        the block is compromised. The same event, missed for two more weeks, costs the tree.
      </>
    ),
    detail: 'Italian-language farmer app  ·  iOS + Android  ·  direct link to on-demand agronomist',
  },
]

export function InSeason() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
      },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="in-season"
      ref={sectionRef}
      style={{
        background: '#F4EFE3',
        borderTop: '1px solid #C9BEA6',
        padding: '96px 0',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: '1280px', padding: '0 80px' }}>
        <div className="flex items-center gap-3 mb-5">
          <div style={{ width: '24px', height: '1px', background: '#D9882B', flexShrink: 0 }} />
          <span
            style={{
              fontSize: '12px', letterSpacing: '0.08em',
              textTransform: 'uppercase', fontWeight: 500, color: '#524C42',
            }}
          >
            IN SEASON
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 'clamp(36px, 4.5vw, 56px)',
            lineHeight: 1.05, fontWeight: 400, color: '#0A1410',
            marginBottom: '16px', maxWidth: '720px', textWrap: 'balance',
          }}
        >
          A daily flight cycle. From sensor data to early action.
        </h2>

        <p style={{ fontSize: '17px', lineHeight: 1.55, color: '#524C42', maxWidth: '560px' }}>
          Every day with TropiX follows the same rhythm. Here is what it produces for your farm.
        </p>

        {/* ── Timeline ──────────────────────────────────────────────────── */}
        <div style={{ marginTop: '56px' }}>

          {/* Dot + line row — desktop only */}
          <div
            className="hidden sb:grid"
            style={{
              gridTemplateColumns: 'repeat(3, 1fr)',
              position: 'relative',
              marginBottom: '28px',
            }}
          >
            {/*
              Dots are centered within each column.
              Column centers: 16.67%, 50%, 83.33% from left.
              Line: left=calc(16.67%-4px) (center of dot1 minus radius),
                    right=calc(16.67%-4px) (center of dot3 minus radius, from right edge).
              Timing: line draws 800ms from t=100ms. Dots pop at t=80, 500, 900ms
              — dot i appears just as the line reaches it.
            */}
            <div
              style={{
                position: 'absolute',
                left: 'calc(16.67% - 4px)',
                right: 'calc(16.67% - 4px)',
                top: '3px',
                height: '1px',
                background: 'rgba(201,190,166,0.45)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: '#D9882B',
                  transformOrigin: 'left',
                  transform: visible ? 'scaleX(1)' : 'scaleX(0)',
                  transition: 'transform 800ms 100ms cubic-bezier(0.4,0,0.2,1)',
                }}
              />
            </div>

            {/* Dots — centered within each column */}
            {events.map((_, i) => {
              // dot i appears when the line reaches it
              const dotDelay = [80, 500, 900][i]
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'center' }}>
                  <div
                    style={{
                      width: '8px', height: '8px',
                      borderRadius: '50%',
                      background: '#D9882B',
                      position: 'relative', zIndex: 1,
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'scale(1)' : 'scale(0)',
                      transition: `opacity 200ms ${dotDelay}ms ease, transform 200ms ${dotDelay}ms cubic-bezier(0.2,0.7,0.2,1)`,
                    }}
                  />
                </div>
              )
            })}
          </div>

          {/* Content columns */}
          <div
            className="grid grid-cols-1 sb:grid-cols-3"
            style={{ borderTop: '1px solid #C9BEA6' }}
          >
            {events.map((ev, i) => (
              <div
                key={i}
                className="content-col"
                style={{
                  paddingRight: i < 2 ? '40px' : '0',
                  paddingLeft: i > 0 ? '40px' : '0',
                  paddingTop: '32px',
                  borderLeft: i > 0 ? '1px solid #C9BEA6' : undefined,
                  /* Stagger fade in */
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'none' : 'translateY(18px)',
                  transition: `opacity 520ms ${i * 110}ms cubic-bezier(0.2,0.7,0.2,1), transform 520ms ${i * 110}ms cubic-bezier(0.2,0.7,0.2,1)`,
                }}
              >
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px', letterSpacing: '0.1em',
                    textTransform: 'uppercase', color: '#D9882B',
                    marginBottom: '16px',
                  }}
                >
                  {ev.timing}
                </div>

                <h3
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: '22px', lineHeight: 1.2,
                    fontWeight: 400, color: '#0A1410', marginBottom: '14px',
                  }}
                >
                  {ev.heading}
                </h3>

                <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#524C42', marginBottom: '20px' }}>
                  {ev.body}
                </p>

                <p
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '11px', lineHeight: 1.6, color: '#7A7363',
                    borderTop: '1px solid #C9BEA6', paddingTop: '16px',
                    margin: 0,
                  }}
                >
                  {ev.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: remove column separators when stacked */}
      <style>{`
        @media (max-width: 899px) {
          #in-season .content-col {
            border-left: none !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            border-top: 1px solid #C9BEA6;
          }
          #in-season .content-col:first-child {
            border-top: none;
          }
        }
      `}</style>
    </section>
  )
}
