import { useEffect, useState } from 'react'
import { useLLMStore } from '../store'
import { ThreeColumnLayout, LeftSidebar, CardGrid, DetailPanel } from '../../../shared/components'
import { useI18n } from '../../../shared/i18n'

const PROVIDER_COLORS: Record<string, string> = {
  anthropic: '#ff6b35',
  openai: '#10a37f',
  google: '#4285f4',
  groq: '#9f7aea',
  ollama: '#f97316'
}

export default function LLMView() {
  const { t } = useI18n()
  const { providers, selectedProvider, loadProviders, selectProvider, configureProvider, loadUsage, usage } = useLLMStore()
  const [apiKey, setApiKey] = useState('')
  const [defaultModel, setDefaultModel] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadProviders()
    loadUsage()
  }, [])

  useEffect(() => {
    if (selectedProvider) {
      setApiKey(selectedProvider.api_key || '')
      setDefaultModel(selectedProvider.default_model || '')
    }
  }, [selectedProvider])

  const handleSave = async () => {
    if (!selectedProvider) return
    setSaving(true)
    await configureProvider(selectedProvider.id, {
      api_key: apiKey,
      default_model: defaultModel,
      is_active: true
    })
    setSaving(false)
  }

  const leftSidebar = (
    <LeftSidebar title={t('llm.title')}>
      {providers.map(p => (
        <div
          key={p.id}
          className={`left-item px-3 py-2.5 rounded-lg flex items-center gap-2.5 cursor-pointer text-sm mb-0.5 ${
            selectedProvider?.id === p.id ? 'bg-accent text-white' : 'text-gray-400 hover:bg-card'
          }`}
          onClick={() => selectProvider(p)}
        >
          <span
            className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold text-white"
            style={{ backgroundColor: PROVIDER_COLORS[p.provider_type] || '#666' }}
          >
            {p.name[0]}
          </span>
          <span className="flex-1">{p.name}</span>
          {p.is_active && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
        </div>
      ))}

      <div className="text-[11px] text-gray-500 uppercase tracking-wide px-3 py-4">{t('leftsidebar.usageStats')}</div>
      <div className="px-3 space-y-2">
        <div className="bg-card p-3 rounded-lg text-center">
          <div className="text-xl font-bold text-green-500">${usage.cost.toFixed(2)}</div>
          <div className="text-[11px] text-gray-500">{t('leftsidebar.monthlyCost')}</div>
        </div>
        <div className="bg-card p-3 rounded-lg text-center">
          <div className="text-xl font-bold">{usage.tokens.toLocaleString()}</div>
          <div className="text-[11px] text-gray-500">{t('leftsidebar.tokenUsage')}</div>
        </div>
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
          + {t('llm.addNew')}
        </button>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
        <CardGrid>
          {providers.map(p => (
            <div
              key={p.id}
              className={`llm-card bg-card rounded-lg p-3 cursor-pointer border-2 transition ${
                selectedProvider?.id === p.id ? 'border-accent' : 'hover:border-accent'
              }`}
              style={{ borderColor: selectedProvider?.id === p.id ? '#e94560' : `${PROVIDER_COLORS[p.provider_type]}50` }}
              onClick={() => selectProvider(p)}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: PROVIDER_COLORS[p.provider_type] || '#666' }}
                >
                  {p.name[0]}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{p.name}</h4>
                  <p className="text-[10px] text-gray-500">{p.provider_type}</p>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${p.is_active ? 'bg-green-500 text-black' : 'bg-gray-600 text-gray-300'}`}>
                  {p.is_active ? t('status.configured') : t('status.notConfigured')}
                </span>
              </div>
              <div className="text-[10px] px-1.5 py-0.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded font-mono text-gray-400">
                {p.default_model}
              </div>
            </div>
          ))}
        </CardGrid>
      </div>
    </>
  )

  const rightPanel = (
    <DetailPanel title={t('llm.title')}>
      {selectedProvider ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <span
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: PROVIDER_COLORS[selectedProvider.provider_type] || '#666' }}
            >
              {selectedProvider.name[0]}
            </span>
            <div>
              <div className="text-sm font-medium">{selectedProvider.name}</div>
              <div className="text-xs text-gray-500">{selectedProvider.provider_type}</div>
            </div>
          </div>
          <div>
            <label className="text-[11px] text-gray-500 block mb-1.5">{t('mcp.apiKey')}</label>
            <input
              type="password"
              placeholder={t('mcp.enterApiKey')}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-sm text-[var(--text)]"
            />
          </div>
          <div>
            <label className="text-[11px] text-gray-500 block mb-1.5">{t('llm.defaultModel')}</label>
            <input
              type="text"
              value={defaultModel}
              onChange={e => setDefaultModel(e.target.value)}
              className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-sm text-[var(--text)]"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full px-4 py-2 bg-accent text-white text-sm rounded-lg hover:bg-opacity-90 disabled:opacity-50"
          >
            {saving ? '...' : t('llm.saveAndEnable')}
          </button>
        </div>
      ) : (
        <div className="text-center text-gray-500 text-xs py-8">
          {t('llm.selectHint')}
        </div>
      )}
    </DetailPanel>
  )

  return <ThreeColumnLayout leftSidebar={leftSidebar} center={center} rightPanel={rightPanel} />
}
