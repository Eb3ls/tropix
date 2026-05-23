import { Nav } from '@/components/sections/Nav'
import { Hero } from '@/components/sections/Hero'
import { Market } from '@/components/sections/Market'
import { System } from '@/components/sections/System'
import { Capabilities } from '@/components/sections/Capabilities'
import { Pilot } from '@/components/sections/Pilot'
import { Team } from '@/components/sections/Team'
import { Footer } from '@/components/sections/Footer'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Market />
        <System />
        <Capabilities />
        <Pilot />
        <Team />
      </main>
      <Footer />
    </>
  )
}
