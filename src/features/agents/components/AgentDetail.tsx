import { useState } from 'react'
import type { Agent } from '../types'
import { useI18n } from '../../../shared/i18n'
import { useAgentsStore } from '../store'

interface AgentDetailProps {
  agent: Agent
}

type DetailTab = 'preview' | 'install' | 'edit' | 'version'

const TOOLS = ['Claude Code', 'Cursor', 'Windsurf', 'Aider']

export default function AgentDetail({ agent }: AgentDetailProps) {
  const { t } = useI18n()
  const { updateAgent, syncAgent } = useAgentsStore()
  const [activeTab, setActiveTab] = useState<DetailTab>('preview')
  const [editPrompt, setEditPrompt] = useState(agent.prompt)
  const [syncing, setSyncing] = useState(false)
  const [saving, setSaving] = useState(false)

  const tabs: { key: DetailTab; label: string }[] = [
    { key: 'preview', label: t('agent.preview') },
    { key: 'install', label: t('agent.install') },
    { key: 'edit', label: t('agent.edit') },
    { key: 'version', label: t('agent.currentVersion') }
  ]

  const handleSave = async () => {
    setSaving(true)
    await updateAgent(agent.id, { prompt: editPrompt })
    setSaving(false)
  }

  const handleSync = async () => {
    setSyncing(true)
    for (const tool of TOOLS) {
      await syncAgent(agent.id, tool)
    }
    setSyncing(false)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'preview':
        return (
          <div className="bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg p-4 font-mono text-xs leading-relaxed text-gray-400 whitespace-pre-wrap overflow-auto max-h-64">
            {agent.prompt}
          </div>
        )
      case 'install':
        return (
          <div className="space-y-3">
            {TOOLS.map(tool => (
              <div key={tool} className="flex items-center justify-between p-3 bg-card rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-base">{tool === 'Claude Code' ? '🤖' : tool === 'Cursor' ? '📎' : tool === 'Windsurf' ? '🌊' : '🔧'}</span>
                  <span className="text-sm">{tool}</span>
                </div>
                <span className="text-xs text-green-500">✓ {t('status.connected')}</span>
              </div>
            ))}
            <button
              onClick={handleSync}
              disabled={syncing}
              className="w-full mt-4 px-4 py-2.5 bg-accent text-white text-sm rounded-lg hover:bg-opacity-90 transition font-medium disabled:opacity-50"
            >
              {syncing ? '...' : t('agent.syncToSelected')}
            </button>
          </div>
        )
      case 'edit':
        return (
          <div className="space-y-3">
            <textarea
              className="w-full h-64 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg p-3 text-xs text-[var(--text)] font-mono resize-none focus:outline-none focus:ring-1 focus:ring-accent"
              value={editPrompt}
              onChange={e => setEditPrompt(e.target.value)}
            />
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full px-4 py-2.5 bg-accent text-white text-sm rounded-lg hover:bg-opacity-90 transition font-medium disabled:opacity-50"
            >
              {saving ? '...' : t('agent.saveChanges')}
            </button>
          </div>
        )
      case 'version':
        return (
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-card rounded-lg">
              <span className="text-sm text-gray-400">{t('agent.currentVersion')}</span>
              <span className="text-sm font-medium">v{agent.version}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-card rounded-lg">
              <span className="text-sm text-gray-400">{t('agent.latestVersion')}</span>
              <span className="text-sm font-medium text-green-500">v{agent.version} ↑</span>
            </div>
            <button className="w-full mt-4 px-4 py-2.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-opacity-90 transition font-medium">
              {t('agent.updateToLatest')}
            </button>
          </div>
        )
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{agent.icon}</span>
        <div>
          <h2 className="text-base font-medium">{agent.name}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{agent.description}</p>
        </div>
      </div>
      <div className="flex gap-2 text-[10px] text-gray-500 flex-wrap mb-3">
        <span className="px-1.5 py-0.5 bg-[var(--tag-bg)] rounded">📁 {agent.category}</span>
        <span className="px-1.5 py-0.5 bg-[var(--tag-bg)] rounded">🏷️ {(agent.tags || []).join(', ')}</span>
        <span className="px-1.5 py-0.5 bg-[var(--tag-bg)] rounded">📌 v{agent.version}</span>
      </div>

      <div className="flex border-b border-card">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-4 py-2.5 text-xs border-b-2 transition ${
              activeTab === tab.key ? 'text-accent border-accent' : 'text-gray-400 border-transparent hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4">{renderTabContent()}</div>
    </div>
  )
}
