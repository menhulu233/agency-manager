import { create } from 'zustand'
import type { CLITool } from './types'

interface CLIsState {
  tools: CLITool[]
  selectedTool: CLITool | null
  loading: boolean
  loadTools: () => Promise<void>
  selectTool: (tool: CLITool | null) => void
  connectTool: (id: string) => Promise<void>
  disconnectTool: (id: string) => Promise<void>
  detectTools: () => Promise<void>
}

export const useCLIsStore = create<CLIsState>((set) => ({
  tools: [],
  selectedTool: null,
  loading: false,

  loadTools: async () => {
    set({ loading: true })
    try {
      const tools = await window.electronAPI.clis.list()
      set({ tools, loading: false })
    } catch (error) {
      console.error('Failed to load CLI tools:', error)
      set({ loading: false })
    }
  },

  selectTool: (tool) => set({ selectedTool: tool }),

  connectTool: async (id) => {
    await window.electronAPI.clis.connect(id)
    const tools = await window.electronAPI.clis.list()
    const selected = tools.find((tool: CLITool) => tool.id === id) || null
    set({ tools, selectedTool: selected })
  },

  disconnectTool: async (id) => {
    await window.electronAPI.clis.disconnect(id)
    const tools = await window.electronAPI.clis.list()
    const selected = tools.find((tool: CLITool) => tool.id === id) || null
    set({ tools, selectedTool: selected })
  },

  detectTools: async () => {
    const detected = await window.electronAPI.clis.detect()
    if (detected && detected.length > 0) {
      const tools = await window.electronAPI.clis.list()
      set({ tools })
    }
  }
}))
