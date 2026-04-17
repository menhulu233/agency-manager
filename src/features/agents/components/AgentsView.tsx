import { useEffect, useMemo } from 'react'
import { useAgentsStore } from '../store'
import { ThreeColumnLayout, LeftSidebar, CardGrid, DetailPanel, Pagination, SearchBar } from '../../../shared/components'
import AgentCard from './AgentCard'
import AgentDetail from './AgentDetail'
import { useI18n } from '../../../shared/i18n'

// Static categories matching seed data
const CATEGORIES = [
  { id: 'engineering', name: 'Engineering', icon: '💻', color: '#3b82f6', sort_order: 1 },
  { id: 'design', name: 'Design', icon: '🎨', color: '#ec4899', sort_order: 2 },
  { id: 'finance', name: 'Finance', icon: '💰', color: '#22c55e', sort_order: 3 },
  { id: 'marketing', name: 'Marketing', icon: '📢', color: '#f59e0b', sort_order: 4 },
  { id: 'sales', name: 'Sales', icon: '💼', color: '#6366f1', sort_order: 5 },
  { id: 'support', name: 'Support', icon: '🎧', color: '#14b8a6', sort_order: 6 },
  { id: 'specialized', name: 'Specialized', icon: '🎯', color: '#e94560', sort_order: 7 }
]

export default function AgentsView() {
  const { t } = useI18n()
  const {
    agents,
    selectedCategory,
    selectedAgent,
    searchQuery,
    filter,
    currentPage,
    pageSize,
    loadAgents,
    selectCategory,
    selectAgent,
    setSearchQuery,
    setFilter,
    setCurrentPage
  } = useAgentsStore()

  useEffect(() => {
    loadAgents()
  }, [])

  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesCategory = !selectedCategory || agent.category === selectedCategory
      const matchesSearch = !searchQuery || agent.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filter === 'all' || agent.status === filter
      return matchesCategory && matchesSearch && matchesFilter
    })
  }, [agents, selectedCategory, searchQuery, filter])

  const paginatedAgents = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredAgents.slice(start, start + pageSize)
  }, [filteredAgents, currentPage, pageSize])

  const leftSidebar = (
    <LeftSidebar title={t('leftsidebar.categories')}>
      <div
        className={`left-item px-3 py-2.5 rounded-lg flex items-center gap-2.5 cursor-pointer text-sm mb-0.5 ${
          !selectedCategory ? 'bg-accent text-white' : 'text-gray-400 hover:bg-card'
        }`}
        onClick={() => selectCategory(null)}
      >
        <span className="text-base">📋</span>
        <span className="flex-1">{t('category.all')}</span>
      </div>
      {CATEGORIES.map(cat => (
        <div
          key={cat.id}
          className={`left-item px-3 py-2.5 rounded-lg flex items-center gap-2.5 cursor-pointer text-sm mb-0.5 ${
            selectedCategory === cat.id ? 'bg-accent text-white' : 'text-gray-400 hover:bg-card'
          }`}
          onClick={() => selectCategory(cat.id)}
        >
          <span className="text-base">{cat.icon}</span>
          <span className="flex-1">{cat.name}</span>
        </div>
      ))}

      <div className="text-[11px] text-gray-500 uppercase tracking-wide px-3 py-4">{t('leftsidebar.toolStatus')}</div>
      <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        <span>Claude Code {t('status.connected')}</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        <span>Cursor {t('status.connected')}</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500">
        <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
        <span>OpenClaw {t('status.pending')}</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-500">
        <span className="w-2 h-2 rounded-full bg-red-500"></span>
        <span>Windsurf {t('status.notInstalled')}</span>
      </div>
    </LeftSidebar>
  )

  const center = (
    <>
      <div className="flex gap-2 p-3 border-b border-card">
        <SearchBar placeholder={t('search.placeholder')} onSearch={setSearchQuery} />
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as any)}
          className="px-3 py-2 bg-card border border-card rounded-lg text-sm text-gray-300 focus:outline-none focus:border-accent"
        >
          <option value="all">{t('filter.all')}</option>
          <option value="installed">{t('filter.installed')}</option>
          <option value="not-installed">{t('filter.notInstalled')}</option>
          <option value="outdated">{t('filter.outdated')}</option>
        </select>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
        <CardGrid>
          {paginatedAgents.map(agent => (
            <AgentCard
              key={agent.id}
              agent={agent}
              selected={selectedAgent?.id === agent.id}
              onClick={() => selectAgent(agent)}
            />
          ))}
        </CardGrid>
      </div>
      <Pagination
        total={filteredAgents.length}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </>
  )

  const rightPanel = (
    <DetailPanel title={t('agent.detail')}>
      {selectedAgent ? (
        <AgentDetail agent={selectedAgent} />
      ) : (
        <div className="text-center text-gray-500 text-sm py-8">
          {t('agent.selectHint')}
        </div>
      )}
    </DetailPanel>
  )

  return <ThreeColumnLayout leftSidebar={leftSidebar} center={center} rightPanel={rightPanel} />
}
