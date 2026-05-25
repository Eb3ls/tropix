import { useEffect, useRef, useState } from 'react'

const founders = [
  { initial: 'F', name: 'Founder One',   role: 'AI / Computer Vision' },
  { initial: 'F', name: 'Founder Two',   role: 'AI / Machine Learning' },
  { initial: 'F', name: 'Founder Three', role: 'AI / Software Engineering' },
  { initial: 'F', name: 'Founder Four',  role: 'Industrial Engineering' },
  { initial: 'F', name: 'Founder Five',  role: 'Computer Science' },
]

export function Team() {
  const [visible, setVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); observer.disconnect() }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="team"
      ref={sectionRef}
      style={{
        background: '#E8E1CF',
        borderTop: '1px solid #BDB5A0',
        padding: '96px 0',
      }}
    >
      <div className="mx-auto px-6 sb:px-20" style={{ maxWidth: '1280px' }}>
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#CC5427', fontWeight: 500 }}>TEM-07</span>
          <span aria-hidden="true">{' · '}</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#BDB5A0' }}>THE TEAM</span>
        </div>

        <p style={{ fontSize: '17px', lineHeight: 1.55, color: '#7A7060', maxWidth: '560px', marginBottom: '56px' }}>
          Five founders: three AI software engineers, one industrial engineer,
          one computer-science student. Seed round in progress.
        </p>

        {/* Team grid — staggered entry */}
        <div className="grid grid-cols-2 sb:grid-cols-5" style={{ gap: '16px' }}>
          {founders.map((f, i) => (
            <div
              key={i}
              style={{
                background: '#F0EADB',
                border: '1px solid #BDB5A0',
                borderTop: '2px solid #CC5427',
                borderRadius: '4px',
                padding: '20px',
                opacity: visible ? 1 : 0,
                transform: visible ? 'none' : 'translateY(16px)',
                transition: `opacity 460ms ${i * 60}ms cubic-bezier(0.2,0.7,0.2,1), transform 460ms ${i * 60}ms cubic-bezier(0.2,0.7,0.2,1)`,
              }}
            >
              {/* Avatar placeholder with gradient */}
              <div
                style={{
                  aspectRatio: '1',
                  background: 'linear-gradient(135deg, #191E1A 0%, #2A3330 100%)',
                  borderRadius: '4px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                <span
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontStyle: 'normal', fontSize: '36px',
                    color: '#CC5427', lineHeight: 1,
                  }}
                >
                  {f.initial}
                </span>
              </div>
              <div style={{ fontSize: '15px', fontWeight: 600, color: '#191E1A', marginBottom: '4px' }}>
                {f.name}
              </div>
              <div style={{ fontSize: '12px', color: '#7A7060' }}>{f.role}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
