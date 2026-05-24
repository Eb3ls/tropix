import { type ReactNode } from 'react'
import { Sun, Cloud, CloudSun } from 'lucide-react'
import { DEMO_WEATHER, type WeatherDay } from '../../data/demoData'

const ICONS: Record<WeatherDay['condition'], ReactNode> = {
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
        color: '#7A7060',
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
                ? 'rgba(204,84,39,0.08)'
                : 'rgba(25,30,26,0.03)',
              border: day.highlight
                ? '1px solid rgba(204,84,39,0.25)'
                : '1px solid rgba(189,181,160,0.6)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '9px',
                color: '#7A7060',
              }}>
                {day.day}
              </span>
              <span style={{ color: day.highlight ? '#CC5427' : '#7A7060' }}>
                {ICONS[day.condition]}
              </span>
            </div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '13px',
              fontVariantNumeric: 'tabular-nums',
              fontWeight: 700,
              color: day.highlight ? '#CC5427' : '#191E1A',
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
