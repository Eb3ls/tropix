// src/components/demo/AlertSidebar.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AlertSidebar } from './AlertSidebar'
import { ALL_PLANTS, INITIAL_INTERVENTIONS, type Plant, type Intervention } from '../../data/demoData'

// Minimal props for a clean render
function sidebar(overrides: Partial<Parameters<typeof AlertSidebar>[0]> = {}) {
  const defaults = {
    plants: ALL_PLANTS,
    interventions: INITIAL_INTERVENTIONS,
    selectedId: null,
    highlightedIds: new Set<number>(),
    treatedIds: new Set<number>(),
    onAlertClick: vi.fn(),
    onActionClick: vi.fn(),
  }
  return render(<AlertSidebar {...defaults} {...overrides} />)
}

// ── Bug regression: sidebar was 220px, too narrow ─────────────────────────
describe('sidebar width', () => {
  test('container is at least 280px wide', () => {
    const { container } = sidebar()
    const el = container.firstChild as HTMLElement
    const w = parseInt(el.style.width, 10)
    expect(w).toBeGreaterThanOrEqual(280)
  })
})

// ── Health chip ────────────────────────────────────────────────────────────
describe('farm health chip', () => {
  test('shows correct healthy count', () => {
    sidebar()
    const healthy = ALL_PLANTS.filter(p => p.status === 'healthy').length
    expect(screen.getByText(`${healthy} healthy`)).toBeInTheDocument()
  })

  test('shows correct alert count', () => {
    sidebar()
    const alerts = ALL_PLANTS.filter(p => p.status === 'alert').length
    expect(screen.getByText(`${alerts} alerts`)).toBeInTheDocument()
  })
})

// ── Alert list ─────────────────────────────────────────────────────────────
describe('alert plant list', () => {
  test('renders a row for every non-healthy plant', () => {
    sidebar()
    const nonHealthy = ALL_PLANTS.filter(p => p.status !== 'healthy')
    // Each row shows the plant label (A-14, B-10, …)
    nonHealthy.forEach(p => {
      const label = p.zone === 'Nord' ? 'A' : p.zone === 'Centro' ? 'B' : 'C'
      const relId = p.gridIndex < 48 ? p.gridIndex + 1
                  : p.gridIndex < 84 ? p.gridIndex - 48 + 1
                  : p.gridIndex - 84 + 1
      expect(screen.getByText(`${label}-${String(relId).padStart(2, '0')}`)).toBeInTheDocument()
    })
  })

  test('shows OVERDUE badge for overdue non-treated plants', () => {
    sidebar()
    // INITIAL_INTERVENTIONS i1 (gridIndex 13) is overdue
    expect(screen.getByText('OVERDUE')).toBeInTheDocument()
  })

  test('does NOT show OVERDUE badge when that plant is treated', () => {
    sidebar({ treatedIds: new Set([13]) })
    expect(screen.queryByText('OVERDUE')).not.toBeInTheDocument()
  })

  test('shows TREATED badge when tree is in treatedIds', () => {
    sidebar({ treatedIds: new Set([13]) })
    expect(screen.getByText('TREATED')).toBeInTheDocument()
  })

  test('clicking an alert row calls onAlertClick with the plant', async () => {
    const onAlertClick = vi.fn()
    sidebar({ onAlertClick })
    // A-14 is gridIndex 13
    await userEvent.click(screen.getByText('A-14'))
    expect(onAlertClick).toHaveBeenCalledTimes(1)
    const arg = onAlertClick.mock.calls[0][0] as Plant
    expect(arg.gridIndex).toBe(13)
  })
})

// ── Action list ────────────────────────────────────────────────────────────
describe('pending action list', () => {
  test('renders all pending intervention titles (unique)', () => {
    sidebar()
    const pending = INITIAL_INTERVENTIONS.filter(i => !i.done)
    const uniqueTitles = [...new Set(pending.map(i => i.title))]
    uniqueTitles.forEach(title => {
      // getAllByText accepts duplicates; just verify at least one match
      expect(screen.getAllByText(title).length).toBeGreaterThan(0)
    })
  })

  test('does NOT render completed interventions', () => {
    const completed: Intervention = {
      ...INITIAL_INTERVENTIONS[0],
      id: 'done-1',
      done: true,
      title: 'This intervention is done and hidden',
    }
    sidebar({ interventions: [completed] })
    expect(screen.queryByText('This intervention is done and hidden')).not.toBeInTheDocument()
  })

  test('clicking an action calls onActionClick with the intervention', async () => {
    const onActionClick = vi.fn()
    // Use a unique-title intervention to avoid ambiguous getByText
    const unique = INITIAL_INTERVENTIONS.find(i => i.title === 'Scheduled irrigation')!
    sidebar({ onActionClick, interventions: [unique] })
    await userEvent.click(screen.getByText('Scheduled irrigation'))
    expect(onActionClick).toHaveBeenCalledTimes(1)
    const arg = onActionClick.mock.calls[0][0] as Intervention
    expect(arg.id).toBe(unique.id)
  })

  test('highlighted action row has non-transparent background', () => {
    const highlighted = new Set(INITIAL_INTERVENTIONS[0].plantIds)
    const { container } = sidebar({ highlightedIds: highlighted })
    // Highlighted buttons have a background set (not 'transparent')
    const buttons = container.querySelectorAll('button')
    const highlightedBtn = Array.from(buttons).find(b =>
      b.style.background !== '' && b.style.background !== 'transparent'
    )
    expect(highlightedBtn).toBeDefined()
  })
})
