import type { CSSProperties } from 'react'

export type FormState = 'idle' | 'submitting' | 'success' | 'error'

export const included = [
  'Daily multispectral drone flights during the active season',
  'Sap-flow sensor kit installation on representative trees',
  'Mobile app access (Italian) + multi-farm web dashboard',
  'Quarterly on-site visits from a TropiX agronomist',
  'Public-incentive eligibility check (PNRR, Regione Sicilia)',
]

export const interests = [
  'Disease detection',
  'Irrigation monitoring',
  'Public incentives',
]

export const cultivars = ['Hass', 'Reed', 'Pinkerton', 'Kensington Pride', 'Keitt', 'Mixed/other']

export const inputStyle: CSSProperties = {
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

export const labelStyle: CSSProperties = {
  display: 'block',
  fontSize: '12px',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  fontWeight: 500,
  color: '#524C42',
  marginBottom: '6px',
}
