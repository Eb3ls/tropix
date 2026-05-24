import { useState } from 'react'
import { AlertTriangle, CheckCircle } from 'lucide-react'
import { KpiStrip }        from '../KpiStrip'
import { TreeMap }         from '../TreeMap'
import { TreeDetailPanel } from '../TreeDetailPanel'
import { AlertCard }       from '../AlertCard'
import { SapFlowChart }    from '../SapFlowChart'

export function OrchardView() {
  const [selectedTree, setSelectedTree] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Sticky top bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 32px',
          borderBottom: '1px solid #BDB5A0',
          background: '#E8E1CF',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          flexShrink: 0,
          gap: '16px',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: '20px',
              fontWeight: 400,
              color: '#191E1A',
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            Orchard overview
          </h1>
          <div
            style={{
              fontFamily: "'Barlow Semi Condensed', sans-serif",
              fontSize: '13px',
              color: '#7A7060',
              marginTop: '1px',
            }}
          >
            Az. Agr. Greco · Ragusa · 8.3 ha
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '5px 12px',
              background: 'rgba(184,58,46,0.08)',
              border: '1px solid rgba(184,58,46,0.25)',
              borderRadius: '9999px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              color: '#B83A2E',
            }}
          >
            <AlertTriangle size={11} aria-hidden="true" /> 1 active alert
          </div>
          <div
            style={{
              padding: '5px 12px',
              background: '#F0EADB',
              border: '1px solid #BDB5A0',
              borderRadius: '9999px',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              color: '#7A7060',
            }}
          >
            Last flight: today 06:47
          </div>
        </div>
      </div>

      {/* ── Today's brief banner ── */}
      <div
        style={{
          padding: '10px 32px',
          background: 'rgba(184,58,46,0.05)',
          borderBottom: '1px solid rgba(184,58,46,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0,
        }}
      >
        <AlertTriangle size={14} style={{ color: '#B83A2E', flexShrink: 0 }} aria-hidden="true" />
        <span
          style={{
            fontFamily: "'Barlow Semi Condensed', sans-serif",
            fontSize: '13px',
            color: '#191E1A',
            fontWeight: 500,
          }}
        >
          Today: 1 action required —
        </span>
        <span
          style={{
            fontFamily: "'Barlow Semi Condensed', sans-serif",
            fontSize: '13px',
            color: '#7A7060',
          }}
        >
          Contact agronomist for Tree 47 · Block C before canopy symptoms appear (14-day window)
        </span>
        <div style={{ flex: 1 }} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: '#3A7A4E',
          }}
        >
          <CheckCircle size={11} aria-hidden="true" />
          126 trees healthy
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >

        {/* KPI panel */}
        <KpiStrip />

        {/* Alert card */}
        <AlertCard
          disease="Phytophthora cinnamomi"
          tree={47}
          block="C"
          time="today 07:23"
          description="Cross-validated: multispectral anomaly + sap-flow stress below baseline threshold. 14 days before expected visual canopy symptoms appear."
          daysToAct={14}
        />

        {/* Tree map + detail panel */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <TreeMap selectedTree={selectedTree} onSelectTree={setSelectedTree} />
          </div>
          {selectedTree !== null && (
            <TreeDetailPanel treeIdx={selectedTree} onClose={() => setSelectedTree(null)} />
          )}
        </div>

        {/* Sap-flow chart */}
        <SapFlowChart />

        {/* Bottom spacer */}
        <div style={{ height: '8px' }} />
      </div>
    </div>
  )
}
