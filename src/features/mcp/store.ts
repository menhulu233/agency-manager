import { create } from 'zustand'
import type { MCPServer } from './types'

interface MCPState {
  servers: MCPServer[]
  selectedServer: MCPServer | null
  loading: boolean
  loadServers: () => Promise<void>
  selectServer: (server: MCPServer | null) => void
  configureServer: (id: string, config: Record<string, any>) => Promise<void>
  startServer: (id: string) => Promise<void>
  stopServer: (id: string) => Promise<void>
}

export const useMCPStore = create<MCPState>((set) => ({
  servers: [],
  selectedServer: null,
  loading: false,

  loadServers: async () => {
    set({ loading: true })
    try {
      const servers = await window.electronAPI.mcp.listServers()
      const parsed = servers.map((s: any) => ({
        ...s,
        config: typeof s.config === 'string' ? JSON.parse(s.config) : s.config || {}
      }))
      set({ servers: parsed, loading: false })
    } catch (error) {
      console.error('Failed to load MCP servers:', error)
      set({ loading: false })
    }
  },

  selectServer: (server) => set({ selectedServer: server }),

  configureServer: async (id, config) => {
    await window.electronAPI.mcp.configure(id, config)
    const servers = await window.electronAPI.mcp.listServers()
    const parsed = servers.map((s: any) => ({
      ...s,
      config: typeof s.config === 'string' ? JSON.parse(s.config) : s.config || {}
    }))
    const selected = parsed.find((s: MCPServer) => s.id === id) || null
    set({ servers: parsed, selectedServer: selected })
  },

  startServer: async (id) => {
    await window.electronAPI.mcp.start(id)
    const servers = await window.electronAPI.mcp.listServers()
    const parsed = servers.map((s: any) => ({
      ...s,
      config: typeof s.config === 'string' ? JSON.parse(s.config) : s.config || {}
    }))
    const selected = parsed.find((s: MCPServer) => s.id === id) || null
    set({ servers: parsed, selectedServer: selected })
  },

  stopServer: async (id) => {
    await window.electronAPI.mcp.stop(id)
    const servers = await window.electronAPI.mcp.listServers()
    const parsed = servers.map((s: any) => ({
      ...s,
      config: typeof s.config === 'string' ? JSON.parse(s.config) : s.config || {}
    }))
    const selected = parsed.find((s: MCPServer) => s.id === id) || null
    set({ servers: parsed, selectedServer: selected })
  }
}))
