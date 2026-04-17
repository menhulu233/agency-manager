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

const SERVER_TYPES = ['pinecone', 'local', 'github', 'slack', 'database']

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
  const [showAddModal, setShowAddModal] = useState(false)
  const [addForm, setAddForm] = useState({ name: '', server_type: 'local', address: '', api_key: '' })
  const [adding, setAdding] = useState(false)

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

  const handleAdd = async () => {
    if (!addForm.name.trim()) return
    setAdding(true)
    // UI placeholder - backend create logic to be wired later
    console.log('Create server:', addForm)
    setAdding(false)
    setShowAddModal(false)
    setAddForm({ name: '', server_type: 'local', address: '', api_key: '' })
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
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-accent text-white text-sm rounded-lg hover:bg-opacity-90"
        >
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

      {/* Add Server Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-panel rounded-xl p-5 w-[360px] shadow-xl border border-card">
            <h3 className="text-sm font-medium mb-4">{t('mcp.addNewServer') || '添加 MCP 服务器'}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-gray-500 block mb-1">{t('mcp.serverName') || '名称'}</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-sm text-[var(--text)]"
                  placeholder="Memory"
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 block mb-1">{t('mcp.serverType') || '类型'}</label>
                <select
                  value={addForm.server_type}
                  onChange={e => setAddForm({ ...addForm, server_type: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-sm text-[var(--text)]"
                >
                  {SERVER_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-gray-500 block mb-1">{t('mcp.serverAddress')}</label>
                <input
                  type="text"
                  value={addForm.address}
                  onChange={e => setAddForm({ ...addForm, address: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-sm text-[var(--text)]"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 block mb-1">{t('mcp.apiKey')}</label>
                <input
                  type="password"
                  value={addForm.api_key}
                  onChange={e => setAddForm({ ...addForm, api_key: e.target.value })}
                  className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-sm text-[var(--text)]"
                  placeholder={t('mcp.enterApiKey')}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleAdd}
                  disabled={adding}
                  className="flex-1 px-3 py-2 bg-accent text-white text-xs rounded-lg disabled:opacity-50"
                >
                  {adding ? '...' : t('common.create') || '创建'}
                </button>
                <button
                  onClick={() => { setShowAddModal(false); setAddForm({ name: '', server_type: 'local', address: '', api_key: '' }) }}
                  className="flex-1 px-3 py-2 bg-[var(--button-secondary-bg)] text-[var(--text)] text-xs rounded-lg hover:bg-[var(--button-secondary-hover)]"
                >
                  {t('common.cancel') || '取消'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
