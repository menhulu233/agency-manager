import { create } from 'zustand'
import type { LLMProvider, UsageStats } from './types'

interface LLMState {
  providers: LLMProvider[]
  selectedProvider: LLMProvider | null
  usage: UsageStats
  loading: boolean

  loadProviders: () => Promise<void>
  selectProvider: (provider: LLMProvider | null) => void
  configureProvider: (id: string, config: { api_key: string; default_model: string; is_active: boolean }) => Promise<void>
  loadUsage: () => Promise<void>
}

export const useLLMStore = create<LLMState>((set) => ({
  providers: [],
  selectedProvider: null,
  usage: { cost: 0, tokens: 0 },
  loading: false,

  loadProviders: async () => {
    set({ loading: true })
    try {
      const providers = await window.electronAPI.llm.listProviders()
      const parsed = providers.map((p: any) => ({
        ...p,
        is_active: Boolean(p.is_active),
        config: typeof p.config === 'string' ? JSON.parse(p.config) : p.config || {}
      }))
      set({ providers: parsed, loading: false })
    } catch (error) {
      console.error('Failed to load providers:', error)
      set({ loading: false })
    }
  },

  selectProvider: (provider) => set({ selectedProvider: provider }),

  configureProvider: async (id, config) => {
    await window.electronAPI.llm.configure(id, config)
    const providers = await window.electronAPI.llm.listProviders()
    const parsed = providers.map((p: any) => ({
      ...p,
      is_active: Boolean(p.is_active),
      config: typeof p.config === 'string' ? JSON.parse(p.config) : p.config || {}
    }))
    const selected = parsed.find((p: LLMProvider) => p.id === id) || null
    set({ providers: parsed, selectedProvider: selected })
  },

  loadUsage: async () => {
    const usage = await window.electronAPI.llm.getUsage()
    set({ usage })
  }
}))
