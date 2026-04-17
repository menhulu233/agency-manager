export interface CLITool {
  id: string
  name: string
  tool_type: string
  path?: string
  status: 'connected' | 'disconnected' | 'pending'
  last_sync?: string
}
