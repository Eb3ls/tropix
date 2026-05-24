// src/components/demo/orchardMapMath.ts
// Pure zoom/pan math extracted from OrchardMap — fully unit-testable.

export interface WheelZoomInput {
  prevScale:       number
  deltaY:          number    // WheelEvent.deltaY  (<0 = zoom in)
  mouseX:          number    // cursor X relative to container
  mouseY:          number
  translateX:      number    // current translate.x
  translateY:      number
  containerWidth:  number
  containerHeight: number
  minZoom:         number
  maxZoom:         number
}

export interface ZoomResult {
  scale:      number
  translateX: number
  translateY: number
}

/**
 * Compute the new scale + translate after a wheel event so the point under the
 * cursor stays anchored in place (zoom-to-cursor semantics).
 */
export function computeWheelZoom({
  prevScale, deltaY,
  mouseX, mouseY,
  translateX, translateY,
  containerWidth, containerHeight,
  minZoom, maxZoom,
}: WheelZoomInput): ZoomResult {
  const factor   = deltaY < 0 ? 1.12 : 1 / 1.12
  const newScale = Math.min(maxZoom, Math.max(minZoom, prevScale * factor))

  // Content coordinates of the cursor before zoom
  const contentX = (mouseX - translateX) / prevScale
  const contentY = (mouseY - translateY) / prevScale

  // New translate that keeps (contentX, contentY) under the cursor
  const rawTx = mouseX - contentX * newScale
  const rawTy = mouseY - contentY * newScale

  // Clamp: keep at least 20% of the container covered on each side.
  //   left  edge (tx)           must be ≤ cw * 0.8  (image not too far right)
  //   right edge (tx + cw*s)    must be ≥ cw * 0.2  → tx ≥ cw * (0.2 - s)
  const maxX = containerWidth  * 0.8
  const minX = containerWidth  * (0.2 - newScale)
  const maxY = containerHeight * 0.8
  const minY = containerHeight * (0.2 - newScale)

  return {
    scale:      newScale,
    translateX: Math.min(maxX, Math.max(minX, rawTx)),
    translateY: Math.min(maxY, Math.max(minY, rawTy)),
  }
}
