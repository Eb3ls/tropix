import { useState } from 'react'
import { Check, ArrowRight } from 'lucide-react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const included = [
  'Multispectral drone flights, every 14 days during the active season',
  'Sap-flow sensor kit installation on representative trees',
  'Mobile app access (Italian) + multi-farm web dashboard',
  'Quarterly on-site visits from a TropiX agronomist',
  'Buyer-portal listing once first yield forecast is generated',
  'Public-incentive eligibility check (PNRR, Regione Sicilia)',
]

const interests = [
  'Disease detection',
  'Yield forecasting',
  'Buyer marketplace',
  'Public incentives',
]

const cultivars = ['Hass', 'Reed', 'Pinkerton', 'Kensington Pride', 'Keitt', 'Mixed/other']

const inputStyle: React.CSSProperties = {
  background: '#F4EFE3',
  border: '1px solid #C9BEA6',
  borderRadius: '8px',
  padding: '12px 14px',
  fontSize: '15px',
  fontFamily: "'Inter Tight', sans-serif",
  color: '#0A1410',
  width: '100%',
  outline: 'none',
  transition: 'border-color 200ms cubic-bezier(0.2, 0.7, 0.2, 1)',
  boxSizing: 'border-box',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '12px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase' as const,
  fontWeight: 500,
  color: '#524C42',
  marginBottom: '6px',
}

