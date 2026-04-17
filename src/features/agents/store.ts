import { create } from 'zustand'
import type { Agent, Category } from './types'

interface AgentsState {
  agents: Agent[]
  categories: Category[]
  selectedCategory: string | null
  selectedAgent: Agent | null
  searchQuery: string
  filter: 'all' | 'installed' | 'not-installed' | 'outdated'
  currentPage: number
  pageSize: number
  loading: boolean

  // Actions
  setAgents: (agents: Agent[]) => void
  setCategories: (categories: Category[]) => void
  selectCategory: (categoryId: string | null) => void
  selectAgent: (agent: Agent | null) => void
  setSearchQuery: (query: string) => void
  setFilter: (filter: 'all' | 'installed' | 'not-installed' | 'outdated') => void
  setCurrentPage: (page: number) => void
  loadAgents: () => Promise<void>
  updateAgent: (id: string, data: Partial<Agent>) => Promise<void>
  syncAgent: (id: string, tool: string) => Promise<void>
}

export const useAgentsStore = create<AgentsState>((set) => ({
  agents: [],
  categories: [],
  selectedCategory: null,
  selectedAgent: null,
  searchQuery: '',
  filter: 'all',
  currentPage: 1,
  pageSize: 12,
  loading: false,

  setAgents: (agents) => set({ agents }),
  setCategories: (categories) => set({ categories }),
  selectCategory: (categoryId) => set({ selectedCategory: categoryId, currentPage: 1 }),
  selectAgent: (agent) => set({ selectedAgent: agent }),
  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setFilter: (filter) => set({ filter, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),

  loadAgents: async () => {
    set({ loading: true })
    try {
      const agents = await window.electronAPI.agents.list()
      // Parse JSON fields that come from SQLite as strings
      const parsed = agents.map((a: any) => ({
        ...a,
        tags: typeof a.tags === 'string' ? JSON.parse(a.tags) : a.tags || [],
        tool_connections: typeof a.tool_connections === 'string' ? JSON.parse(a.tool_connections) : a.tool_connections || []
      }))
      set({ agents: parsed, loading: false })
    } catch (error) {
      console.error('Failed to load agents:', error)
      set({ loading: false })
    }
  },

  updateAgent: async (id, data) => {
    const agent = await window.electronAPI.agents.getById(id)
    if (!agent) return
    const updated = await window.electronAPI.agents.update(id, { ...agent, ...data })
    const parsed = {
      ...updated,
      tags: typeof updated.tags === 'string' ? JSON.parse(updated.tags) : updated.tags || [],
      tool_connections: typeof updated.tool_connections === 'string' ? JSON.parse(updated.tool_connections) : updated.tool_connections || []
    }
    set((state) => ({
      agents: state.agents.map((a) => (a.id === id ? parsed : a)),
      selectedAgent: state.selectedAgent?.id === id ? parsed : state.selectedAgent
    }))
  },

  syncAgent: async (id, tool) => {
    await window.electronAPI.agents.sync(id, tool)
    const updated = await window.electronAPI.agents.getById(id)
    if (!updated) return
    const parsed = {
      ...updated,
      tags: typeof updated.tags === 'string' ? JSON.parse(updated.tags) : updated.tags || [],
      tool_connections: typeof updated.tool_connections === 'string' ? JSON.parse(updated.tool_connections) : updated.tool_connections || []
    }
    set((state) => ({
      agents: state.agents.map((a) => (a.id === id ? parsed : a)),
      selectedAgent: state.selectedAgent?.id === id ? parsed : state.selectedAgent
    }))
  }
}))
