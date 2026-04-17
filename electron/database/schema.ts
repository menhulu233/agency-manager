import type { Database } from 'sql.js'

export function createTables(db: Database): void {
  db.run(`
    -- Categories for agents
    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    )
  `)

  db.run(`
    -- Agents
    CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      tags TEXT NOT NULL DEFAULT '[]',
      icon TEXT NOT NULL DEFAULT '🤖',
      prompt TEXT NOT NULL,
      version TEXT NOT NULL DEFAULT '1.0',
      status TEXT NOT NULL DEFAULT 'not-installed',
      tool_connections TEXT NOT NULL DEFAULT '[]',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (category) REFERENCES categories(id)
    )
  `)

  db.run(`
    -- LLM Providers
    CREATE TABLE IF NOT EXISTS llm_providers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      provider_type TEXT NOT NULL,
      api_key TEXT,
      default_model TEXT,
      config TEXT NOT NULL DEFAULT '{}',
      is_active INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL
    )
  `)

  db.run(`
    -- MCP Servers
    CREATE TABLE IF NOT EXISTS mcp_servers (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      server_type TEXT NOT NULL,
      config TEXT NOT NULL DEFAULT '{}',
      status TEXT NOT NULL DEFAULT 'stopped',
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `)

  db.run(`
    -- Teams
    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      icon TEXT NOT NULL DEFAULT '🚀',
      description TEXT,
      llm_provider_id TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (llm_provider_id) REFERENCES llm_providers(id)
    )
  `)

  db.run(`
    -- Team Members
    CREATE TABLE IF NOT EXISTS team_members (
      id TEXT PRIMARY KEY,
      team_id TEXT NOT NULL,
      agent_id TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'member',
      status TEXT NOT NULL DEFAULT 'active',
      FOREIGN KEY (team_id) REFERENCES teams(id),
      FOREIGN KEY (agent_id) REFERENCES agents(id)
    )
  `)

  db.run(`
    -- CLI Tools
    CREATE TABLE IF NOT EXISTS cli_tools (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tool_type TEXT NOT NULL,
      path TEXT,
      status TEXT NOT NULL DEFAULT 'disconnected',
      last_sync TEXT
    )
  `)

  db.run(`
    -- Templates
    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      files_count INTEGER NOT NULL DEFAULT 0,
      size INTEGER NOT NULL DEFAULT 0,
      source TEXT NOT NULL DEFAULT 'local',
      content TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL
    )
  `)

  db.run(`
    -- Settings
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      value TEXT NOT NULL
    )
  `)

  // Create indexes
  db.run(`CREATE INDEX IF NOT EXISTS idx_agents_category ON agents(category)`)
  db.run(`CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status)`)
  db.run(`CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id)`)
  db.run(`CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category)`)
}
