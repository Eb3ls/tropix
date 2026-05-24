// src/components/demo/ZoomControls.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ZoomControls } from './ZoomControls'

function controls(zoom: number, overrides: Partial<Parameters<typeof ZoomControls>[0]> = {}) {
  const defaults = {
    zoom,
    minZoom: 0.8,
    maxZoom: 4.0,
    onZoomIn:  vi.fn(),
    onZoomOut: vi.fn(),
    onReset:   vi.fn(),
  }
  return render(<ZoomControls {...defaults} {...overrides} />)
}

// ── Rendering ─────────────────────────────────────────────────────────────
describe('rendering', () => {
  test('renders Zoom in, Zoom out and Reset buttons', () => {
    controls(1)
    expect(screen.getByRole('button', { name: /zoom in/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /zoom out/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset zoom/i })).toBeInTheDocument()
  })

  test('displays zoom as percentage', () => {
    controls(1.5)
    expect(screen.getByText('150%')).toBeInTheDocument()
  })

  test('100% shown at zoom 1', () => {
    controls(1)
    expect(screen.getByText('100%')).toBeInTheDocument()
  })
})

// ── Disabled states ────────────────────────────────────────────────────────
describe('button disabled states', () => {
  test('zoom in disabled at maxZoom', () => {
    controls(4.0)
    expect(screen.getByRole('button', { name: /zoom in/i })).toBeDisabled()
  })

  test('zoom in enabled below maxZoom', () => {
    controls(3.75)
    expect(screen.getByRole('button', { name: /zoom in/i })).not.toBeDisabled()
  })

  test('zoom out disabled at minZoom', () => {
    controls(0.8)
    expect(screen.getByRole('button', { name: /zoom out/i })).toBeDisabled()
  })

  test('zoom out enabled above minZoom', () => {
    controls(1.0)
    expect(screen.getByRole('button', { name: /zoom out/i })).not.toBeDisabled()
  })

  test('reset disabled at zoom 1 (exact)', () => {
    controls(1.0)
    expect(screen.getByRole('button', { name: /reset zoom/i })).toBeDisabled()
  })

  test('reset enabled when zoom is not 1', () => {
    controls(1.5)
    expect(screen.getByRole('button', { name: /reset zoom/i })).not.toBeDisabled()
  })

  test('reset disabled for float near 1 (epsilon check)', () => {
    controls(1.0004)
    expect(screen.getByRole('button', { name: /reset zoom/i })).toBeDisabled()
  })
})

// ── Callbacks ─────────────────────────────────────────────────────────────
describe('callbacks', () => {
  test('clicking zoom in calls onZoomIn', async () => {
    const onZoomIn = vi.fn()
    controls(1.0, { onZoomIn })
    await userEvent.click(screen.getByRole('button', { name: /zoom in/i }))
    expect(onZoomIn).toHaveBeenCalledTimes(1)
  })

  test('clicking zoom out calls onZoomOut', async () => {
    const onZoomOut = vi.fn()
    controls(2.0, { onZoomOut })
    await userEvent.click(screen.getByRole('button', { name: /zoom out/i }))
    expect(onZoomOut).toHaveBeenCalledTimes(1)
  })

  test('clicking reset calls onReset', async () => {
    const onReset = vi.fn()
    controls(2.0, { onReset })
    await userEvent.click(screen.getByRole('button', { name: /reset zoom/i }))
    expect(onReset).toHaveBeenCalledTimes(1)
  })

  test('zoom in NOT called when disabled (at maxZoom)', async () => {
    const onZoomIn = vi.fn()
    controls(4.0, { onZoomIn })
    await userEvent.click(screen.getByRole('button', { name: /zoom in/i }))
    expect(onZoomIn).not.toHaveBeenCalled()
  })

  test('zoom out NOT called when disabled (at minZoom)', async () => {
    const onZoomOut = vi.fn()
    controls(0.8, { onZoomOut })
    await userEvent.click(screen.getByRole('button', { name: /zoom out/i }))
    expect(onZoomOut).not.toHaveBeenCalled()
  })
})
