// src/components/demo/orchardMapMath.test.ts
import { computeWheelZoom } from './orchardMapMath'

const BASE = {
  containerWidth:  800,
  containerHeight: 600,
  minZoom: 0.8,
  maxZoom: 4.0,
}

// ── Bug regression: translate was never updated on wheel zoom ─────────────
describe('computeWheelZoom — translate anchors to cursor', () => {
  test('zoom in at off-centre cursor moves translate to anchor that point', () => {
    const result = computeWheelZoom({
      prevScale:  1,
      deltaY:    -100,           // negative = zoom in
      mouseX:    400, mouseY: 300,
      translateX: 0,  translateY: 0,
      ...BASE,
    })
    expect(result.scale).toBeGreaterThan(1)
    // With cursor at (400,300) and translate (0,0), the new translate should
    // be negative (image moves up-left to keep (400,300) anchored)
    expect(result.translateX).toBeLessThan(0)
    expect(result.translateY).toBeLessThan(0)
  })

  test('zoom in at top-left corner anchors top-left (translate stays 0,0)', () => {
    const result = computeWheelZoom({
      prevScale:  1,
      deltaY:    -100,
      mouseX:    0, mouseY: 0,
      translateX: 0, translateY: 0,
      ...BASE,
    })
    expect(result.scale).toBeGreaterThan(1)
    // Cursor at origin: content origin = (0-0)/1 = (0,0), newTx = 0 - 0*scale = 0
    expect(result.translateX).toBe(0)
    expect(result.translateY).toBe(0)
  })

  test('zoom out decreases scale', () => {
    const result = computeWheelZoom({
      prevScale:  2,
      deltaY:    100,            // positive = zoom out
      mouseX:    400, mouseY: 300,
      translateX: -200, translateY: -150,
      ...BASE,
    })
    expect(result.scale).toBeLessThan(2)
  })
})

// ── Scale clamping ─────────────────────────────────────────────────────────
describe('computeWheelZoom — scale clamping', () => {
  test('scale does not exceed maxZoom', () => {
    const result = computeWheelZoom({
      prevScale:  4.0,
      deltaY:    -100,
      mouseX:    400, mouseY: 300,
      translateX: 0, translateY: 0,
      ...BASE,
    })
    expect(result.scale).toBe(4.0)
  })

  test('scale does not go below minZoom', () => {
    const result = computeWheelZoom({
      prevScale:  0.8,
      deltaY:    100,
      mouseX:    400, mouseY: 300,
      translateX: 0, translateY: 0,
      ...BASE,
    })
    expect(result.scale).toBe(0.8)
  })
})

// ── Translate clamping ─────────────────────────────────────────────────────
describe('computeWheelZoom — translate clamping', () => {
  test('translateX is clamped to within 80% of container', () => {
    // Zoom in at far right edge should be clamped
    const result = computeWheelZoom({
      prevScale:  1,
      deltaY:    -100,
      mouseX:    800, mouseY: 300,
      translateX: 0, translateY: 0,
      ...BASE,
    })
    const maxX = BASE.containerWidth * 0.8
    expect(result.translateX).toBeLessThanOrEqual(maxX)
  })
})

// ── Precision / determinism ────────────────────────────────────────────────
describe('computeWheelZoom — determinism', () => {
  test('same inputs always produce same output', () => {
    const opts = {
      prevScale: 1.5, deltaY: -100,
      mouseX: 300, mouseY: 200,
      translateX: -80, translateY: -60,
      ...BASE,
    }
    const a = computeWheelZoom(opts)
    const b = computeWheelZoom(opts)
    expect(a).toEqual(b)
  })
})
