import { useRef, useEffect, useState } from 'react'

const challenges = [
  {
    number: '01',
    tag: 'DISEASE DETECTION',
    title: 'Root rot is silent.',
    body: (
      <>
        <em style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic' }}>
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
        background: '#E8E1CF',
        borderTop: '1px solid #BDB5A0',
        borderBottom: '1px solid #BDB5A0',
        padding: '96px 0',
      }}
    >
      <div className="mx-auto px-6 sb:px-20" style={{ maxWidth: '1280px' }}>
        <div style={{ marginBottom: '24px' }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#CC5427', fontWeight: 500,
          }}>
            PRB-01
          </span>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#BDB5A0',
          }}>
            <span aria-hidden="true">{' · '}</span>THE CHALLENGE
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(36px, 4.5vw, 56px)',
            lineHeight: 1.05, fontWeight: 400, color: '#191E1A',
            marginBottom: '20px', maxWidth: '720px', textWrap: 'balance',
          }}
        >
          Avocado and mango in the Mediterranean ask questions generic AgriTech
          has never faced.
        </h2>

        <p style={{ fontSize: '19px', lineHeight: 1.5, color: '#7A7060', maxWidth: '580px' }}>
          Converting citrus land to tropical fruit is a calculated risk. The
          problems are crop-specific. Platforms built for European cereals and
          vineyards were not designed for{' '}
          <em style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic' }}>Persea</em>{' '}
          or{' '}
          <em style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic' }}>Mangifera</em>.
        </p>

        {/* Asymmetric grid — primary challenge gets more space */}
        <div
          className="grid grid-cols-1 sb:grid-cols-[11fr_9fr]"
          style={{ marginTop: '56px', borderTop: '1px solid #BDB5A0', paddingTop: '48px' }}
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
                borderLeft: i === 1 ? '1px solid #BDB5A0' : undefined,
              }}
            >
              {/* Decorative background number — pure texture, not readable */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  right: i === 0 ? '-12px' : '-4px',
                  bottom: '-24px',
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 'clamp(100px, 14vw, 180px)',
                  lineHeight: 1,
                  color: 'rgba(189, 181, 160, 0.28)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  letterSpacing: '-0.04em',
                }}
              >
                {c.number}
              </div>

              <div
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: '11px', letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: '#CC5427',
                  marginBottom: '16px',
                }}
              >
                {c.tag}
              </div>

              <h3
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontStyle: 'italic', fontSize: '28px', lineHeight: 1.1,
                  fontWeight: 400, color: '#191E1A', marginBottom: '16px',
                }}
              >
                {c.title}
              </h3>

              <p style={{ fontSize: '15px', lineHeight: 1.65, color: '#7A7060', margin: 0 }}>
                {c.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
