import { AlertTriangle, Phone } from 'lucide-react'

interface AlertCardProps {
  disease: string
  tree: number
  block: string
  time: string
  description: string
  daysToAct?: number
}

export function AlertCard({ disease, tree, block, time, description, daysToAct = 14 }: AlertCardProps) {
  return (
    <div
      style={{
        background: '#F0EADB',
        border: '1px solid rgba(184,58,46,0.18)',
        borderLeft: '3px solid #B83A2E',
        borderRadius: '4px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '38px',
          height: '38px',
          background: 'rgba(184,58,46,0.08)',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '2px',
        }}
      >
        <AlertTriangle size={18} style={{ color: '#B83A2E' }} strokeWidth={1.75} aria-hidden="true" />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Eyebrow */}
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#B83A2E',
            marginBottom: '6px',
          }}
        >
          CRITICAL · TREE {tree} · BLOCK {block}
        </div>

        {/* Title */}
        <div
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontStyle: 'italic',
            fontSize: '18px',
            color: '#191E1A',
            marginBottom: '8px',
            lineHeight: 1.25,
          }}
        >
          <em>{disease}</em> root-zone signature detected
        </div>

        {/* Body */}
        <div
          style={{
            fontFamily: "'Barlow Semi Condensed', sans-serif",
            fontSize: '13px',
            color: '#7A7060',
            lineHeight: 1.55,
            marginBottom: '10px',
          }}
        >
          {description}
        </div>

        {/* Footer row: timestamp + urgency */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              color: '#BDB5A0',
            }}
          >
            Detected {time} · Confidence: high
          </div>
          {/* Days-to-act badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '2px 8px',
              background: 'rgba(184,58,46,0.08)',
              border: '1px solid rgba(184,58,46,0.22)',
              borderRadius: '9999px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: '#B83A2E',
              letterSpacing: '0.06em',
            }}
          >
            Act within {daysToAct} days · before canopy symptoms appear
          </div>
        </div>
      </div>

      {/* CTA — prominent emergency action */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            background: '#B83A2E',
            color: '#F0EADB',
            fontFamily: "'Barlow Semi Condensed', sans-serif",
            fontSize: '13px',
            fontWeight: 600,
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'background 150ms',
            letterSpacing: '0.01em',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#9A2E23')}
          onMouseLeave={e => (e.currentTarget.style.background = '#B83A2E')}
        >
          <Phone size={13} aria-hidden="true" /> Call agronomist
        </button>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '7px 18px',
            background: 'transparent',
            color: '#7A7060',
            fontFamily: "'Barlow Semi Condensed', sans-serif",
            fontSize: '12px',
            fontWeight: 400,
            borderRadius: '4px',
            border: '1px solid #BDB5A0',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'border-color 150ms, color 150ms',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#7A7060'
            e.currentTarget.style.color = '#191E1A'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#BDB5A0'
            e.currentTarget.style.color = '#7A7060'
          }}
        >
          View full report →
        </button>
      </div>
    </div>
  )
}
