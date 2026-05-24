// src/components/demo/PlantPanel.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PlantPanel } from './PlantPanel'
import { ALL_PLANTS, type Plant } from '../../data/demoData'

// Convenient builders
const alertPlant   = ALL_PLANTS[13]   // A-14 — alert, disease + irrigation
const monitorPlant = ALL_PLANTS[5]    // A-06 — monitoring, irrigation only
const healthyPlant = ALL_PLANTS[0]    // A-01 — healthy

function panel(plant: Plant, overrides: Partial<Parameters<typeof PlantPanel>[0]> = {}) {
  const defaults = {
    plant,
    treated:       false,
    overdue:       false,
    onClose:       vi.fn(),
    onMarkTreated: vi.fn(),
  }
  return render(<PlantPanel {...defaults} {...overrides} />)
}

// ── Header rendering ───────────────────────────────────────────────────────
describe('header', () => {
  test('shows tree label', () => {
    panel(alertPlant)
    expect(screen.getByText('Tree A-14')).toBeInTheDocument()
  })

  test('shows zone (English name)', () => {
    panel(alertPlant)
    expect(screen.getByText('Zone North')).toBeInTheDocument()
  })

  test('shows status chip for alert plant', () => {
    panel(alertPlant)
    expect(screen.getByText('Alert')).toBeInTheDocument()
  })

  test('shows status chip for monitoring plant', () => {
    panel(monitorPlant)
    expect(screen.getByText('Monitoring')).toBeInTheDocument()
  })

  test('shows status chip for healthy plant', () => {
    panel(healthyPlant)
    expect(screen.getByText('Healthy')).toBeInTheDocument()
  })

  test('close button calls onClose', async () => {
    const onClose = vi.fn()
    panel(alertPlant, { onClose })
    await userEvent.click(screen.getByRole('button', { name: /close tree panel/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

// ── OVERDUE banner ────────────────────────────────────────────────────────
describe('OVERDUE banner', () => {
  test('shown when overdue=true and not treated', () => {
    panel(alertPlant, { overdue: true, treated: false })
    expect(screen.getByText(/overdue/i)).toBeInTheDocument()
  })

  test('NOT shown when treated=true even if overdue', () => {
    panel(alertPlant, { overdue: true, treated: true })
    expect(screen.queryByText(/overdue/i)).not.toBeInTheDocument()
  })

  test('NOT shown when overdue=false', () => {
    panel(alertPlant, { overdue: false, treated: false })
    expect(screen.queryByText(/overdue/i)).not.toBeInTheDocument()
  })
})

// ── Treated banner ────────────────────────────────────────────────────────
describe('treated confirmation banner', () => {
  test('shown when treated=true', () => {
    panel(alertPlant, { treated: true })
    expect(screen.getByText(/Treatment recorded/)).toBeInTheDocument()
  })

  test('NOT shown when treated=false', () => {
    panel(alertPlant, { treated: false })
    expect(screen.queryByText(/Treatment recorded/)).not.toBeInTheDocument()
  })
})

// ── Condition cards ────────────────────────────────────────────────────────
describe('condition cards', () => {
  test('disease card shown for plant with disease', () => {
    panel(alertPlant)
    expect(screen.getByText('Phytophthora cinnamomi')).toBeInTheDocument()
  })

  test('irrigation card shown for plant with irrigation', () => {
    panel(alertPlant)
    expect(screen.getByText(/today 18:00/)).toBeInTheDocument()
  })

  test('healthy plant shows "No anomalies" message', () => {
    panel(healthyPlant)
    expect(screen.getByText(/no anomalies detected/i)).toBeInTheDocument()
  })

  test('healthy plant does NOT show condition cards', () => {
    panel(healthyPlant)
    expect(screen.queryByText(/disease detected/i)).not.toBeInTheDocument()
  })
})

// ── Mark treatment done footer ────────────────────────────────────────────
describe('"Mark treatment done" button', () => {
  test('visible for alert plant when not treated', () => {
    panel(alertPlant, { treated: false })
    expect(screen.getByText(/mark treatment done/i)).toBeInTheDocument()
  })

  test('visible for monitoring plant when not treated', () => {
    panel(monitorPlant, { treated: false })
    expect(screen.getByText(/mark treatment done/i)).toBeInTheDocument()
  })

  test('NOT visible for healthy plant', () => {
    panel(healthyPlant)
    expect(screen.queryByText(/mark treatment done/i)).not.toBeInTheDocument()
  })

  test('NOT visible when plant is already treated', () => {
    panel(alertPlant, { treated: true })
    expect(screen.queryByText(/mark treatment done/i)).not.toBeInTheDocument()
  })

  test('clicking it calls onMarkTreated', async () => {
    const onMarkTreated = vi.fn()
    panel(alertPlant, { treated: false, onMarkTreated })
    await userEvent.click(screen.getByText(/mark treatment done/i))
    expect(onMarkTreated).toHaveBeenCalledTimes(1)
  })
})
