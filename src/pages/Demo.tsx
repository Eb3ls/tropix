import { useState, useMemo, useCallback } from 'react'
import { ArrowLeft } from 'lucide-react'
import {
  ALL_PLANTS, INITIAL_INTERVENTIONS,
  type Plant, type Intervention,
} from '../data/demoData'
import { useWindowWidth }    from '../hooks/useWindowWidth'
import { AlertSidebar }      from '../components/demo/AlertSidebar'
import { OrchardMap }        from '../components/demo/OrchardMap'
import { PlantPanel }        from '../components/demo/PlantPanel'
import { MultiActionPanel }  from '../components/demo/MultiActionPanel'

// Grain overlay (same as landing Hero)
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

const DESKTOP_MIN = 900

type RightPanel =
  | { kind: 'plant';  plant:  Plant }
  | { kind: 'action'; action: Intervention }
  | { kind: 'none' }

export function Demo() {
  const windowWidth = useWindowWidth()
  const isMobile    = windowWidth < DESKTOP_MIN

  const [interventions, setInterventions] = useState<Intervention[]>(INITIAL_INTERVENTIONS)
  const [rightPanel,    setRightPanel]    = useState<RightPanel>({ kind: 'none' })
  const [treatedIds,    setTreatedIds]    = useState<Set<number>>(new Set())

  // ── Derived ──────────────────────────────────────────────────────────────
  const selectedId = rightPanel.kind === 'plant' ? rightPanel.plant.gridIndex : null

  const highlightedIds = useMemo<Set<number>>(() => {
    if (rightPanel.kind === 'action') {
      return new Set(rightPanel.action.plantIds)
    }
    return new Set()
  }, [rightPanel])

  const alertCount  = ALL_PLANTS.filter(p => p.status === 'alert').length
  const urgentCount = interventions.filter(i => (i.priority === 'urgent' || i.priority === 'high') && !i.done).length

  // ── Handlers ─────────────────────────────────────────────────────────────
  const handleTreeClick = useCallback((plant: Plant) => {
    setRightPanel(prev =>
      prev.kind === 'plant' && prev.plant.gridIndex === plant.gridIndex
        ? { kind: 'none' }
        : { kind: 'plant', plant }
    )
  }, [])

  const handleAlertClick = useCallback((plant: Plant) => {
    setRightPanel({ kind: 'plant', plant })
  }, [])

  const handleActionClick = useCallback((action: Intervention) => {
    if (action.plantCount === 1) {
      const plant = ALL_PLANTS.find(p => p.gridIndex === action.plantIds[0])
      if (plant) setRightPanel({ kind: 'plant', plant })
    } else {
      setRightPanel(prev =>
        prev.kind === 'action' && prev.action.id === action.id
          ? { kind: 'none' }
          : { kind: 'action', action }
      )
    }
  }, [])

  const handleMarkTreated = useCallback((gridIndex: number) => {
    setTreatedIds(prev => new Set([...prev, gridIndex]))
    setInterventions(prev =>
      prev.map(i => i.plantIds.includes(gridIndex) ? { ...i, done: true } : i)
    )
  }, [])

  const handleMarkAllDone = useCallback((action: Intervention) => {
    setTreatedIds(prev => new Set([...prev, ...action.plantIds]))
    setInterventions(prev => prev.map(i => i.id === action.id ? { ...i, done: true } : i))
    setRightPanel({ kind: 'none' })
  }, [])

  const handleReset = useCallback(() => {
    setInterventions(INITIAL_INTERVENTIONS)
    setRightPanel({ kind: 'none' })
    setTreatedIds(new Set())
  }, [])

  const goBack = (e: React.MouseEvent) => {
    e.preventDefault()
    window.location.hash = ''
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }

  // ── Mobile gate ───────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div style={{
        height: '100vh',
        background: '#191E1A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: "'Barlow Semi Condensed', sans-serif",
      }}>
        <div style={{ maxWidth: '340px', textAlign: 'center' }}>
          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '22px',
            color: '#E8E1CF',
            marginBottom: '28px',
          }}>
            Tropi<em style={{ color: '#CC5427', fontStyle: 'italic' }}>X</em>
          </div>

          <div style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '20px',
            color: '#E8E1CF',
            lineHeight: 1.35,
            marginBottom: '14px',
          }}>
            This demo is designed for desktop.
          </div>

          <div style={{
            fontSize: '14px',
            color: 'rgba(232,225,207,0.55)',
            lineHeight: 1.6,
            marginBottom: '28px',
          }}>
            Open it on a laptop or desktop to explore the full platform with the interactive orchard map.
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a
              href="#pilot"
              onClick={e => { e.preventDefault(); window.location.hash = 'pilot'; window.dispatchEvent(new HashChangeEvent('hashchange')) }}
              style={{
                display: 'block',
                padding: '11px 20px',
                background: '#CC5427',
                color: '#F0EADB',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 500,
                textDecoration: 'none',
                transition: 'background 150ms',
              }}
            >
              Request pilot access →
            </a>
            <a
              href="#"
              onClick={goBack}
              style={{
                display: 'block',
                padding: '10px 20px',
                border: '1px solid rgba(232,225,207,0.2)',
                color: 'rgba(232,225,207,0.55)',
                borderRadius: '4px',
                fontSize: '14px',
                textDecoration: 'none',
              }}
            >
              ← Back to site
            </a>
          </div>
        </div>
      </div>
    )
  }

  // ── Cockpit ───────────────────────────────────────────────────────────────
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
      background: '#E8E1CF',
      fontFamily: "'Barlow Semi Condensed', sans-serif",
    }}>

      {/* ── Header ── */}
      <header style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: '52px',
        flexShrink: 0,
        background: '#F0EADB',
        borderBottom: '1px solid #BDB5A0',
        zIndex: 20,
      }}>
        {/* Grain */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0,
          backgroundImage: GRAIN, backgroundSize: '256px 256px',
          opacity: 0.04, mixBlendMode: 'multiply', pointerEvents: 'none',
        }} />

        {/* Left: wordmark + farm name + KPI chips */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '20px', color: '#191E1A', fontWeight: 400 }}>
            Tropi<em style={{ color: '#CC5427', fontStyle: 'italic' }}>X</em>
          </span>

          <div aria-hidden="true" style={{ width: '1px', height: '18px', background: '#BDB5A0' }} />

          <span style={{ fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: '12px', color: '#7A7060' }}>
            Az. Agr. Greco · Ragusa, Sicilia · 8.3 ha
          </span>

          {/* KPI chips */}
          {[
            { label: '120 trees',            color: undefined            },
            { label: `${alertCount} alerts`,  color: alertCount > 0  ? '#B83A2E' : undefined },
            { label: `${urgentCount} urgent`, color: urgentCount > 0 ? '#CC5427' : undefined },
          ].map(chip => (
            <span key={chip.label} style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: chip.color ?? '#BDB5A0',
              letterSpacing: '0.06em',
            }}>
              {chip.label}
            </span>
          ))}

          {/* DEMO badge */}
          <span style={{
            padding: '2px 7px',
            borderRadius: '4px',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.09em',
            fontWeight: 700,
            background: 'rgba(204,84,39,0.15)',
            border: '1px solid rgba(204,84,39,0.3)',
            color: '#CC5427',
          }}>
            DEMO
          </span>
        </div>

        {/* Right: Reset + Back */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={handleReset}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: "'IBM Plex Mono', monospace", fontSize: '10px',
              letterSpacing: '0.08em', color: '#BDB5A0',
              transition: 'color 180ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#546357')}
            onMouseLeave={e => (e.currentTarget.style.color = '#BDB5A0')}
          >
            RESET
          </button>

          <a
            href="#"
            onClick={goBack}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              fontFamily: "'Barlow Semi Condensed', sans-serif", fontSize: '12px',
              color: '#7A7060', textDecoration: 'none',
              transition: 'color 200ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#191E1A')}
            onMouseLeave={e => (e.currentTarget.style.color = '#7A7060')}
          >
            <ArrowLeft size={13} aria-hidden="true" /> Back to site
          </a>
        </div>
      </header>

      {/* ── Body: sidebar + map + optional overlay panel ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>

        {/* Left sidebar */}
        <AlertSidebar
          plants={ALL_PLANTS}
          interventions={interventions}
          selectedId={selectedId}
          highlightedIds={highlightedIds}
          treatedIds={treatedIds}
          onAlertClick={handleAlertClick}
          onActionClick={handleActionClick}
        />

        {/* Center map */}
        <OrchardMap
          plants={ALL_PLANTS}
          selectedId={selectedId}
          highlightedIds={highlightedIds}
          treatedIds={treatedIds}
          onTreeClick={handleTreeClick}
        />

        {/* Right panel — overlays the map */}
        {rightPanel.kind !== 'none' && (
          <div style={{
            position: 'absolute',
            right: 0, top: 0, bottom: 0,
            zIndex: 15,
            display: 'flex',
          }}>
            {/* Backdrop */}
            <div
              onClick={() => setRightPanel({ kind: 'none' })}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(25,30,26,0.25)',
                zIndex: -1,
              }}
            />

            {rightPanel.kind === 'plant' && (
              <PlantPanel
                plant={rightPanel.plant}
                treated={treatedIds.has(rightPanel.plant.gridIndex)}
                overdue={interventions.some(i => i.plantIds.includes(rightPanel.plant.gridIndex) && i.overdue && !i.done)}
                onClose={() => setRightPanel({ kind: 'none' })}
                onMarkTreated={() => handleMarkTreated(rightPanel.plant.gridIndex)}
              />
            )}

            {rightPanel.kind === 'action' && (
              <MultiActionPanel
                intervention={rightPanel.action}
                plants={ALL_PLANTS}
                treatedIds={treatedIds}
                onClose={() => setRightPanel({ kind: 'none' })}
                onMarkAllDone={() => handleMarkAllDone(rightPanel.action)}
                onTreeClick={plant => setRightPanel({ kind: 'plant', plant })}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}