export function Pilot() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [formState, setFormState] = useState<FormState>('idle')
  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    farmName: '',
    hectares: '',
    cultivar: '',
    notes: '',
  })

  const set = (k: keyof typeof fields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFields(f => ({ ...f, [k]: e.target.value }))

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState('submitting')
    // TODO: wire to backend (Resend / Supabase / API route)
    await new Promise(r => setTimeout(r, 1000))
    setFormState('success')
  }

  return (
    <section id="pilot" style={{ background: '#F4EFE3', padding: '96px 0' }}>
      <div className="mx-auto" style={{ maxWidth: '1280px', padding: '0 80px' }}>
        <div
          className="grid grid-cols-1 sb:grid-cols-2"
          style={{ gap: '80px', alignItems: 'start' }}
        >
          {/* Left: pilot info */}
          <div>
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
                SICILY PILOT · 2026 COHORT
              </span>
            </div>

            <h2
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: 'clamp(32px, 4vw, 48px)',
                lineHeight: 1.08,
                fontWeight: 400,
                color: '#0A1410',
                marginBottom: '20px',
                textWrap: 'balance',
              }}
            >
              Eight farms. One growing season. Hardware on loan, full reporting
              included.
            </h2>

            <p style={{ fontSize: '17px', lineHeight: 1.55, color: '#524C42', marginBottom: '40px' }}>
              The 2026 cohort opens to eight avocado or mango farms in Sicily,
              Calabria, or Puglia. Three-year contracts begin{' '}
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  color: '#0A1410',
                }}
              >
                Q2 2026
              </span>
              . Pilot fee is subsidised against the seed-stage development cost.
            </p>

            {/* Meta grid */}
            <div
              className="grid grid-cols-2"
              style={{
                gap: '32px',
                borderTop: '1px solid #C9BEA6',
                borderBottom: '1px solid #C9BEA6',
                padding: '32px 0',
                marginBottom: '40px',
              }}
            >
              {[
                { label: 'COHORT SIZE', value: '8 farms' },
                { label: 'CONTRACT LENGTH', value: '3 years' },
                { label: 'MINIMUM SURFACE', value: '5 ha' },
                { label: 'ANNUAL FEE', value: '€10–13k' },
              ].map(item => (
                <div key={item.label}>
                  <div
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: '#7A7363',
                      marginBottom: '4px',
                      fontWeight: 500,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontVariantNumeric: 'tabular-nums',
                      fontSize: '18px',
                      color: '#0A1410',
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Included list */}
            <p
              style={{
                fontSize: '12px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontWeight: 500,
                color: '#524C42',
                marginBottom: '16px',
              }}
            >
              Included in the annual fee
            </p>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {included.map(item => (
                <li key={item} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <Check size={18} style={{ color: '#D9882B', flexShrink: 0, marginTop: '2px' }} />
                  <span style={{ fontSize: '15px', lineHeight: 1.5, color: '#524C42' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: form card */}
          <div id="apply">
            <div
              style={{
                background: '#FAF6EC',
                border: '1px solid #C9BEA6',
                borderRadius: '12px',
                padding: '40px',
                boxShadow: '0 4px 12px -4px rgba(20, 39, 30, 0.16)',
              }}
            >
              {formState === 'success' ? (
                <div style={{ padding: '40px 0', textAlign: 'center' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      border: '1px solid #C9BEA6',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 20px',
                    }}
                  >
                    <Check size={20} style={{ color: '#D9882B' }} />
                  </div>
                  <h3
                    style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontSize: '28px',
                      fontWeight: 400,
                      color: '#0A1410',
                      marginBottom: '12px',
                    }}
                  >
                    Application received
                  </h3>
                  <p style={{ fontSize: '14px', lineHeight: 1.55, color: '#524C42' }}>
                    We'll respond within five business days with next steps or a
                    polite no.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3
                    style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontSize: '32px',
                      fontWeight: 400,
                      color: '#0A1410',
                      marginBottom: '8px',
                    }}
                  >
                    Apply for the pilot
                  </h3>
                  <p style={{ fontSize: '14px', color: '#524C42', marginBottom: '32px' }}>
                    We'll respond within five business days with next steps or a
                    polite no.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Row 1: First + Last name */}
                    <div className="grid grid-cols-2" style={{ gap: '12px' }}>
                      <div>
                        <label style={labelStyle}>First name</label>
                        <input
                          required
                          style={inputStyle}
                          value={fields.firstName}
                          onChange={set('firstName')}
                          onFocus={e => (e.target.style.borderColor = '#D9882B')}
                          onBlur={e => (e.target.style.borderColor = '#C9BEA6')}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Last name</label>
                        <input
                          required
                          style={inputStyle}
                          value={fields.lastName}
                          onChange={set('lastName')}
                          onFocus={e => (e.target.style.borderColor = '#D9882B')}
                          onBlur={e => (e.target.style.borderColor = '#C9BEA6')}
                        />
                      </div>
                    </div>

                    {/* Row 2: Email + Phone */}
                    <div className="grid grid-cols-2" style={{ gap: '12px' }}>
                      <div>
                        <label style={labelStyle}>Email</label>
                        <input
                          required
                          type="email"
                          style={inputStyle}
                          value={fields.email}
                          onChange={set('email')}
                          onFocus={e => (e.target.style.borderColor = '#D9882B')}
                          onBlur={e => (e.target.style.borderColor = '#C9BEA6')}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Phone</label>
                        <input
                          required
                          type="tel"
                          minLength={6}
                          style={inputStyle}
                          value={fields.phone}
                          onChange={set('phone')}
                          onFocus={e => (e.target.style.borderColor = '#D9882B')}
                          onBlur={e => (e.target.style.borderColor = '#C9BEA6')}
                        />
                      </div>
                    </div>

                    {/* Row 3: Farm name */}
                    <div>
                      <label style={labelStyle}>Farm name & municipality</label>
                      <input
                        required
                        style={inputStyle}
                        value={fields.farmName}
                        onChange={set('farmName')}
                        onFocus={e => (e.target.style.borderColor = '#D9882B')}
                        onBlur={e => (e.target.style.borderColor = '#C9BEA6')}
                      />
                    </div>

                    {/* Row 4: Hectares + Cultivar */}
                    <div className="grid grid-cols-2" style={{ gap: '12px' }}>
                      <div>
                        <label style={labelStyle}>Hectares</label>
                        <input
                          required
                          type="number"
                          min="1"
                          step="0.1"
                          style={inputStyle}
                          value={fields.hectares}
                          onChange={set('hectares')}
                          onFocus={e => (e.target.style.borderColor = '#D9882B')}
                          onBlur={e => (e.target.style.borderColor = '#C9BEA6')}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Primary cultivar</label>
                        <select
                          style={{ ...inputStyle, cursor: 'pointer' }}
                          value={fields.cultivar}
                          onChange={set('cultivar')}
                          onFocus={e => (e.target.style.borderColor = '#D9882B')}
                          onBlur={e => (e.target.style.borderColor = '#C9BEA6')}
                        >
                          <option value="">Select cultivar</option>
                          {cultivars.map(c => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Row 5: Primary interest pills */}
                    <div>
                      <label style={labelStyle}>Primary interest</label>
                      <div className="grid grid-cols-2" style={{ gap: '8px' }}>
                        {interests.map(interest => {
                          const checked = selectedInterests.includes(interest)
                          return (
                            <label
                              key={interest}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 12px',
                                border: `1px solid ${checked ? '#D9882B' : '#C9BEA6'}`,
                                borderRadius: '9999px',
                                cursor: 'pointer',
                                background: checked ? 'rgba(217, 136, 43, 0.08)' : '#F4EFE3',
                                transition: 'all 200ms cubic-bezier(0.2, 0.7, 0.2, 1)',
                              }}
                            >
                              <div
                                style={{
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '2px',
                                  border: `1px solid ${checked ? '#D9882B' : '#C9BEA6'}`,
                                  background: checked ? '#D9882B' : 'transparent',
                                  flexShrink: 0,
                                  transition: 'all 200ms cubic-bezier(0.2, 0.7, 0.2, 1)',
                                }}
                              />
                              <input
                                type="checkbox"
                                className="sr-only"
                                checked={checked}
                                onChange={() => toggleInterest(interest)}
                              />
                              <span
                                style={{
                                  fontSize: '13px',
                                  lineHeight: 1.3,
                                  color: checked ? '#A86415' : '#0A1410',
                                }}
                              >
                                {interest}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </div>

                    {/* Row 6: Notes */}
                    <div>
                      <label style={labelStyle}>Anything else we should know</label>
                      <textarea
                        style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                        value={fields.notes}
                        onChange={set('notes')}
                        onFocus={e => (e.target.style.borderColor = '#D9882B')}
                        onBlur={e => (e.target.style.borderColor = '#C9BEA6')}
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={formState === 'submitting'}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        width: '100%',
                        background: formState === 'submitting' ? '#1E3A2D' : '#14271E',
                        color: '#F4EFE3',
                        fontSize: '16px',
                        fontWeight: 500,
                        padding: '16px 24px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: formState === 'submitting' ? 'not-allowed' : 'pointer',
                        transition: 'background 200ms cubic-bezier(0.2, 0.7, 0.2, 1)',
                        fontFamily: "'Inter Tight', sans-serif",
                      }}
                      onMouseEnter={e => {
                        if (formState !== 'submitting')
                          (e.currentTarget as HTMLButtonElement).style.background = '#1E3A2D'
                      }}
                      onMouseLeave={e => {
                        if (formState !== 'submitting')
                          (e.currentTarget as HTMLButtonElement).style.background = '#14271E'
                      }}
                    >
                      {formState === 'submitting' ? 'Sending…' : 'Submit application'}
                      {formState !== 'submitting' && <ArrowRight size={16} />}
                    </button>

                    {formState === 'error' && (
                      <p style={{ fontSize: '13px', color: '#B83A2E', textAlign: 'center' }}>
                        Something went wrong. Please try again or email us directly.
                      </p>
                    )}

                    {/* Footer note */}
                    <p style={{ fontSize: '12px', color: '#7A7363', lineHeight: 1.5 }}>
                      By submitting you authorise TropiX to contact you about the
                      2026 pilot cohort. We don't share your data with third
                      parties.{' '}
                      <a href="#" style={{ color: '#524C42' }}>Privacy policy</a>.
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
