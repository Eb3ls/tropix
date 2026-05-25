import { useEffect, useState } from 'react'
import { Nav } from '@/components/sections/Nav'
import { Hero } from '@/components/sections/Hero'
import { Challenge } from '@/components/sections/Challenge'
import { System } from '@/components/sections/System'
import { Capabilities } from '@/components/sections/Capabilities'
import { InSeason } from '@/components/sections/InSeason'
import { Pilot } from '@/components/sections/Pilot'
import { Team } from '@/components/sections/Team'
import { Footer } from '@/components/sections/Footer'
import { Platform } from '@/pages/Platform'
import { Demo } from '@/pages/Demo'

function Landing() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Challenge />
        <System />
        <Capabilities />
        <InSeason />
<Pilot />
        <Team />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  const [view, setView] = useState<'landing' | 'platform' | 'demo'>(() => {
    if (window.location.hash === '#/platform') return 'platform'
    if (window.location.hash === '#/demo') return 'demo'
    return 'landing'
  })

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#/platform') setView('platform')
      else if (window.location.hash === '#/demo') setView('demo')
      else {
        setView('landing')
        const anchor = window.location.hash.slice(1)
        if (anchor) {
          // Wait for landing page to render before scrolling to the anchor
          requestAnimationFrame(() => requestAnimationFrame(() => {
            document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' })
          }))
        } else {
          window.scrollTo(0, 0)
        }
      }
    }
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  if (view === 'platform') return <Platform />
  if (view === 'demo') return <Demo />
  return <Landing />
}
