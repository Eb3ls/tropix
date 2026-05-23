import { Check } from 'lucide-react'
import { included } from '../../data/pilotData'
import { PilotForm } from '../pilot/PilotForm'

export function Pilot() {
  return (
    <section id="pilot" style={{ background: '#F4EFE3', padding: '96px 0' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px', padding: '0 80px' }}>
        <div className="grid grid-cols-1 sb:grid-cols-2" style={{ gap: '80px', alignItems: 'start' }}>

          {/* Left: pilot info */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div style={{ width: '24px', height: '1px', background: '#D9882B', flexShrink: 0 }} />
              <span style={{ fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500, color: '#524C42' }}>
                SICILY PILOT · 2026 COHORT
              </span>
            </div>

            <h2 style={{ fontFamily: "'Instrument Serif', serif", fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1.08, fontWeight: 400, color: '#0A1410', marginBottom: '20px', textWrap: 'balance' }}>
              Eight farms will have the most precise view of their avocado and mango in Sicily. Yours could be one of them.
            </h2>

            <p style={{ fontSize: '17px', lineHeight: 1.55, color: '#524C42', marginBottom: '16px' }}>
              The 2026 pilot cohort opens to eight avocado or mango farms in Sicily, Calabria, or Puglia. Hardware is on loan. No upfront investment. The annual fee is subsidised for the founding cohort. Three-year contracts begin{' '}
              <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#0A1410' }}>Q2 2026</span>.
            </p>

            <p style={{ fontSize: '14px', lineHeight: 1.55, color: '#A86415', fontWeight: 500, marginBottom: '40px' }}>
              Applications are reviewed in order of receipt. Once the cohort is full, the list closes.
            </p>

            {/* Meta grid */}
            <div className="grid grid-cols-3" style={{ gap: '32px', borderTop: '1px solid #C9BEA6', borderBottom: '1px solid #C9BEA6', padding: '32px 0', marginBottom: '40px' }}>
              {[
                { label: 'COHORT SIZE',      value: '8 farms' },
                { label: 'CONTRACT LENGTH',  value: '3 years' },
                { label: 'MINIMUM SURFACE',  value: '5 ha'    },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7A7363', marginBottom: '4px', fontWeight: 500 }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontVariantNumeric: 'tabular-nums', fontSize: '28px', lineHeight: 1.1, letterSpacing: '-0.02em', color: '#0A1410' }}>
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
        <div style={{ marginTop: '48px', paddingTop: '40px', borderTop: '1px solid #C9BEA6' }}>
          <p style={{ fontSize: '12px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 500, color: '#524C42', marginBottom: '24px' }}>
            Included in the annual fee
          </p>
          <div className="grid grid-cols-2 sb:grid-cols-5" style={{ gap: '16px' }}>
            {included.map(item => (
              <div key={item} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '14px 16px', background: '#FAF6EC', border: '1px solid #C9BEA6', borderRadius: '8px' }}>
                <Check size={16} style={{ color: '#D9882B', flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '13px', lineHeight: 1.5, color: '#524C42' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
