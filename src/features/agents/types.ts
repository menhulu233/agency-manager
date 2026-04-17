export interface Agent {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  icon: string
  prompt: string
  version: string
  status: 'installed' | 'not-installed' | 'outdated'
  tool_connections: string[]
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  sort_order: number
}
