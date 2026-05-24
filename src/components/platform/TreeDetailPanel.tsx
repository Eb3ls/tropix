import { X, Leaf } from 'lucide-react'

// Two canonical data states: the alert tree (idx 62, Tree 63) and generic healthy.
function getTreeData(idx: number) {
  const isAlertTree = idx === 62

  return {
    id:               idx + 1,
    block:            isAlertTree ? 'C' : 'B',
    variety:          'Hass avocado',
    scientificName:   'Persea americana',
    age:              '4.2 years',
    status:           isAlertTree ? ('alert' as const) : ('healthy' as const),
    sapFlow:          isAlertTree ? 47 : 82,
    sapBaseline:      78,
    ndvi:             isAlertTree ? 0.61 : 0.71,
    ndre:             isAlertTree ? 0.44 : 0.54,
    cire:             isAlertTree ? 0.72 : 0.88,
    diseaseRisk:      isAlertTree ? 81 : 32,
    diseaseLevel:     isAlertTree ? ('High' as const) : ('Low' as const),
    action:           isAlertTree
      ? 'Collect soil sample and contact agronomist immediately'
      : 'No action required — schedule routine scouting in 14 days',
  }
}

interface TreeDetailPanelProps {
  treeIdx: number    // 0-indexed
  onClose: () => void
}

export function TreeDetailPanel({ treeIdx, onClose }: TreeDetailPanelProps) {
  const d       = getTreeData(treeIdx)
  const isAlert = d.status === 'alert'

  const statusStyle = {
    alert:      { bg: 'rgba(184,58,46,0.08)', text: '#B83A2E', dot: '#B83A2E', label: 'Alert'      },
    monitoring: { bg: 'rgba(204,84,39,0.08)', text: '#CC5427', dot: '#CC5427', label: 'Monitoring' },
    healthy:    { bg: 'rgba(58,122,78,0.08)', text: '#3A7A4E', dot: '#3A7A4E', label: 'Healthy'    },
  }
  const ss = statusStyle[d.status]

  const riskColor =
    d.diseaseRisk > 60 ? '#B83A2E' :
    d.diseaseRisk > 35 ? '#CC5427' :
    '#3A7A4E'

  return (
    <div
      style={{
        width: '300px',
        flexShrink: 0,
        background: '#F0EADB',
        border: isAlert ? '1px solid rgba(184,58,46,0.2)' : '1px solid #BDB5A0',
        borderLeft: isAlert ? '3px solid #B83A2E' : '1px solid #BDB5A0',
        borderRadius: '4px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header strip */}
      <div
        style={{
          padding: '16px 20px 14px',
          borderBottom: '1px solid #BDB5A0',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#7A7060',
              marginBottom: '3px',
            }}
          >
            Tree {d.id} · Block {d.block}
          </div>
          <div
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: '16px',
              color: '#191E1A',
              lineHeight: 1.2,
              marginBottom: '6px',
            }}
          >
            {d.variety}
          </div>
          <div
            style={{
              fontFamily: "'Barlow Semi Condensed', sans-serif",
              fontSize: '11px',
              color: '#7A7060',
              fontStyle: 'italic',
            }}
          >
            <em>{d.scientificName}</em> · {d.age}
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close tree detail"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            flexShrink: 0,
            background: 'none',
            border: '1px solid #BDB5A0',
            borderRadius: '4px',
            cursor: 'pointer',
            color: '#7A7060',
            transition: 'background 150ms, color 150ms',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#191E1A'
            e.currentTarget.style.color = '#E8E1CF'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'none'
            e.currentTarget.style.color = '#7A7060'
          }}
        >
          <X size={13} aria-hidden="true" />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>

        {/* Status chip */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 10px',
            background: ss.bg,
            borderRadius: '9999px',
            alignSelf: 'flex-start',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: ss.dot,
              display: 'inline-block',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: ss.text,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {ss.label}
          </span>
        </div>

        {/* Sap-flow */}
        <div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#7A7060',
              marginBottom: '6px',
            }}
          >
            Sap-flow today
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '28px',
                fontVariantNumeric: 'tabular-nums',
                color: isAlert ? '#B83A2E' : '#191E1A',
                lineHeight: 1,
              }}
            >
              {d.sapFlow}
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', color: '#7A7060' }}>
              ml/h
            </span>
          </div>
          <div
            style={{
              fontFamily: "'Barlow Semi Condensed', sans-serif",
              fontSize: '11px',
              color: '#7A7060',
              marginTop: '2px',
            }}
          >
            Baseline: {d.sapBaseline} ml/h
            {isAlert && (
              <span style={{ color: '#B83A2E', marginLeft: '6px' }}>
                (−{d.sapBaseline - d.sapFlow} ml/h)
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div aria-hidden="true" style={{ height: '1px', background: '#BDB5A0' }} />

        {/* Multispectral */}
        <div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#7A7060',
              marginBottom: '10px',
            }}
          >
            Multispectral scan
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {[
              { label: 'NDVI', value: d.ndvi.toFixed(2), tip: 'Vegetation index' },
              { label: 'NDRE', value: d.ndre.toFixed(2), tip: 'Red-edge index'   },
              { label: 'CIre', value: d.cire.toFixed(2), tip: 'Chlorophyll'      },
            ].map(m => (
              <div key={m.label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px', color: '#7A7060', marginBottom: '2px' }}>
                  {m.label}
                </div>
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '15px', fontVariantNumeric: 'tabular-nums', color: '#191E1A' }}>
                  {m.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div aria-hidden="true" style={{ height: '1px', background: '#BDB5A0' }} />

        {/* Disease risk */}
        <div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#7A7060',
              marginBottom: '8px',
            }}
          >
            Disease risk
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: '13px', color: riskColor, fontWeight: 500 }}>
              {d.diseaseLevel}
            </span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', fontVariantNumeric: 'tabular-nums', color: riskColor }}>
              {d.diseaseRisk}%
            </span>
          </div>
          <div style={{ height: '6px', background: 'rgba(25,30,26,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${d.diseaseRisk}%`, background: riskColor, borderRadius: '3px' }} />
          </div>
        </div>

        {/* Divider */}
        <div aria-hidden="true" style={{ height: '1px', background: '#BDB5A0' }} />

        {/* Recommended action */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '10px 12px',
            background: isAlert ? 'rgba(184,58,46,0.05)' : 'rgba(58,122,78,0.05)',
            border: `1px solid ${isAlert ? 'rgba(184,58,46,0.15)' : 'rgba(58,122,78,0.15)'}`,
            borderRadius: '4px',
          }}
        >
          <Leaf
            size={14}
            style={{ color: isAlert ? '#B83A2E' : '#3A7A4E', flexShrink: 0, marginTop: '1px' }}
            aria-hidden="true"
          />
          <div
            style={{
              fontFamily: "'Barlow Semi Condensed', sans-serif",
              fontSize: '12px',
              color: isAlert ? '#B83A2E' : '#3A7A4E',
              lineHeight: 1.45,
            }}
          >
            {d.action}
          </div>
        </div>
      </div>
    </div>
  )
}
