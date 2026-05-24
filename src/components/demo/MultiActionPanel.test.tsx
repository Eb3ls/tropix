// src/components/demo/MultiActionPanel.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MultiActionPanel } from './MultiActionPanel'
import { ALL_PLANTS, INITIAL_INTERVENTIONS } from '../../data/demoData'

// i5: 5-tree irrigation intervention (plantIds: [5, 42, 52, 88, 115])
const multiIntervention = INITIAL_INTERVENTIONS.find(i => i.id === 'i5')!

function panel(
  overrides: Partial<Parameters<typeof MultiActionPanel>[0]> = {},
  intervention = multiIntervention,
) {
  const defaults = {
    intervention,
    plants:        ALL_PLANTS,
    treatedIds:    new Set<number>(),
    onClose:       vi.fn(),
    onMarkAllDone: vi.fn(),
    onTreeClick:   vi.fn(),
  }
  return render(<MultiActionPanel {...defaults} {...overrides} />)
}

// ── Header ─────────────────────────────────────────────────────────────────
describe('header', () => {
  test('renders intervention title', () => {
    panel()
    expect(screen.getByText(multiIntervention.title)).toBeInTheDocument()
  })

  test('renders scheduled-for with plant count', () => {
    panel()
    // The header div contains "tomorrow 08:00 · 5 trees"
    // Use getAllByText to avoid ambiguity with the "Mark all 5 trees done" button
    const matches = screen.getAllByText(new RegExp(`${multiIntervention.plantCount} trees`))
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  test('renders priority badge', () => {
    panel()
    // i5 is medium priority, badge shows "MEDIUM"
    expect(screen.getByText('MEDIUM')).toBeInTheDocument()
  })

  test('close button calls onClose', async () => {
    const onClose = vi.fn()
    panel({ onClose })
    await userEvent.click(screen.getByRole('button', { name: /close panel/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

// ── Detail section ─────────────────────────────────────────────────────────
describe('detail section', () => {
  test('renders intervention detail text', () => {
    panel()
    expect(screen.getByText(multiIntervention.detail)).toBeInTheDocument()
  })
})

// ── Affected trees list ────────────────────────────────────────────────────
describe('affected trees list', () => {
  test('shows affected tree count header', () => {
    panel()
    expect(screen.getByText(`Affected trees · ${multiIntervention.plantIds.length}`)).toBeInTheDocument()
  })

  test('each affected plant label is visible', () => {
    panel()
    // i5 covers A-06, A-43, C-05
    ;['A-06', 'A-43', 'C-05'].forEach(label => {
      expect(screen.getByText(label)).toBeInTheDocument()
    })
  })

  test('clicking a plant row calls onTreeClick with that plant', async () => {
    const onTreeClick = vi.fn()
    panel({ onTreeClick })
    // Click A-06 (gridIndex 5)
    await userEvent.click(screen.getByText('A-06'))
    expect(onTreeClick).toHaveBeenCalledTimes(1)
    expect(onTreeClick.mock.calls[0][0].gridIndex).toBe(5)
  })

  test('plants with irrigation show sap-flow bar', () => {
    panel()
    // All i5 plants have irrigation
    expect(screen.getAllByText('Sap-flow').length).toBeGreaterThan(0)
  })
})

// ── "Mark all done" button ─────────────────────────────────────────────────
describe('"Mark all done" button', () => {
  test('enabled when no plants are treated', () => {
    panel()
    const btn = screen.getByRole('button', { name: /mark all .* trees done/i })
    expect(btn).not.toBeDisabled()
  })

  test('disabled when all plants are already treated', () => {
    const allTreated = new Set(multiIntervention.plantIds)
    panel({ treatedIds: allTreated })
    const btn = screen.getByRole('button', { name: /all treatments recorded/i })
    expect(btn).toBeDisabled()
  })

  test('disabled when intervention.done is true', () => {
    panel({ intervention: { ...multiIntervention, done: true } })
    const btn = screen.getByRole('button', { name: /all treatments recorded/i })
    expect(btn).toBeDisabled()
  })

  test('clicking it calls onMarkAllDone', async () => {
    const onMarkAllDone = vi.fn()
    panel({ onMarkAllDone })
    await userEvent.click(screen.getByRole('button', { name: /mark all .* trees done/i }))
    expect(onMarkAllDone).toHaveBeenCalledTimes(1)
  })

  test('shows "All treatments recorded" text when done', () => {
    const allTreated = new Set(multiIntervention.plantIds)
    panel({ treatedIds: allTreated })
    expect(screen.getByText('All treatments recorded')).toBeInTheDocument()
  })

  test('shows tree count in label when not done', () => {
    panel()
    expect(screen.getByText(`Mark all ${multiIntervention.plantIds.length} trees done`)).toBeInTheDocument()
  })
})
