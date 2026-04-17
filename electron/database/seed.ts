import type { Database } from 'sql.js'
import { v4 as uuidv4 } from 'uuid'

export function seedDatabase(db: Database): void {
  // Check if already seeded
  const result = db.exec('SELECT COUNT(*) as count FROM categories')
  const count = result.length > 0 ? result[0].values[0][0] as number : 0
  if (count > 0) return

  const now = new Date().toISOString()

  // Seed categories
  const categories = [
    { id: 'engineering', name: 'Engineering', icon: '💻', color: '#3b82f6', sort_order: 1 },
    { id: 'design', name: 'Design', icon: '🎨', color: '#ec4899', sort_order: 2 },
    { id: 'finance', name: 'Finance', icon: '💰', color: '#22c55e', sort_order: 3 },
    { id: 'marketing', name: 'Marketing', icon: '📢', color: '#f59e0b', sort_order: 4 },
    { id: 'sales', name: 'Sales', icon: '💼', color: '#6366f1', sort_order: 5 },
    { id: 'support', name: 'Support', icon: '🎧', color: '#14b8a6', sort_order: 6 },
    { id: 'specialized', name: 'Specialized', icon: '🎯', color: '#e94560', sort_order: 7 }
  ]

  const insertCategory = db.prepare('INSERT INTO categories (id, name, icon, color, sort_order) VALUES (?, ?, ?, ?, ?)')
  for (const cat of categories) {
    insertCategory.run([cat.id, cat.name, cat.icon, cat.color, cat.sort_order])
  }
  insertCategory.free()

  // Seed agents
  const agents = [
    {
      id: uuidv4(),
      name: 'Frontend Developer',
      category: 'engineering',
      description: 'Expert frontend developer specializing in modern web technologies.',
      tags: JSON.stringify(['react', 'vue', 'typescript']),
      icon: '🖥️',
      prompt: '# Frontend Developer\n\nYou are an expert frontend developer...',
      version: '1.2',
      status: 'installed'
    },
    {
      id: uuidv4(),
      name: 'Backend Architect',
      category: 'engineering',
      description: 'Senior backend architect with expertise in distributed systems.',
      tags: JSON.stringify(['api', 'docker', 'kubernetes']),
      icon: '🏗️',
      prompt: '# Backend Architect\n\nYou are a senior backend architect...',
      version: '1.1',
      status: 'outdated'
    },
    {
      id: uuidv4(),
      name: 'AI Engineer',
      category: 'specialized',
      description: 'AI/ML engineer specializing in LLM applications.',
      tags: JSON.stringify(['python', 'llm', 'ml']),
      icon: '🤖',
      prompt: '# AI Engineer\n\nYou are an AI/ML engineer...',
      version: '1.0',
      status: 'not-installed'
    }
  ]

  const insertAgent = db.prepare(`
    INSERT INTO agents (id, name, category, description, tags, icon, prompt, version, status, tool_connections, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, '[]', ?, ?)
  `)
  for (const agent of agents) {
    insertAgent.run([agent.id, agent.name, agent.category, agent.description, agent.tags, agent.icon, agent.prompt, agent.version, agent.status, now, now])
  }
  insertAgent.free()

  // Seed LLM providers
  const providers = [
    { id: 'anthropic', name: 'Claude', provider_type: 'anthropic', default_model: 'claude-3-sonnet-20240229', is_active: 1 },
    { id: 'openai', name: 'GPT-4', provider_type: 'openai', default_model: 'gpt-4-turbo-preview', is_active: 1 },
    { id: 'google', name: 'Gemini', provider_type: 'google', default_model: 'gemini-pro', is_active: 0 },
    { id: 'groq', name: 'Groq', provider_type: 'groq', default_model: 'mixtral-8x7b-32768', is_active: 1 },
    { id: 'ollama', name: 'Ollama', provider_type: 'ollama', default_model: 'llama3.1', is_active: 1 }
  ]

  const insertProvider = db.prepare(`
    INSERT INTO llm_providers (id, name, provider_type, default_model, config, is_active, created_at)
    VALUES (?, ?, ?, ?, '{}', ?, ?)
  `)
  for (const p of providers) {
    insertProvider.run([p.id, p.name, p.provider_type, p.default_model, p.is_active, now])
  }
  insertProvider.free()

  // Seed MCP servers
  const mcpServers = [
    { id: 'memory', name: 'Memory', server_type: 'pinecone', status: 'running' },
    { id: 'filesystem', name: 'Filesystem', server_type: 'local', status: 'running' },
    { id: 'github', name: 'GitHub', server_type: 'github', status: 'stopped' },
    { id: 'slack', name: 'Slack', server_type: 'slack', status: 'not-configured' }
  ]

  const insertMCPServer = db.prepare(`
    INSERT INTO mcp_servers (id, name, server_type, config, status, created_at, updated_at)
    VALUES (?, ?, ?, '{}', ?, ?, ?)
  `)
  for (const s of mcpServers) {
    insertMCPServer.run([s.id, s.name, s.server_type, s.status, now, now])
  }
  insertMCPServer.free()

  // Seed CLI tools
  const cliTools = [
    { id: 'claude-code', name: 'Claude Code', tool_type: 'claude_code', status: 'connected' },
    { id: 'cursor', name: 'Cursor', tool_type: 'cursor', status: 'connected' },
    { id: 'openclaw', name: 'OpenClaw', tool_type: 'openclaw', status: 'pending' },
    { id: 'windsurf', name: 'Windsurf', tool_type: 'windsurf', status: 'disconnected' }
  ]

  const insertCLITool = db.prepare(`
    INSERT INTO cli_tools (id, name, tool_type, status, last_sync)
    VALUES (?, ?, ?, ?, ?)
  `)
  for (const t of cliTools) {
    insertCLITool.run([t.id, t.name, t.tool_type, t.status, now])
  }
  insertCLITool.free()

  // Seed templates
  const templates = [
    { id: 'fullstack', name: 'React + Node', category: 'web', description: 'Full-stack web application', files_count: 42, size: 3200, source: 'local' },
    { id: 'reactnative', name: 'React Native', category: 'mobile', description: 'Cross-platform mobile app', files_count: 28, size: 2100, source: 'local' },
    { id: 'aiagent', name: 'AI Agent', category: 'ai', description: 'AI agent with MCP', files_count: 35, size: 2800, source: 'local' }
  ]

  const insertTemplate = db.prepare(`
    INSERT INTO templates (id, name, category, description, files_count, size, source, content, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, '{}', ?)
  `)
  for (const t of templates) {
    insertTemplate.run([t.id, t.name, t.category, t.description, t.files_count, t.size, t.source, now])
  }
  insertTemplate.free()

  // Seed settings (values must be valid JSON strings because settings:get uses JSON.parse)
  const settings = [
    { id: uuidv4(), key: 'theme', value: JSON.stringify('dark') },
    { id: uuidv4(), key: 'language', value: JSON.stringify('zh-CN') },
    { id: uuidv4(), key: 'autoSync', value: JSON.stringify(true) }
  ]

  const insertSetting = db.prepare('INSERT INTO settings (id, key, value) VALUES (?, ?, ?)')
  for (const s of settings) {
    insertSetting.run([s.id, s.key, s.value])
  }
  insertSetting.free()
}
