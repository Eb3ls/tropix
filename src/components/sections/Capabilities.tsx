import { useEffect, useRef, useState } from 'react'

export function Capabilities() {
  const [visible, setVisible] = useState(false)
  const [count, setCount] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  /* Count-up animation: 0 → 14 over 900ms with ease-out cubic */
  useEffect(() => {
    if (!visible) return
    const TARGET = 14
    const DURATION = 900
    const startTime = performance.now()
    let frameId: number

    const tick = (now: number) => {
      const elapsed = now - startTime
      const t = Math.min(elapsed / DURATION, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.round(eased * TARGET))
      if (t < 1) frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [visible])

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      style={{ background: '#0A1410', padding: '120px 0' }}
    >
      <div className="mx-auto" style={{ maxWidth: '1280px', padding: '0 80px' }}>
        <div className="flex items-center gap-3 mb-5">
          <div style={{ width: '24px', height: '1px', background: '#D9882B', flexShrink: 0 }} />
          <span
            style={{
              fontSize: '12px', letterSpacing: '0.08em',
              textTransform: 'uppercase', fontWeight: 500, color: '#F0C381',
            }}
          >
            WHAT THE PLATFORM ACTUALLY DOES
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 'clamp(36px, 4.5vw, 56px)',
            lineHeight: 1.05, fontWeight: 400, color: '#F4EFE3',
            marginBottom: '16px', maxWidth: '680px', textWrap: 'balance',
          }}
        >
          Numbers that move with the season, not the marketing.
        </h2>
        <p
          style={{
            fontSize: '17px', lineHeight: 1.55,
            color: 'rgba(244, 239, 227, 0.65)',
            maxWidth: '600px', marginBottom: '64px',
          }}
        >
          Pilot accuracy benchmarks measured on Sicilian Hass and Reed avocado
          orchards, 2024–2025 validation set.
        </p>

        {/* Editorial two-column: animated number left, explanation right */}
        <div
          className="grid grid-cols-1 sb:grid-cols-[auto_1fr]"
          style={{
            gap: '64px',
            alignItems: 'center',
            borderTop: '1px solid rgba(244, 239, 227, 0.12)',
            paddingTop: '48px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'none' : 'translateY(20px)',
            transition: 'opacity 480ms cubic-bezier(0.2, 0.7, 0.2, 1), transform 480ms cubic-bezier(0.2, 0.7, 0.2, 1)',
          }}
        >
          {/* Left: animated big number */}
          <div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px', letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#F0C381', marginBottom: '20px',
              }}
            >
              DISEASE DETECTION
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontVariantNumeric: 'tabular-nums',
                  fontSize: 'clamp(80px, 10vw, 128px)',
                  lineHeight: 1, letterSpacing: '-0.03em',
                  color: '#F0C381',
                }}
              >
                {count}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 'clamp(28px, 4vw, 48px)',
                  lineHeight: 1, color: 'rgba(240, 195, 129, 0.55)',
                }}
              >
                days
              </span>
            </div>
          </div>

          {/* Right: explanation */}
          <div style={{ maxWidth: '520px' }}>
            <h4
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: 'italic', fontSize: '28px', lineHeight: 1.2,
                fontWeight: 400, color: '#F4EFE3', marginBottom: '16px',
              }}
            >
              Phytophthora cinnamomi
            </h4>
            <p
              style={{
                fontSize: '17px', lineHeight: 1.65,
                color: 'rgba(244, 239, 227, 0.65)', marginBottom: '24px',
              }}
            >
              Median lead time on root-rot symptoms before visible canopy
              distress. The platform cross-validates multispectral drone
              signatures against per-tree sap-flow anomalies to surface
              the infection before any field scout would find it.
            </p>
            <p
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '12px', lineHeight: 1.6,
                color: 'rgba(244, 239, 227, 0.35)',
              }}
            >
              Measured on Sicilian Hass and Reed orchards · 3 pilot sites
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
