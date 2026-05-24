import { Check } from 'lucide-react'
import { included } from '../../data/pilotData'
import { PilotForm } from '../pilot/PilotForm'

export function Pilot() {
  return (
    <section id="pilot" style={{ background: '#E8E1CF', padding: '96px 0' }}>
      <div className="mx-auto px-6 sb:px-20" style={{ maxWidth: '1280px' }}>
        <div className="grid grid-cols-1 sb:grid-cols-2" style={{ gap: '80px', alignItems: 'start' }}>

          {/* Left: pilot info */}
          <div>
            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#CC5427', fontWeight: 500 }}>PIL-06</span>
              <span aria-hidden="true">{' · '}</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#BDB5A0' }}>SOUTH ITALY PILOT · 2026 COHORT</span>
            </div>

            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.08, fontWeight: 400, color: '#191E1A', marginBottom: '20px', textWrap: 'balance' }}>
              Eight farms will have the most precise view of their avocado and mango. Yours could be one of them.
            </h2>

            <p style={{ fontSize: '17px', lineHeight: 1.55, color: '#7A7060', marginBottom: '16px' }}>
              The 2026 pilot cohort opens to eight avocado or mango farms in Sicily, Calabria, or Puglia. Hardware is on loan. No upfront investment. The annual fee is subsidised for the founding cohort. Three-year contracts begin{' '}
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: '#191E1A' }}>Q2 2026</span>.
            </p>

            <p style={{ fontSize: '14px', lineHeight: 1.55, color: '#CC5427', fontWeight: 500, marginBottom: '40px' }}>
              Applications are reviewed in order of receipt. Once the cohort is full, the list closes.
            </p>

            {/* Meta grid */}
            <div className="grid grid-cols-3" style={{ gap: '32px', borderTop: '1px solid #BDB5A0', borderBottom: '1px solid #BDB5A0', padding: '32px 0', marginBottom: '40px' }}>
              {[
                { label: 'COHORT SIZE',      value: '8 farms' },
                { label: 'CONTRACT LENGTH',  value: '3 years' },
                { label: 'MINIMUM SURFACE',  value: '5 ha'    },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A7060', marginBottom: '4px', fontWeight: 500 }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontVariantNumeric: 'tabular-nums', fontSize: '28px', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#191E1A' }}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: form */}
          <div id="apply">
            <PilotForm />
          </div>
        </div>

        {/* Included list */}
        <div style={{ marginTop: '48px', paddingTop: '40px', borderTop: '1px solid #BDB5A0' }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, color: '#7A7060', marginBottom: '24px' }}>
            Included in the annual fee
          </p>
          <div className="grid grid-cols-2 sb:grid-cols-5" style={{ gap: '16px' }}>
            {included.map(item => (
              <div key={item} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '14px 16px', background: '#F0EADB', border: '1px solid #BDB5A0', borderRadius: '4px' }}>
                <Check size={16} style={{ color: '#CC5427', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '13px', lineHeight: 1.5, color: '#7A7060' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
