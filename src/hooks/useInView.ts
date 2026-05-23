import { useEffect, useRef, useState } from 'react'

/**
 * Observes an element and returns `visible = true` once it enters the viewport.
 * One-shot: disconnects the observer after the first trigger.
 */
export function useInView(threshold = 0.15) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}
