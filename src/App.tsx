import { useState, useEffect } from 'react'
import { I18nProvider } from './shared/i18n'
import { useThemeStore } from './shared/theme/store'
import TopBar from './shared/components/TopBar'
import { AgentsView } from './features/agents/components'
import { LLMView } from './features/llm/components'
import { MCPView } from './features/mcp/components'
import { TeamsView } from './features/teams/components'
import { CLIsView } from './features/clis/components'
import { TemplatesView } from './features/templates/components'
import SettingsView from './features/settings/components/SettingsView'

export type ViewType = 'agents' | 'llm' | 'mcp' | 'teams' | 'clis' | 'templates' | 'settings'

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewType>('agents')
  const theme = useThemeStore(s => s.theme)
  const loadTheme = useThemeStore(s => s.loadTheme)

  useEffect(() => {
    // Initialize theme from localStorage on mount
    document.documentElement.dataset.theme = theme
    // Load theme from SQLite
    loadTheme()
  }, [])

  const renderView = () => {
    switch (currentView) {
      case 'agents': return <AgentsView />
      case 'llm': return <LLMView />
      case 'mcp': return <MCPView />
      case 'teams': return <TeamsView />
      case 'clis': return <CLIsView />
      case 'templates': return <TemplatesView />
      case 'settings': return <SettingsView />
      default: return <AgentsView />
    }
  }

  return (
    <div className="min-h-screen bg-bg">
      <TopBar currentView={currentView} onViewChange={setCurrentView} />
      <main className="max-w-[1600px] mx-auto p-4">
        {renderView()}
      </main>
    </div>
  )
}

function App() {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  )
}

export default App
