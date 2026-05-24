// src/components/demo/OrchardMap.test.tsx
import { render, screen, fireEvent, act } from '@testing-library/react'
import { OrchardMap } from './OrchardMap'
import { ALL_PLANTS } from '../../data/demoData'

// Stub getBoundingClientRect so jsdom returns a real container size
beforeEach(() => {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
    width: 800, height: 600,
    left: 0, top: 0,
    right: 800, bottom: 600,
    x: 0, y: 0,
    toJSON: () => {},
  } as DOMRect)
})
afterEach(() => vi.restoreAllMocks())

function mkProps(overrides = {}) {
  return {
    plants:        ALL_PLANTS,
    selectedId:    null,
    highlightedIds: new Set<number>(),
    treatedIds:    new Set<number>(),
    onTreeClick:   vi.fn(),
    ...overrides,
  }
}

function getWrapper(container: HTMLElement) {
  // React serialises transformOrigin as `transform-origin` in DOM style attribute
  return container.querySelector<HTMLElement>('[style*="transform-origin"]')!
}

function getScale(wrapper: HTMLElement): number {
  const m = wrapper.style.transform.match(/scale\(([^)]+)\)/)
  return m ? parseFloat(m[1]) : 1
}

function getTranslate(wrapper: HTMLElement): { x: number; y: number } {
  const m = wrapper.style.transform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/)
  return m ? { x: parseFloat(m[1]), y: parseFloat(m[2]) } : { x: 0, y: 0 }
}

// ── Zoom controls ─────────────────────────────────────────────────────────────
describe('zoom controls', () => {
  test('+ button increases scale', async () => {
    const { container } = render(<OrchardMap {...mkProps()} />)
    const zoomIn = screen.getByRole('button', { name: /zoom in/i })
    await act(async () => { fireEvent.click(zoomIn) })
    expect(getScale(getWrapper(container))).toBeGreaterThan(1)
  })

  test('- button decreases scale from zoomed state', async () => {
    const { container } = render(<OrchardMap {...mkProps()} />)
    const zoomIn  = screen.getByRole('button', { name: /zoom in/i })
    const zoomOut = screen.getByRole('button', { name: /zoom out/i })
    await act(async () => { fireEvent.click(zoomIn); fireEvent.click(zoomIn) })
    const scaleBefore = getScale(getWrapper(container))
    await act(async () => { fireEvent.click(zoomOut) })
    expect(getScale(getWrapper(container))).toBeLessThan(scaleBefore)
  })

  test('reset button sets scale back to 1 and translate to 0,0', async () => {
    const { container } = render(<OrchardMap {...mkProps()} />)
    const zoomIn = screen.getByRole('button', { name: /zoom in/i })
    const reset  = screen.getByRole('button', { name: /reset/i })
    await act(async () => { fireEvent.click(zoomIn) })
    await act(async () => { fireEvent.click(reset) })
    const wrapper = getWrapper(container)
    expect(getScale(wrapper)).toBe(1)
    expect(getTranslate(wrapper)).toEqual({ x: 0, y: 0 })
  })
})

