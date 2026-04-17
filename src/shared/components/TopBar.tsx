import { useState, useEffect } from 'react'
import { ViewType } from '../../App'
import { useI18n } from '../i18n'

interface TopBarProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
}

function TopBar({ currentView, onViewChange }: TopBarProps) {
  const { t } = useI18n()
  const [isMaximized, setIsMaximized] = useState(false)

  const views: { id: ViewType; labelKey: string }[] = [
    { id: 'agents', labelKey: 'nav.agents' },
    { id: 'llm', labelKey: 'nav.llm' },
    { id: 'mcp', labelKey: 'nav.mcp' },
    { id: 'teams', labelKey: 'nav.teams' },
    { id: 'clis', labelKey: 'nav.clis' },
    { id: 'templates', labelKey: 'nav.templates' },
    { id: 'settings', labelKey: 'nav.settings' },
  ]

  useEffect(() => {
    // Check initial maximized state
    window.electronAPI.window.isMaximized().then(setIsMaximized)
  }, [])

  const handleMinimize = () => {
    window.electronAPI.window.minimize()
  }

  const handleMaximize = () => {
    window.electronAPI.window.maximize()
    setIsMaximized(!isMaximized)
  }

  const handleClose = () => {
    window.electronAPI.window.close()
  }

  return (
    <header className="bg-panel border-b border-[var(--card)] px-4 py-3 flex items-center justify-between select-none" style={{ WebkitAppRegion: 'drag' } as any}>
      <div className="flex items-center gap-1">
        <span className="text-accent font-bold text-lg mr-6">Agency</span>
        {views.map((view) => (
          <button
            key={view.id}
            onClick={() => onViewChange(view.id)}
            style={{ WebkitAppRegion: 'no-drag' } as any}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentView === view.id
                ? 'bg-[#e94560] text-white'
                : 'text-gray-400 hover:text-white hover:bg-[var(--card)]'
            }`}
          >
            {t(view.labelKey)}
          </button>
        ))}
      </div>

      {/* Window Controls */}
      <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <button
          onClick={handleMinimize}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[var(--card)] text-gray-400 hover:text-white transition-colors"
          title={t('window.minimize')}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
        <button
          onClick={handleMaximize}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[var(--card)] text-gray-400 hover:text-white transition-colors"
          title={isMaximized ? t('window.restore') : t('window.maximize')}
        >
          {isMaximized ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="2.5" y="4.5" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" fill="none"/>
              <path d="M4.5 4.5V3.5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-1" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="2" y="2" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
          )}
        </button>
        <button
          onClick={handleClose}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-red-600 text-gray-400 hover:text-white transition-colors"
          title={t('window.close')}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 2.5l7 7M9.5 2.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </header>
  )
}

export default TopBar
