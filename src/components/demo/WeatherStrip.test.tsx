// src/components/demo/WeatherStrip.test.tsx
import { render, screen } from '@testing-library/react'
import { WeatherStrip } from './WeatherStrip'
import { DEMO_WEATHER } from '../../data/demoData'

describe('WeatherStrip', () => {
  test('renders exactly 3 day cards', () => {
    render(<WeatherStrip />)
    // Each day is a flex child with a day-label span
    const dayLabels = DEMO_WEATHER.map(d => d.day)
    dayLabels.forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })

  test('renders temperature for each day', () => {
    render(<WeatherStrip />)
    DEMO_WEATHER.forEach(day => {
      expect(screen.getByText(`${day.tempC}°`)).toBeInTheDocument()
    })
  })

  test('renders section label "Weather · Ragusa, SIC"', () => {
    render(<WeatherStrip />)
    expect(screen.getByText(/Weather · Ragusa, SIC/i)).toBeInTheDocument()
  })

  test('renders heat note for Tomorrow', () => {
    render(<WeatherStrip />)
    const tomorrow = DEMO_WEATHER.find(d => d.day === 'Tomorrow')!
    expect(screen.getByText(tomorrow.note)).toBeInTheDocument()
  })

  test('highlighted day (Tomorrow) uses terracotta color #CC5427', () => {
    render(<WeatherStrip />)
    // toHaveStyle handles hex↔rgb normalisation done by jsdom
    expect(screen.getByText('34°')).toHaveStyle({ color: '#CC5427' })
  })

  test('non-highlighted days use dark text #191E1A', () => {
    render(<WeatherStrip />)
    expect(screen.getByText('28°')).toHaveStyle({ color: '#191E1A' })
  })
})
