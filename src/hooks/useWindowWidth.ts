import { useEffect, useState } from 'react'

/**
 * Returns the current window.innerWidth, updated on resize.
 * Used to switch between cockpit (≥900px) and mobile gate (<900px).
 */
export function useWindowWidth(): number {
  const [width, setWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 0
  )

  useEffect(() => {
    const handle = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

  return width
}
