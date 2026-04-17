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

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
