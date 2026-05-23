import { Radio, Brain, Handshake } from 'lucide-react'

const layers = [
  {
    icon: Radio,
    number: 'LAYER 01',
    title: 'Hardware on the farm',
    description:
      'Quadcopters fly the orchard autonomously. Sap-flow sensors and microlocal IoT weather stations stream continuously from selected trees.',
    bullets: [
      'Multispectral drone, 200 ha / 43 min',
      'Per-tree sap-flow sensors',
      'Microlocal weather stations',
      'Edge compute, no upload required',
    ],
  },
  {
    icon: Brain,
    number: 'LAYER 02',
    title: 'AI intelligence',
    description:
      'Computer vision trained on drupacea, not generic crops. Models recognise the diseases that actually attack Persea and Mangifera — and the metrics that predict their yield.',
    bullets: [
      'Phytophthora cinnamomi early detection',
      'Colletotrichum gloeosporioides (anthracnose)',
      'Per-panicle flower counting',
      'Yield prediction, 6–8 weeks pre-harvest',
    ],
    italicBullets: [0, 1],
  },
  {
    icon: Handshake,
    number: 'LAYER 03',
    title: 'Pre-harvest marketplace',
    description:
      'The yield forecast feeds a buyer portal. Premium restaurants and modern-trade retail negotiate against guaranteed volume before the fruit comes off the tree.',
    bullets: [
      'Verified producer profiles',
      'Pre-harvest volume contracts',
      'On-demand specialist agronomists',
      'Origin-guaranteed buyer routing',
    ],
  },
]

export function System() {
  return (
    <section id="system" style={{ background: '#F4EFE3', padding: '96px 0' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px', padding: '0 80px' }}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div style={{ width: '24px', height: '1px', background: '#D9882B', flexShrink: 0 }} />
          <span
            style={{
              fontSize: '12px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 500,
              color: '#524C42',
            }}
          >
            THE SYSTEM
          </span>
        </div>

        <h2
          style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 'clamp(36px, 4.5vw, 56px)',
            lineHeight: 1.05,
            fontWeight: 400,
            color: '#0A1410',
            marginBottom: '16px',
            maxWidth: '680px',
            textWrap: 'balance',
          }}
        >
          Three layers, one annual fee. Hardware on loan, software always on.
        </h2>
        <p style={{ fontSize: '17px', lineHeight: 1.55, color: '#524C42', maxWidth: '600px', marginBottom: '48px' }}>
          No standalone hardware sales, no per-seat SaaS upsell. A single
          three-year contract covers everything in the orchard — and the
          marketplace that follows it.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sb:grid-cols-3" style={{ gap: '24px' }}>
          {layers.map(layer => {
            const Icon = layer.icon
            return (
              <div
                key={layer.number}
                style={{
                  background: '#FAF6EC',
                  border: '1px solid #C9BEA6',
                  borderRadius: '12px',
                  padding: '32px',
                  transition: 'border-color 200ms cubic-bezier(0.2, 0.7, 0.2, 1)',
                  cursor: 'default',
                }}
                onMouseEnter={e =>
                  ((e.currentTarget as HTMLDivElement).style.borderColor = '#A99E85')
                }
                onMouseLeave={e =>
                  ((e.currentTarget as HTMLDivElement).style.borderColor = '#C9BEA6')
                }
              >
                {/* Icon */}
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    border: '1px solid #C9BEA6',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <Icon size={22} style={{ color: '#14271E' }} strokeWidth={1.75} />
                </div>

                {/* Layer number */}
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '12px',
                    letterSpacing: '0.1em',
                    color: '#A86415',
                    marginBottom: '10px',
                  }}
                >
                  {layer.number}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontSize: '32px',
                    lineHeight: 1.1,
                    fontWeight: 400,
                    color: '#0A1410',
                    marginBottom: '14px',
                  }}
                >
                  {layer.title}
                </h3>

                {/* Description */}
                <p style={{ fontSize: '15px', lineHeight: 1.55, color: '#524C42', marginBottom: '20px' }}>
                  {layer.description}
                </p>

                {/* Bullets */}
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {layer.bullets.map((b, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: '14px',
                        lineHeight: 1.5,
                        color: '#524C42',
                        display: 'flex',
                        gap: '8px',
                      }}
                    >
                      <span style={{ color: '#D9882B', flexShrink: 0 }}>—</span>
                      {layer.italicBullets?.includes(i) ? (
                        <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>{b}</em>
                      ) : (
                        b
                      )}
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
