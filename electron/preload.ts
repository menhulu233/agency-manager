import { contextBridge, ipcRenderer } from 'electron'

// Define the API types
export interface ElectronAPI {
  agents: {
    list: (category?: string) => Promise<any[]>
    getById: (id: string) => Promise<any>
    create: (agent: any) => Promise<any>
    update: (id: string, agent: any) => Promise<any>
    delete: (id: string) => Promise<void>
    sync: (id: string, tool: string) => Promise<void>
  }
  llm: {
    listProviders: () => Promise<any[]>
    configure: (id: string, config: any) => Promise<void>
    test: (id: string) => Promise<boolean>
    getUsage: () => Promise<any>
  }
  mcp: {
    listServers: () => Promise<any[]>
    configure: (id: string, config: any) => Promise<void>
    start: (id: string) => Promise<void>
    stop: (id: string) => Promise<void>
  }
  teams: {
    list: () => Promise<any[]>
    create: (team: any) => Promise<any>
    update: (id: string, team: any) => Promise<any>
    delete: (id: string) => Promise<void>
    launch: (id: string) => Promise<void>
  }
  clis: {
    list: () => Promise<any[]>
    detect: () => Promise<any[]>
    connect: (id: string) => Promise<void>
    disconnect: (id: string) => Promise<void>
  }
  templates: {
    list: (category?: string) => Promise<any[]>
    import: (content: string, format: 'json' | 'yaml') => Promise<any>
    export: (ids: string[], format: 'json' | 'yaml') => Promise<string>
    apply: (id: string) => Promise<void>
  }
  settings: {
    get: (key: string) => Promise<any>
    update: (key: string, value: any) => Promise<void>
    getAll: () => Promise<Record<string, any>>
  },
  window: {
    minimize: () => void
    maximize: () => void
    close: () => void
    isMaximized: () => Promise<boolean>
  },
  theme: {
    updateTitleBar: (colors: { bg: string; symbol: string; windowBg: string }) => void
  }
}

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  agents: {
    list: (category?: string) => ipcRenderer.invoke('agents:list', category),
    getById: (id: string) => ipcRenderer.invoke('agents:getById', id),
    create: (agent: any) => ipcRenderer.invoke('agents:create', agent),
    update: (id: string, agent: any) => ipcRenderer.invoke('agents:update', id, agent),
    delete: (id: string) => ipcRenderer.invoke('agents:delete', id),
    sync: (id: string, tool: string) => ipcRenderer.invoke('agents:sync', id, tool)
  },
  llm: {
    listProviders: () => ipcRenderer.invoke('llm:listProviders'),
    configure: (id: string, config: any) => ipcRenderer.invoke('llm:configure', id, config),
    test: (id: string) => ipcRenderer.invoke('llm:test', id),
    getUsage: () => ipcRenderer.invoke('llm:getUsage')
  },
  mcp: {
    listServers: () => ipcRenderer.invoke('mcp:listServers'),
    configure: (id: string, config: any) => ipcRenderer.invoke('mcp:configure', id, config),
    start: (id: string) => ipcRenderer.invoke('mcp:start', id),
    stop: (id: string) => ipcRenderer.invoke('mcp:stop', id)
  },
  teams: {
    list: () => ipcRenderer.invoke('teams:list'),
    create: (team: any) => ipcRenderer.invoke('teams:create', team),
    update: (id: string, team: any) => ipcRenderer.invoke('teams:update', id, team),
    delete: (id: string) => ipcRenderer.invoke('teams:delete', id),
    launch: (id: string) => ipcRenderer.invoke('teams:launch', id)
  },
  clis: {
    list: () => ipcRenderer.invoke('clis:list'),
    detect: () => ipcRenderer.invoke('clis:detect'),
    connect: (id: string) => ipcRenderer.invoke('clis:connect', id),
    disconnect: (id: string) => ipcRenderer.invoke('clis:disconnect', id)
  },
  templates: {
    list: (category?: string) => ipcRenderer.invoke('templates:list', category),
    import: (content: string, format: 'json' | 'yaml') => ipcRenderer.invoke('templates:import', content, format),
    export: (ids: string[], format: 'json' | 'yaml') => ipcRenderer.invoke('templates:export', ids, format),
    apply: (id: string) => ipcRenderer.invoke('templates:apply', id)
  },
  settings: {
    get: (key: string) => ipcRenderer.invoke('settings:get', key),
    update: (key: string, value: any) => ipcRenderer.invoke('settings:update', key, value),
    getAll: () => ipcRenderer.invoke('settings:getAll')
  },
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:isMaximized')
  },
  theme: {
    updateTitleBar: (colors) => ipcRenderer.send('theme:updateTitleBar', colors)
  }
} as ElectronAPI)
