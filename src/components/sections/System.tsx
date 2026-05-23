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
    <section id="system" ref={sectionRef} style={{ background: '#F4EFE3', padding: '96px 0' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px', padding: '0 80px' }}>
        <div className="flex items-center gap-3 mb-5">
          <div style={{ width: '24px', height: '1px', background: '#D9882B', flexShrink: 0 }} />
          <span
            style={{
              fontSize: '12px', letterSpacing: '0.08em',
              textTransform: 'uppercase', fontWeight: 500, color: '#524C42',
            }}
          >
            THE SYSTEM
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 'clamp(36px, 4.5vw, 56px)',
            lineHeight: 1.05, fontWeight: 400, color: '#0A1410',
            marginBottom: '16px', maxWidth: '680px', textWrap: 'balance',
          }}
        >
          Your orchard. Two layers of intelligence, one annual fee.
        </h2>
        <p style={{ fontSize: '17px', lineHeight: 1.55, color: '#524C42', maxWidth: '600px', marginBottom: '48px' }}>
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
                  background: '#FAF6EC',
                  border: '1px solid #C9BEA6',
                  borderLeft: '3px solid #D9882B',
                  borderRadius: '12px',
                  padding: '32px',
                  cursor: 'default',
                  boxShadow: '0 2px 8px -4px rgba(20,39,30,0.08)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'none' : `translateX(${idx === 0 ? '-20px' : '20px'})`,
                  transition: `opacity 560ms ${idx * 80}ms cubic-bezier(0.2,0.7,0.2,1), transform 560ms ${idx * 80}ms cubic-bezier(0.2,0.7,0.2,1), box-shadow 200ms cubic-bezier(0.2,0.7,0.2,1)`,
                }}
                onMouseEnter={e =>
                  ((e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px -8px rgba(20,39,30,0.18)')
                }
                onMouseLeave={e =>
                  ((e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px -4px rgba(20,39,30,0.08)')
                }
              >
                {/* Decorative layer number — large, low opacity, background texture */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    right: '-8px',
                    top: '-12px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 'clamp(72px, 9vw, 110px)',
                    lineHeight: 1,
                    color: 'rgba(217,136,43,0.10)',
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
                    border: '1px solid #C9BEA6', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '20px',
                    background: 'rgba(217,136,43,0.04)',
                  }}
                >
                  <Icon size={22} style={{ color: '#14271E' }} strokeWidth={1.75} />
                </div>

                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '12px', letterSpacing: '0.1em',
                    color: '#A86415', marginBottom: '10px',
                  }}
                >
                  LAYER {layer.number}
                </div>

                <h3
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: '32px', lineHeight: 1.1,
                    fontWeight: 400, color: '#0A1410', marginBottom: '14px',
                  }}
                >
                  {layer.title}
                </h3>

                <p style={{ fontSize: '15px', lineHeight: 1.55, color: '#524C42', marginBottom: '20px' }}>
                  {layer.description}
                </p>

                <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                  {layer.bullets.map((b, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: '14px', lineHeight: 1.5, color: '#524C42',
                        padding: '7px 0',
                        borderTop: '1px solid rgba(201, 190, 166, 0.5)',
                      }}
                    >
                      {layer.italicBullets?.includes(i) ? (
                        <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>{b}</em>
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
