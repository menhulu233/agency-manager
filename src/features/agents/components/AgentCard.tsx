import type { Agent } from '../types'
import { useI18n } from '../../../shared/i18n'

interface AgentCardProps {
  agent: Agent
  selected: boolean
  onClick: () => void
}

export default function AgentCard({ agent, selected, onClick }: AgentCardProps) {
  const { t } = useI18n()

  const statusColors = {
    'installed': 'bg-green-500 text-black',
    'not-installed': 'bg-gray-600 text-gray-300',
    'outdated': 'bg-yellow-500 text-black'
  }

  const statusLabels = {
    'installed': t('filter.installed'),
    'not-installed': t('filter.notInstalled'),
    'outdated': t('filter.outdated')
  }

  return (
    <div
      className={`agent-card bg-card rounded-lg p-3 cursor-pointer border-2 transition ${
        selected ? 'border-accent' : 'border-transparent hover:border-accent'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{agent.icon}</span>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium truncate">{agent.name}</h4>
          <p className="text-[10px] text-gray-500">{agent.category}</p>
        </div>
        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${statusColors[agent.status]}`}>
          {statusLabels[agent.status]}
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {(agent.tags || []).slice(0, 3).map(tag => (
          <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-blue-900/50 rounded text-gray-400">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