// ── Drag: delta-based pan ─────────────────────────────────────────────────────
describe('drag to pan', () => {
  async function zoomedState(container: HTMLElement) {
    // Zoom in twice so scale > 1 and drag is enabled
    const zoomIn = screen.getByRole('button', { name: /zoom in/i })
    await act(async () => { fireEvent.click(zoomIn); fireEvent.click(zoomIn) })
    return getTranslate(getWrapper(container))
  }

  test('drag moves map by the exact mouse delta', async () => {
    const { container } = render(<OrchardMap {...mkProps()} />)
    const root = container.firstChild as HTMLElement
    await zoomedState(container)

    const tBefore = getTranslate(getWrapper(container))

    await act(async () => {
      fireEvent.mouseDown(root, { clientX: 200, clientY: 200 })
      fireEvent.mouseMove(window, { clientX: 250, clientY: 220 })
      fireEvent.mouseUp(window)
    })

    const tAfter = getTranslate(getWrapper(container))
    // Map should have moved +50 in x and +20 in y (or clamped, but container is 800×600
    // and scale≈1.5, so minX = 800*(0.2-1.5) = -1040, maxX = 640 — no clamp expected)
    expect(tAfter.x).toBeCloseTo(tBefore.x + 50, 0)
    expect(tAfter.y).toBeCloseTo(tBefore.y + 20, 0)
  })

  test('consecutive drags accumulate correctly — no stale closure jump', async () => {
    const { container } = render(<OrchardMap {...mkProps()} />)
    const root = container.firstChild as HTMLElement
    await zoomedState(container)

    // First drag: +30, +0
    await act(async () => {
      fireEvent.mouseDown(root, { clientX: 100, clientY: 100 })
      fireEvent.mouseMove(window, { clientX: 130, clientY: 100 })
      fireEvent.mouseUp(window)
    })
    const tAfterFirst = getTranslate(getWrapper(container))

    // Second drag: +40, +0 — must start from tAfterFirst, NOT from 0
    await act(async () => {
      fireEvent.mouseDown(root, { clientX: 200, clientY: 200 })
      fireEvent.mouseMove(window, { clientX: 240, clientY: 200 })
      fireEvent.mouseUp(window)
    })
    const tAfterSecond = getTranslate(getWrapper(container))

    expect(tAfterSecond.x).toBeCloseTo(tAfterFirst.x + 40, 0)
  })

  test('mousemove without mousedown does not move map', async () => {
    const { container } = render(<OrchardMap {...mkProps()} />)
    await zoomedState(container)
    const tBefore = getTranslate(getWrapper(container))

    await act(async () => {
      fireEvent.mouseMove(window, { clientX: 300, clientY: 300 })
    })

    expect(getTranslate(getWrapper(container))).toEqual(tBefore)
  })

  test('drag does nothing when scale ≤ 1', async () => {
    const { container } = render(<OrchardMap {...mkProps()} />)
    const root = container.firstChild as HTMLElement
    const tBefore = getTranslate(getWrapper(container))

    await act(async () => {
      fireEvent.mouseDown(root, { clientX: 100, clientY: 100 })
      fireEvent.mouseMove(window, { clientX: 200, clientY: 200 })
      fireEvent.mouseUp(window)
    })

    expect(getTranslate(getWrapper(container))).toEqual(tBefore)
  })
})

// ── Cursor feedback ───────────────────────────────────────────────────────────
describe('cursor', () => {
  test('default cursor when not zoomed', () => {
    const { container } = render(<OrchardMap {...mkProps()} />)
    const root = container.firstChild as HTMLElement
    expect(root.style.cursor).toBe('default')
  })

  test('grab cursor when zoomed and not dragging', async () => {
    const { container } = render(<OrchardMap {...mkProps()} />)
    const root = container.firstChild as HTMLElement
    const zoomIn = screen.getByRole('button', { name: /zoom in/i })
    await act(async () => { fireEvent.click(zoomIn) })
    expect(root.style.cursor).toBe('grab')
  })

  test('grabbing cursor during active drag', async () => {
    const { container } = render(<OrchardMap {...mkProps()} />)
    const root = container.firstChild as HTMLElement
    const zoomIn = screen.getByRole('button', { name: /zoom in/i })
    await act(async () => { fireEvent.click(zoomIn) })

    await act(async () => {
      fireEvent.mouseDown(root, { clientX: 100, clientY: 100 })
    })
    expect(root.style.cursor).toBe('grabbing')
  })

  test('cursor returns to grab after mouseup', async () => {
    const { container } = render(<OrchardMap {...mkProps()} />)
    const root = container.firstChild as HTMLElement
    const zoomIn = screen.getByRole('button', { name: /zoom in/i })
    await act(async () => { fireEvent.click(zoomIn) })
    await act(async () => {
      fireEvent.mouseDown(root, { clientX: 100, clientY: 100 })
      fireEvent.mouseUp(window)
    })
    expect(root.style.cursor).toBe('grab')
  })
})
