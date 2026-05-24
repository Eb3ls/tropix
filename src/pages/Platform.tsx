import { useState } from 'react'
import { PlatformSidebar, type ViewType } from '../components/platform/Sidebar'
import { OrchardView }  from '../components/platform/views/OrchardView'
import { AlertsView }   from '../components/platform/views/AlertsView'
import { ReportsView }  from '../components/platform/views/ReportsView'
import { SettingsView } from '../components/platform/views/SettingsView'

export function Platform() {
  const [activeView, setActiveView] = useState<ViewType>('orchard')

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: '#E8E1CF',
      }}
    >
      <PlatformSidebar activeView={activeView} onNavigate={setActiveView} />

      <main
        style={{
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          background: '#E8E1CF',
        }}
      >
        {activeView === 'orchard'  && <OrchardView />}
        {activeView === 'alerts'   && <AlertsView />}
        {activeView === 'reports'  && <ReportsView />}
        {activeView === 'settings' && <SettingsView />}
      </main>
    </div>
  )
}
