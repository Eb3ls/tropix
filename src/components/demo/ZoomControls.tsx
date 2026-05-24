import { Plus, Minus, Crosshair } from 'lucide-react'

interface Props {
  zoom: number
  minZoom: number
  maxZoom: number
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
}

const btnStyle = (disabled: boolean): React.CSSProperties => ({
  width: '28px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(25,30,26,0.75)',
  border: '1px solid rgba(232,225,207,0.15)',
  borderRadius: '4px',
  cursor: disabled ? 'default' : 'pointer',
  color: disabled ? 'rgba(232,225,207,0.2)' : 'rgba(232,225,207,0.7)',
  backdropFilter: 'blur(4px)',
  transition: 'background 150ms, color 150ms',
})

export function ZoomControls({ zoom, minZoom, maxZoom, onZoomIn, onZoomOut, onReset }: Props) {
  return (
    <div style={{
      position: 'absolute',
      bottom: '16px',
      right: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      zIndex: 10,
    }}>
      <button
        onClick={onZoomIn}
        disabled={zoom >= maxZoom}
        aria-label="Zoom in"
        style={btnStyle(zoom >= maxZoom)}
        onMouseEnter={e => { if (zoom < maxZoom) e.currentTarget.style.background = 'rgba(25,30,26,0.95)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(25,30,26,0.75)' }}
      >
        <Plus size={13} aria-hidden="true" />
      </button>

      <button
        onClick={onZoomOut}
        disabled={zoom <= minZoom}
        aria-label="Zoom out"
        style={btnStyle(zoom <= minZoom)}
        onMouseEnter={e => { if (zoom > minZoom) e.currentTarget.style.background = 'rgba(25,30,26,0.95)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(25,30,26,0.75)' }}
      >
        <Minus size={13} aria-hidden="true" />
      </button>

      <button
        onClick={onReset}
        disabled={zoom === 1}
        aria-label="Reset zoom"
        style={btnStyle(zoom === 1)}
        onMouseEnter={e => { if (zoom !== 1) e.currentTarget.style.background = 'rgba(25,30,26,0.95)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(25,30,26,0.75)' }}
      >
        <Crosshair size={13} aria-hidden="true" />
      </button>

      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '9px',
        color: 'rgba(232,225,207,0.3)',
        textAlign: 'center',
        paddingTop: '2px',
      }}>
        {Math.round(zoom * 100)}%
      </div>
    </div>
  )
}
