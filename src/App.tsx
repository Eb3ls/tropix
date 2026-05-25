import { useEffect, useState } from 'react'
import { Nav } from '@/components/sections/Nav'
import { Hero } from '@/components/sections/Hero'
import { Challenge } from '@/components/sections/Challenge'
import { System } from '@/components/sections/System'
import { Capabilities } from '@/components/sections/Capabilities'
import { InSeason } from '@/components/sections/InSeason'
import { Pilot } from '@/components/sections/Pilot'
import { Footer } from '@/components/sections/Footer'
import { Platform } from '@/pages/Platform'
import { Demo } from '@/pages/Demo'

function DemoBar() {
  const go = () => {
    window.location.hash = '#/demo'
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }
  return (
    <div style={{
      background: '#191E1A',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
      padding: '12px 24px',
    }}>
      <span style={{
        fontFamily: "'Barlow Semi Condensed', sans-serif",
        fontSize: '15px',
        fontWeight: 400,
        color: 'rgba(232,225,207,0.65)',
        letterSpacing: '0.01em',
      }}>
        The precision cockpit is live —
        <em style={{ fontStyle: 'normal', color: 'rgba(232,225,207,0.85)', marginLeft: '6px' }}>
          see exactly how it works in the field.
        </em>
      </span>
      <button
        onClick={go}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '7px',
          padding: '8px 18px',
          background: '#CC5427',
          border: 'none',
          borderRadius: '4px',
          fontFamily: "'Barlow Semi Condensed', sans-serif",
          fontSize: '14px',
          fontWeight: 600,
          letterSpacing: '0.02em',
          color: '#F0EADB',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'background 150ms',
          flexShrink: 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#A8421C')}
        onMouseLeave={e => (e.currentTarget.style.background = '#CC5427')}
      >
        Open cockpit →
      </button>
    </div>
  )
}

function Landing() {
  return (
    <>
      <DemoBar />
      <Nav />
      <main>
        <Hero />
        <Challenge />
        <System />
        <Capabilities />
        <InSeason />
<Pilot />
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
