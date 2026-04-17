export interface MCPServer {
  id: string
  name: string
  server_type: string
  config: Record<string, any>
  status: 'running' | 'stopped' | 'not-configured'
  created_at: string
  updated_at: string
}
