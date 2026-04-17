export interface Template {
  id: string
  name: string
  category: string
  description: string
  files_count: number
  size: number
  source: 'local' | 'github'
  created_at: string
}
