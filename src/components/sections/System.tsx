import { useRef, useEffect, useState } from 'react'
import { Radio, Brain } from 'lucide-react'

const layers = [
  {
    icon: Radio,
    number: '01',
    title: 'Hardware on the farm',
    description:
      'A multispectral drone surveys your full orchard every day, fully autonomous. No operator needed on your end. Per-tree sap-flow sensors stream water-use data continuously. A microlocal weather station at field level, not a regional average.',
    bullets: [
      'Per-tree sap-flow sensors',
      'Microlocal weather stations',
      'Edge compute, no upload required',
    ],
  },
  {
    icon: Brain,
    number: '02',
    title: 'AI intelligence',
    description:
      'Computer vision trained on avocado and mango specifically. Not approximated from vine or citrus data. The platform recognises the diseases that actually threaten your trees and monitors individual-tree health metrics day by day.',
    bullets: [
      'Phytophthora cinnamomi early detection',
      'Colletotrichum gloeosporioides (anthracnose)',
      'Per-tree sap-flow anomaly detection',
      'Daily disease-risk scoring per tree',
    ],
    italicBullets: [0, 1],
  },
]

export function System() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="system" ref={sectionRef} style={{ background: '#E8E1CF', padding: '96px 0' }}>
      <div className="mx-auto px-6 sb:px-20" style={{ maxWidth: '1280px' }}>
        <div style={{ marginBottom: '24px' }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#CC5427', fontWeight: 500,
          }}>
            SYS-02
          </span>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase',
            color: '#BDB5A0',
          }}>
            <span aria-hidden="true">{' · '}</span>THE SYSTEM
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(36px, 4.5vw, 56px)',
            lineHeight: 1.05, fontWeight: 400, color: '#191E1A',
            marginBottom: '16px', maxWidth: '680px', textWrap: 'balance',
          }}
        >
          Your orchard. Two layers of intelligence, one annual fee.
        </h2>
        <p style={{ fontSize: '17px', lineHeight: 1.55, color: '#7A7060', maxWidth: '600px', marginBottom: '48px' }}>
          Hardware is provided on loan. There is no upfront purchase. A single
          three-year contract covers everything in the field.
        </p>

        <div className="grid grid-cols-1 sb:grid-cols-2" style={{ gap: '32px' }}>
          {layers.map((layer, idx) => {
            const Icon = layer.icon
            return (
              <div
                key={layer.number}
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  background: '#F0EADB',
                  border: '1px solid #BDB5A0',
                  borderLeft: '2px solid #CC5427',
                  borderRadius: '4px',
                  padding: '32px',
                  cursor: 'default',
                  boxShadow: '0 1px 2px rgba(25, 30, 26, 0.08)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'none' : `translateX(${idx === 0 ? '-20px' : '20px'})`,
                  transition: `opacity 560ms ${idx * 80}ms cubic-bezier(0.2,0.7,0.2,1), transform 560ms ${idx * 80}ms cubic-bezier(0.2,0.7,0.2,1), box-shadow 200ms cubic-bezier(0.2,0.7,0.2,1)`,
                }}
                onMouseEnter={e =>
                  ((e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 12px -4px rgba(25, 30, 26, 0.16)')
                }
                onMouseLeave={e =>
                  ((e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 2px rgba(25, 30, 26, 0.08)')
                }
              >
                {/* Decorative layer number — large, low opacity, background texture */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    right: '-8px',
                    top: '-12px',
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 'clamp(72px, 9vw, 110px)',
                    lineHeight: 1,
                    color: 'rgba(204, 84, 39, 0.07)',
                    letterSpacing: '-0.06em',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  }}
                >
                  {layer.number}
                </div>

                <div
                  style={{
                    width: '48px', height: '48px',
                    border: '1px solid #BDB5A0', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '20px',
                    background: 'rgba(204, 84, 39, 0.03)',
                  }}
                >
                  <Icon size={22} style={{ color: '#191E1A' }} strokeWidth={1.75} />
                </div>

                <div
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: '12px', letterSpacing: '0.1em',
                    color: '#CC5427', marginBottom: '10px',
                  }}
                >
                  LAYER {layer.number}
                </div>

                <h3
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: '32px', lineHeight: 1.1,
                    fontWeight: 400, color: '#191E1A', marginBottom: '14px',
                  }}
                >
                  {layer.title}
                </h3>

                <p style={{ fontSize: '15px', lineHeight: 1.55, color: '#7A7060', marginBottom: '20px' }}>
                  {layer.description}
                </p>

                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {layer.bullets.map((b, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: '14px', lineHeight: 1.5, color: '#7A7060',
                        padding: '7px 0',
                        borderTop: '1px solid rgba(189, 181, 160, 0.5)',
                      }}
                    >
                      {layer.italicBullets?.includes(i) ? (
                        <em style={{ fontFamily: "'DM Serif Display', serif", fontStyle: 'italic' }}>{b}</em>
                      ) : b}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
