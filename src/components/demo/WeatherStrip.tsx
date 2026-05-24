import { Sun, Cloud, CloudSun } from 'lucide-react'
import { DEMO_WEATHER, type WeatherDay } from '../../data/demoData'

const ICONS: Record<WeatherDay['condition'], React.ReactNode> = {
  'sunny':         <Sun        size={12} aria-hidden="true" />,
  'partly-cloudy': <CloudSun   size={12} aria-hidden="true" />,
  'cloudy':        <Cloud      size={12} aria-hidden="true" />,
}

export function WeatherStrip() {
  return (
    <div style={{ padding: '10px 16px 12px' }}>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: '10px',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'rgba(232,225,207,0.35)',
        marginBottom: '8px',
      }}>
        Weather · Ragusa, SIC
      </div>

      <div style={{ display: 'flex', gap: '4px' }}>
        {DEMO_WEATHER.map(day => (
          <div
            key={day.day}
            style={{
              flex: 1,
              padding: '7px 6px',
              borderRadius: '4px',
              background: day.highlight
                ? 'rgba(204,84,39,0.12)'
                : 'rgba(232,225,207,0.04)',
              border: day.highlight
                ? '1px solid rgba(204,84,39,0.25)'
                : '1px solid rgba(232,225,207,0.07)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '9px',
                color: 'rgba(232,225,207,0.45)',
              }}>
                {day.day}
              </span>
              <span style={{ color: day.highlight ? '#CC5427' : 'rgba(232,225,207,0.45)' }}>
                {ICONS[day.condition]}
              </span>
            </div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '13px',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 700,
              color: day.highlight ? '#CC5427' : '#E8E1CF',
              lineHeight: 1,
            }}>
              {day.tempC}°
            </div>
            {day.note && (
              <div style={{
                fontFamily: "'Barlow Semi Condensed', sans-serif",
                fontSize: '9px',
                color: '#CC5427',
                marginTop: '3px',
                lineHeight: 1.3,
              }}>
                {day.note}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
