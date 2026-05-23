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
  const [view, setView] = useState<'landing' | 'platform'>(() =>
    window.location.hash === '#/platform' ? 'platform' : 'landing'
  )

  useEffect(() => {
    const handleHash = () => {
      setView(window.location.hash === '#/platform' ? 'platform' : 'landing')
      if (window.location.hash !== '#/platform') window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])

  return view === 'platform' ? <Platform /> : <Landing />
}
