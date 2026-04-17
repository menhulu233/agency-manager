import { useEffect, useState } from 'react'
import { useTemplatesStore } from '../store'
import { ThreeColumnLayout, LeftSidebar, CardGrid, DetailPanel } from '../../../shared/components'
import { useI18n } from '../../../shared/i18n'

const CATEGORIES = [
  { id: 'web', icon: '🌐' },
  { id: 'mobile', icon: '📱' },
  { id: 'ai', icon: '🤖' },
  { id: 'devops', icon: '🔧' },
  { id: 'data', icon: '📊' }
]

export default function TemplatesView() {
  const { t } = useI18n()
  const { templates, selectedTemplate, loadTemplates, selectTemplate, applyTemplate, importTemplate } = useTemplatesStore()
  const [importing, setImporting] = useState(false)
  const [importText, setImportText] = useState('')
  const [importFormat, setImportFormat] = useState<'json' | 'yaml'>('yaml')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadTemplates()
  }, [])

  const handleApply = async () => {
    if (!selectedTemplate) return
    setProcessing(true)
    await applyTemplate(selectedTemplate.id)
    setProcessing(false)
  }

  const handleImport = async () => {
    if (!importText.trim()) return
    setProcessing(true)
    await importTemplate(importText, importFormat)
    setProcessing(false)
    setImporting(false)
    setImportText('')
  }

  const leftSidebar = (
    <LeftSidebar title={t('templates.templateCategories')}>
      {CATEGORIES.map(c => (
        <div
          key={c.id}
          className="left-item px-3 py-2.5 rounded-lg flex items-center gap-2.5 cursor-pointer text-sm text-gray-400 hover:bg-card transition mb-0.5"
          onClick={() => {}}
        >
          <span className="text-base">{c.icon}</span>
          <span className="flex-1">{t(`templates.category.${c.id}`)}</span>
        </div>
      ))}

      <div className="text-[11px] text-gray-500 uppercase tracking-wide px-3 py-4">{t('templates.source')}</div>
      <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        <span>{t('templates.localTemplates')}</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        <span>{t('templates.githubMarket')}</span>
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
          onClick={() => setImporting(true)}
          className="px-4 py-2 bg-accent text-white text-sm rounded-lg hover:bg-opacity-90"
        >
          {t('templates.importTemplate')}
        </button>
      </div>
      {importing && (
        <div className="p-3 border-b border-card bg-[var(--input-bg)]">
          <div className="flex gap-2 mb-2">
            <select
              value={importFormat}
              onChange={e => setImportFormat(e.target.value as 'json' | 'yaml')}
              className="px-2 py-1 bg-card border border-card rounded text-xs text-[var(--text)]"
            >
              <option value="yaml">YAML</option>
              <option value="json">JSON</option>
            </select>
            <button
              onClick={handleImport}
              disabled={processing}
              className="px-3 py-1 bg-accent text-white text-xs rounded disabled:opacity-50"
            >
              {processing ? '...' : t('common.import') || '导入'}
            </button>
            <button
              onClick={() => { setImporting(false); setImportText('') }}
              className="px-3 py-1 bg-[var(--button-secondary-bg)] text-[var(--text)] text-xs rounded hover:bg-[var(--button-secondary-hover)]"
            >
              {t('common.cancel') || '取消'}
            </button>
          </div>
          <textarea
            value={importText}
            onChange={e => setImportText(e.target.value)}
            placeholder={t('templates.pasteContent') || '粘贴模板内容...'}
            className="w-full h-24 bg-card border border-card rounded-lg p-2 text-xs text-[var(--text)] resize-none"
          />
        </div>
      )}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
        <CardGrid>
          {templates.map(tmpl => (
            <div
              key={tmpl.id}
              className="bg-card rounded-lg p-3 cursor-pointer border-2 border-transparent hover:border-accent transition"
              onClick={() => selectTemplate(tmpl)}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📄</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{tmpl.name}</h4>
                  <p className="text-[10px] text-gray-500">{tmpl.category}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[10px] text-gray-500">
                <span>{tmpl.files_count} {t('templates.fileCount')}</span>
                <span>{(tmpl.size / 1024).toFixed(1)}K</span>
              </div>
            </div>
          ))}
        </CardGrid>
      </div>
    </>
  )

  const rightPanel = (
    <DetailPanel title={t('templates.templateDetail')}>
      {selectedTemplate ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📄</span>
            <div>
              <div className="text-sm font-medium">{selectedTemplate.name}</div>
              <div className="text-xs text-gray-500">{selectedTemplate.category}</div>
            </div>
          </div>
          <p className="text-xs text-gray-400">{selectedTemplate.description}</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-card p-2 rounded text-center">
              <div className="text-sm font-bold">{selectedTemplate.files_count}</div>
              <div className="text-[10px] text-gray-500">{t('templates.fileCount')}</div>
            </div>
            <div className="bg-card p-2 rounded text-center">
              <div className="text-sm font-bold">{(selectedTemplate.size / 1024).toFixed(1)}K</div>
              <div className="text-[10px] text-gray-500">{t('templates.size')}</div>
            </div>
          </div>
          <button
            onClick={handleApply}
            disabled={processing}
            className="w-full px-4 py-2 bg-accent text-white text-sm rounded-lg hover:bg-opacity-90 disabled:opacity-50"
          >
            {processing ? '...' : t('templates.apply') || '应用模板'}
          </button>
        </div>
      ) : (
        <div className="text-center text-gray-500 text-sm py-8">
          {t('templates.selectHint')}
        </div>
      )}
    </DetailPanel>
  )

  return <ThreeColumnLayout leftSidebar={leftSidebar} center={center} rightPanel={rightPanel} />
}
