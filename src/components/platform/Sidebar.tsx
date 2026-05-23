import { LayoutGrid, Bell, FileText, Settings, ArrowLeft } from 'lucide-react'

const sidebarLinks = [
  { icon: LayoutGrid, label: 'Orchard', active: true  },
  { icon: Bell,       label: 'Alerts',  badge: 1      },
  { icon: FileText,   label: 'Reports'                },
  { icon: Settings,   label: 'Settings'               },
]

export function PlatformSidebar() {
  return (
    <aside style={{ width: '220px', flexShrink: 0, background: '#0A1410', display: 'flex', flexDirection: 'column', padding: '0', borderRight: '1px solid rgba(244,239,227,0.08)' }}>
      {/* Wordmark */}
      <div style={{ padding: '20px 24px 0', marginBottom: '32px' }}>
        <a
          href="#"
          onClick={() => { window.location.hash = ''; window.dispatchEvent(new HashChangeEvent('hashchange')) }}
          style={{ fontFamily: "'Instrument Serif', serif", fontSize: '24px', color: '#F4EFE3', fontWeight: 400, textDecoration: 'none', display: 'block' }}
        >
          Trop<em style={{ color: '#D9882B', fontStyle: 'italic' }}>X</em>
        </a>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '0 12px' }}>
        {sidebarLinks.map(item => {
          const Icon = item.icon
          return (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', marginBottom: '2px', background: item.active ? 'rgba(244,239,227,0.08)' : 'transparent', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icon size={16} strokeWidth={item.active ? 2 : 1.5} style={{ color: item.active ? '#F0C381' : 'rgba(244,239,227,0.45)' }} />
                <span style={{ fontSize: '14px', color: item.active ? '#F4EFE3' : 'rgba(244,239,227,0.5)', fontWeight: item.active ? 500 : 400 }}>
                  {item.label}
                </span>
              </div>
              {item.badge ? (
                <span style={{ background: '#B83A2E', color: '#F4EFE3', fontSize: '11px', fontWeight: 600, borderRadius: '9999px', padding: '1px 6px', fontFamily: "'JetBrains Mono', monospace" }}>
                  {item.badge}
                </span>
              ) : null}
            </div>
          )
        })}
      </nav>

      {/* Farm info */}
      <div style={{ margin: '12px', padding: '14px', background: 'rgba(244,239,227,0.05)', borderRadius: '8px', border: '1px solid rgba(244,239,227,0.08)' }}>
        <div style={{ fontSize: '11px', color: 'rgba(244,239,227,0.35)', marginBottom: '4px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Farm</div>
        <div style={{ fontSize: '13px', color: 'rgba(244,239,227,0.7)', fontWeight: 500, lineHeight: 1.3 }}>Az. Agr. Greco</div>
        <div style={{ fontSize: '12px', color: 'rgba(244,239,227,0.35)', marginTop: '2px' }}>Ragusa, Sicilia</div>
      </div>

      {/* Back to site */}
      <a
        href="#"
        onClick={e => { e.preventDefault(); window.location.hash = ''; window.dispatchEvent(new HashChangeEvent('hashchange')) }}
        style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 12px 16px', padding: '10px 12px', fontSize: '13px', color: 'rgba(244,239,227,0.35)', textDecoration: 'none', borderRadius: '8px', transition: 'color 200ms' }}
        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(244,239,227,0.65)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(244,239,227,0.35)')}
      >
        <ArrowLeft size={14} /> Back to site
      </a>
    </aside>
  )
}
