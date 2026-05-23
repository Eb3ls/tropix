import { useRef, useEffect, useState } from 'react'

const challenges = [
  {
    number: '01',
    tag: 'DISEASE DETECTION',
    title: 'Root rot is silent.',
    body: (
      <>
        <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>
          Phytophthora cinnamomi
        </em>{' '}
        establishes in the root zone weeks before canopy stress is visible. By the time a tree
        drops fruit early or leaves begin to yellow, root damage is often irreversible. Standard
        scouting catches it too late. Generic AgriTech platforms have no model for drupacea
        root-rot dynamics.
      </>
    ),
  },
  {
    number: '02',
    tag: 'IRRIGATION PRECISION',
    title: 'Blanket schedules cost trees.',
    body: 'Avocado roots are acutely sensitive to both under- and overwatering. Water demand varies at the individual-tree level by root depth, soil composition, and microclimate exposure. Uniform irrigation schedules applied field-wide do not account for this variation. The damage accumulates silently over weeks before it becomes visible.',
  },
]

export function Challenge() {
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

  const cardAnim = (i: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : 'translateY(24px)',
    transition: `opacity 520ms ${i * 120}ms cubic-bezier(0.2,0.7,0.2,1), transform 520ms ${i * 120}ms cubic-bezier(0.2,0.7,0.2,1)`,
  })

  return (
    <section
      id="challenge"
      ref={sectionRef}
      style={{
        background: '#EBE4D2',
        borderTop: '1px solid #C9BEA6',
        borderBottom: '1px solid #C9BEA6',
        padding: '96px 0',
      }}
    >
      <div className="mx-auto" style={{ maxWidth: '1280px', padding: '0 80px' }}>
        <div className="flex items-center gap-3 mb-5">
          <div style={{ width: '24px', height: '1px', background: '#D9882B', flexShrink: 0 }} />
          <span
            style={{
              fontSize: '12px', letterSpacing: '0.08em',
              textTransform: 'uppercase', fontWeight: 500, color: '#A86415',
            }}
          >
            THE CHALLENGE
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 'clamp(36px, 4.5vw, 56px)',
            lineHeight: 1.05, fontWeight: 400, color: '#0A1410',
            marginBottom: '20px', maxWidth: '720px', textWrap: 'balance',
          }}
        >
          Avocado and mango in the Mediterranean ask questions generic AgriTech
          has never faced.
        </h2>

        <p style={{ fontSize: '19px', lineHeight: 1.5, color: '#524C42', maxWidth: '580px' }}>
          Converting citrus land to tropical fruit is a calculated risk. The
          problems are crop-specific. Platforms built for European cereals and
          vineyards were not designed for{' '}
          <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>Persea</em>{' '}
          or{' '}
          <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>Mangifera</em>.
        </p>

        {/* Asymmetric grid — primary challenge gets more space */}
        <div
          className="grid grid-cols-1 sb:grid-cols-[11fr_9fr]"
          style={{ marginTop: '56px', borderTop: '1px solid #C9BEA6', paddingTop: '48px' }}
        >
          {challenges.map((c, i) => (
            <div
              key={c.tag}
              style={{
                ...cardAnim(i),
                position: 'relative',
                overflow: 'hidden',
                paddingRight: i === 0 ? '48px' : '0',
                paddingLeft: i === 1 ? '48px' : '0',
                borderLeft: i === 1 ? '1px solid #C9BEA6' : undefined,
              }}
            >
              {/* Decorative background number — pure texture, not readable */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  right: i === 0 ? '-12px' : '-4px',
                  bottom: '-24px',
                  fontFamily: "'Instrument Serif', serif",
                  fontSize: 'clamp(100px, 14vw, 180px)',
                  lineHeight: 1,
                  color: 'rgba(201,190,166,0.28)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  letterSpacing: '-0.04em',
                }}
              >
                {c.number}
              </div>

              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '11px', letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: '#A86415',
                  marginBottom: '16px',
                }}
              >
                {c.tag}
              </div>

              <h3
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: 'italic', fontSize: '28px', lineHeight: 1.1,
                  fontWeight: 400, color: '#0A1410', marginBottom: '16px',
                }}
              >
                {c.title}
              </h3>

              <p style={{ fontSize: '15px', lineHeight: 1.65, color: '#524C42', margin: 0 }}>
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
