import { useEffect } from 'react'
import { useCLIsStore } from '../store'
import { ThreeColumnLayout, LeftSidebar, CardGrid, DetailPanel } from '../../../shared/components'
import { useI18n } from '../../../shared/i18n'

const TOOL_ICONS: Record<string, string> = {
  claude_code: '🤖',
  cursor: '📎',
  openclaw: '🌊',
  windsurf: '🌀',
  aider: '🔧',
  opencode: '🔓',
  gemini_cli: '♊',
  kimi: '🌙',
  qwen: '🔶'
}

const STATUS_COLORS = {
  connected: 'bg-green-500',
  disconnected: 'bg-gray-600',
  pending: 'bg-yellow-500'
}

export default function CLIsView() {
  const { t } = useI18n()
  const { tools, selectedTool, loading, detecting, detectMessage, loadTools, selectTool, connectTool, disconnectTool, detectTools } = useCLIsStore()

  useEffect(() => {
    loadTools()
  }, [])

  const handleConnectToggle = async () => {
    if (!selectedTool) return
    if (selectedTool.status === 'connected') {
      await disconnectTool(selectedTool.id)
    } else {
      await connectTool(selectedTool.id)
    }
  }

  const connectedCount = tools.filter(t => t.status === 'connected').length

  const leftSidebar = (
    <LeftSidebar title={t('clis.title')}>
      {tools.map(tool => (
        <div
          key={tool.id}
          className={`left-item px-3 py-2.5 rounded-lg flex items-center gap-2.5 cursor-pointer text-sm mb-0.5 ${
            selectedTool?.id === tool.id ? 'bg-accent text-white' : 'text-gray-400 hover:bg-card'
          }`}
          onClick={() => selectTool(tool)}
        >
          <span className="text-base">{TOOL_ICONS[tool.tool_type] || '🔧'}</span>
          <span className="flex-1">{tool.name}</span>
          <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[tool.status]}`}></span>
        </div>
      ))}

      <div className="text-[11px] text-gray-500 uppercase tracking-wide px-3 py-4">{t('leftsidebar.statusOverview')}</div>
      <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        <span>{connectedCount} {t('status.connected')}</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500">
        <span className="w-2 h-2 rounded-full bg-gray-600"></span>
        <span>{tools.length - connectedCount} {t('status.disconnected')}</span>
      </div>
    </LeftSidebar>
  )

  const center = (
    <>
      <div className="flex gap-2 p-3 border-b border-card items-center">
        <input
          type="text"
          placeholder={t('search.placeholder')}
          className="flex-1 px-3 py-2 bg-card border border-card rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent"
        />
        <button
          onClick={() => detectTools()}
          disabled={detecting}
          className="px-4 py-2 bg-accent text-white text-sm rounded-lg hover:bg-opacity-90 disabled:opacity-50"
        >
          {detecting ? '...' : `+ ${t('clis.detectNew')}`}
        </button>
      </div>
      {detectMessage && (
        <div className="px-3 pt-2">
          <div className="bg-[var(--input-bg)] border border-card rounded-lg px-3 py-2 text-xs text-gray-400">
            {detectMessage}
          </div>
        </div>
      )}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
        {tools.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm">
            <span className="text-3xl mb-2">🔍</span>
            <p>No CLI tools found</p>
            <p className="text-xs text-gray-600 mt-1">Click "Detect New" to scan your system</p>
          </div>
        ) : (
          <CardGrid>
            {tools.map(tool => (
              <div
                key={tool.id}
                className={`cli-card bg-card rounded-lg p-3 cursor-pointer border-2 transition ${
                  selectedTool?.id === tool.id ? 'border-accent' : 'border-transparent hover:border-accent'
                }`}
                onClick={() => selectTool(tool)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{TOOL_ICONS[tool.tool_type] || '🔧'}</span>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate">{tool.name}</h4>
                    <p className="text-[10px] text-gray-500">{tool.tool_type}</p>
                  </div>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${STATUS_COLORS[tool.status]} text-black`}>
                    {tool.status === 'connected' ? t('status.connected') : tool.status === 'disconnected' ? t('status.disconnected') : t('status.pending')}
                  </span>
                </div>
                <div className="text-[10px] px-1.5 py-0.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded font-mono text-gray-400 truncate">
                  {tool.path || t('clis.notDetected')}
                </div>
              </div>
            ))}
          </CardGrid>
        )}
      </div>
    </>
  )

  const rightPanel = (
    <DetailPanel title={t('clis.toolDetail')}>
      {selectedTool ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">{TOOL_ICONS[selectedTool.tool_type] || '🔧'}</span>
            <div>
              <div className="text-sm font-medium">{selectedTool.name}</div>
              <div className="text-xs text-gray-500">{selectedTool.tool_type}</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between p-2 bg-card rounded">
              <span className="text-xs text-gray-500">{t('clis.status')}</span>
              <span className="text-xs">{selectedTool.status === 'connected' ? t('status.connected') : t('status.disconnected')}</span>
            </div>
            <div className="flex justify-between p-2 bg-card rounded">
              <span className="text-xs text-gray-500">{t('clis.path')}</span>
              <span className="text-xs truncate max-w-[180px]" title={selectedTool.path}>{selectedTool.path || t('clis.notDetected')}</span>
            </div>
          </div>
          <button
            onClick={handleConnectToggle}
            className="w-full px-4 py-2 bg-accent text-white text-sm rounded-lg hover:bg-opacity-90"
          >
            {selectedTool.status === 'connected' ? t('clis.disconnect') : t('clis.connect')}
          </button>
        </div>
      ) : (
        <div className="text-center text-gray-500 text-sm py-8">
          {t('clis.selectHint')}
        </div>
      )}
    </DetailPanel>
  )

  return <ThreeColumnLayout leftSidebar={leftSidebar} center={center} rightPanel={rightPanel} />
}
