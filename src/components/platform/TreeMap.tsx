import { COLS, ROWS, trees, treeColor } from '../../data/platformData'

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`

interface TreeMapProps {
  selectedTree: number | null
  onSelectTree: (idx: number | null) => void
}

// Only alert and monitoring trees get interactive markers.
// Healthy trees are visible in the aerial photo itself — no dots needed.
const markerTrees = trees.filter(t => t.status === 'alert' || t.status === 'monitoring')

/** Map a 0-indexed tree position to % coordinates on the card. */
function pos(treeId: number): { x: number; y: number } {
  const idx = treeId - 1
  const row = Math.floor(idx / COLS)
  const col = idx % COLS
  // leave 8% padding on each side so markers stay within the card
  const x = 8 + ((col + 0.5) / COLS) * 84
  const y = 10 + ((row + 0.5) / ROWS) * 76
  return { x, y }
}

export function TreeMap({ selectedTree, onSelectTree }: TreeMapProps) {
  const selectedObj = selectedTree !== null ? trees.find(t => t.id - 1 === selectedTree) ?? null : null

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '4px',
        border: '1px solid rgba(189,181,160,0.4)',
        minHeight: '360px',
      }}
    >
      {/* ── Real aerial photograph — show the actual trees ── */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/orchard-aerial.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          filter: 'saturate(0.82) contrast(0.92) brightness(0.88)',
        }}
      />

      {/* Grain texture */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: GRAIN,
          backgroundRepeat: 'repeat',
          backgroundSize: '256px 256px',
          opacity: 0.025,
          mixBlendMode: 'overlay',
          pointerEvents: 'none',
        }}
      />

      {/* Top gradient — keeps header text readable */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '90px',
          background: 'linear-gradient(180deg, rgba(25,30,26,0.82) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Bottom gradient — keeps footer text readable */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '52px',
          background: 'linear-gradient(0deg, rgba(25,30,26,0.72) 0%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* ── Header ── */}
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          padding: '16px 20px',
          zIndex: 2,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#CC5427',
              marginBottom: '2px',
            }}
          >
            MAP-01 · Field view
          </div>
          <div
            style={{
              fontFamily: "'Barlow Semi Condensed', sans-serif",
              fontSize: '12px',
              color: 'rgba(232,225,207,0.72)',
            }}
          >
            <em>Persea americana</em> · Az. Agr. Greco · 8.3 ha
          </div>
        </div>

        {/* Legend — only for the marker types shown */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {[
            { label: 'Monitoring', color: '#CC5427' },
            { label: 'Alert',      color: '#B83A2E' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div
                aria-hidden="true"
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: l.color,
                  boxShadow: '0 0 0 1.5px rgba(240,234,219,0.5)',
                }}
              />
              <span
                style={{
                  fontFamily: "'Barlow Semi Condensed', sans-serif",
                  fontSize: '11px',
                  color: 'rgba(232,225,207,0.82)',
                }}
              >
                {l.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tree markers (alert + monitoring only) ── */}
      {markerTrees.map(tree => {
        const { x, y }   = pos(tree.id)
        const isAlert    = tree.status === 'alert'
        const isSelected = selectedTree === tree.id - 1
        const diameter   = isAlert ? 22 : 15

        return (
          <div
            key={tree.id}
            title={`Tree ${tree.id} · ${tree.status}`}
            onClick={() => onSelectTree(isSelected ? null : tree.id - 1)}
            role="button"
            aria-label={`Tree ${tree.id}, status: ${tree.status}${isSelected ? ', selected' : ''}`}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ')
                onSelectTree(isSelected ? null : tree.id - 1)
            }}
            style={{
              position: 'absolute',
              left:  `${x}%`,
              top:   `${y}%`,
              transform: `translate(-50%, -50%) scale(${isSelected ? 1.45 : 1})`,
              width:  `${diameter}px`,
              height: `${diameter}px`,
              borderRadius: '50%',
              background: treeColor[tree.status],
              border: `2px solid rgba(240,234,219,${isSelected ? 1 : 0.85})`,
              boxShadow: isSelected
                ? `0 0 0 4px rgba(204,84,39,0.55), 0 2px 10px rgba(0,0,0,0.4)`
                : '0 1px 5px rgba(0,0,0,0.45)',
              cursor: 'pointer',
              zIndex: isAlert ? 5 : isSelected ? 6 : 4,
              transition: 'transform 150ms cubic-bezier(0.2,0.7,0.2,1), box-shadow 150ms',
              animation: isAlert ? 'fieldPulse 2s ease-in-out infinite' : 'none',
            }}
          />
        )
      })}

      {/* Selected tree label bubble */}
      {selectedObj && (() => {
        const { x, y } = pos(selectedObj.id)
        return (
          <div
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -200%)',
              background: 'rgba(25,30,26,0.88)',
              color: '#E8E1CF',
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              padding: '3px 8px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              zIndex: 7,
              pointerEvents: 'none',
              letterSpacing: '0.04em',
            }}
          >
            Tree {selectedObj.id} · {selectedObj.status}
          </div>
        )
      })()}

      {/* ── Footer ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '10px 20px',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '10px',
            color: 'rgba(232,225,207,0.55)',
            letterSpacing: '0.04em',
          }}
        >
          127 trees · last flight today 06:47
        </span>
        {selectedTree === null && (
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: 'rgba(232,225,207,0.4)',
              letterSpacing: '0.04em',
            }}
          >
            tap a marker to inspect →
          </span>
        )}
        {selectedTree !== null && (
          <button
            onClick={() => onSelectTree(null)}
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '10px',
              color: 'rgba(232,225,207,0.55)',
              letterSpacing: '0.04em',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'color 150ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E8E1CF')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,225,207,0.55)')}
          >
            × deselect
          </button>
        )}
      </div>

      <style>{`
        @keyframes fieldPulse {
          0%, 100% { box-shadow: 0 1px 5px rgba(0,0,0,0.45), 0 0 0 0   rgba(184,58,46,0.8); }
          50%       { box-shadow: 0 1px 5px rgba(0,0,0,0.45), 0 0 0 12px rgba(184,58,46,0);   }
        }
      `}</style>
    </div>
  )
}
