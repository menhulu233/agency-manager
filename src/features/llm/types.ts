export interface LLMProvider {
  id: string
  name: string
  provider_type: string
  api_key?: string
  default_model: string
  config: Record<string, any>
  is_active: boolean
  created_at: string
}

export interface UsageStats {
  cost: number
  tokens: number
}
