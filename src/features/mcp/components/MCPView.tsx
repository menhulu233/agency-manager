import { useEffect, useState } from 'react'
import { useMCPStore } from '../store'
import { ThreeColumnLayout, LeftSidebar, CardGrid, DetailPanel } from '../../../shared/components'
import { useI18n } from '../../../shared/i18n'

const SERVER_ICONS: Record<string, string> = {
  pinecone: '🧠',
  local: '🗄️',
  github: '🌐',
  slack: '📊',
  database: '🗃️',
  sentry: '🚨'
}

const STATUS_COLORS = {
  'running': 'bg-green-500',
  'stopped': 'bg-yellow-500',
  'not-configured': 'bg-gray-600'
}

export default function MCPView() {
  const { t } = useI18n()
  const { servers, selectedServer, loadServers, selectServer, configureServer, startServer, stopServer } = useMCPStore()
  const [serverAddress, setServerAddress] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [saving, setSaving] = useState(false)
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    loadServers()
  }, [])

  useEffect(() => {
    if (selectedServer) {
      setServerAddress(selectedServer.config?.address || '')
      setApiKey(selectedServer.config?.api_key || '')
    }
  }, [selectedServer])

  const handleToggle = async (e: React.MouseEvent, server: typeof servers[0]) => {
    e.stopPropagation()
    setToggling(server.id)
    if (server.status === 'running') {
      await stopServer(server.id)
    } else {
      await startServer(server.id)
    }
    setToggling(null)
  }

  const handleSave = async () => {
    if (!selectedServer) return
    setSaving(true)
    await configureServer(selectedServer.id, {
      ...selectedServer.config,
      address: serverAddress,
      api_key: apiKey
    })
    setSaving(false)
  }

  const leftSidebar = (
    <LeftSidebar title={t('mcp.title')}>
      {servers.map(s => (
        <div
          key={s.id}
          className={`left-item px-3 py-2.5 rounded-lg flex items-center gap-2.5 cursor-pointer text-sm mb-0.5 ${
            selectedServer?.id === s.id ? 'bg-accent text-white' : 'text-gray-400 hover:bg-card'
          }`}
          onClick={() => selectServer(s)}
        >
          <span className="text-base">{SERVER_ICONS[s.server_type] || '🔧'}</span>
          <span className="flex-1">{s.name}</span>
          {s.status === 'running' && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
        </div>
      ))}

      <div className="text-[11px] text-gray-500 uppercase tracking-wide px-3 py-4">{t('leftsidebar.statusOverview')}</div>
      <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        <span>{servers.filter(s => s.status === 'running').length} {t('mcp.runningCount')}</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500">
        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
        <span>{servers.filter(s => s.status === 'stopped').length} {t('mcp.stoppedCount')}</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500">
        <span className="w-2 h-2 rounded-full bg-red-500"></span>
        <span>{servers.filter(s => s.status === 'not-configured').length} {t('mcp.notConfiguredCount')}</span>
      </div>
    </LeftSidebar>
  )

  const center = (
    <>
      <div className="flex gap-2 p-3 border-b border-card">
        <input
          type="text"
          placeholder={t('search.placeholder')}
          className="flex-1 px-3 py-2 bg-card border border-card rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent"
        />
        <button className="px-4 py-2 bg-accent text-white text-sm rounded-lg hover:bg-opacity-90">
          + {t('mcp.addServer')}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
        <CardGrid>
          {servers.map(s => (
            <div
              key={s.id}
              className={`mcp-card bg-card rounded-lg p-3 cursor-pointer border-2 transition ${
                selectedServer?.id === s.id ? 'border-accent' : 'border-transparent hover:border-accent'
              }`}
              onClick={() => selectServer(s)}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{SERVER_ICONS[s.server_type] || '🔧'}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{s.name}</h4>
                  <p className="text-[10px] text-gray-500">{s.server_type}</p>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${STATUS_COLORS[s.status]} text-black`}>
                  {s.status === 'running' ? t('status.running') : s.status === 'stopped' ? t('status.stopped') : t('status.notConfigured')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-500">{s.server_type}</span>
                <button
                  onClick={(e) => handleToggle(e, s)}
                  disabled={toggling === s.id}
                  className={`w-8 h-4 rounded-full relative cursor-pointer disabled:opacity-50 ${STATUS_COLORS[s.status]}`}
                >
                  <span className={`absolute w-3 h-3 bg-white rounded-full top-0.5 ${s.status === 'running' ? 'right-0.5' : 'left-0.5'}`}></span>
                </button>
              </div>
            </div>
          ))}
        </CardGrid>
      </div>
    </>
  )

  const rightPanel = (
    <DetailPanel title={t('mcp.serverConfig')}>
      {selectedServer ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{SERVER_ICONS[selectedServer.server_type] || '🔧'}</span>
            <div>
              <div className="text-sm font-medium">{selectedServer.name}</div>
              <div className="text-xs text-gray-500">{selectedServer.server_type}</div>
            </div>
          </div>
          <div>
            <label className="text-[11px] text-gray-500 block mb-1.5">{t('mcp.serverAddress')}</label>
            <input
              type="text"
              placeholder="https://..."
              value={serverAddress}
              onChange={e => setServerAddress(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-xs text-[var(--text)]"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-500 block mb-1.5">{t('mcp.apiKey')}</label>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder={t('mcp.enterApiKey')}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className="flex-1 px-3 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-xs text-[var(--text)]"
              />
              <button className="px-2 py-2 bg-[var(--button-secondary-bg)] text-[var(--text)] text-xs rounded-lg hover:bg-[var(--button-secondary-hover)]">{t('mcp.show')}</button>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full px-3 py-2 bg-[var(--button-secondary-bg)] text-[var(--text)] text-xs rounded-lg hover:bg-[var(--button-secondary-hover)] disabled:opacity-50"
          >
            {saving ? '...' : t('mcp.saveConfig')}
          </button>
        </div>
      ) : (
        <div className="text-center text-gray-500 text-sm py-8">
          {t('mcp.selectHint')}
        </div>
      )}
    </DetailPanel>
  )

  return <ThreeColumnLayout leftSidebar={leftSidebar} center={center} rightPanel={rightPanel} />
}
