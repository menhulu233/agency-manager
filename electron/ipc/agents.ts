import { ipcMain } from 'electron'
import { getDatabase } from '../database'
import { v4 as uuidv4 } from 'uuid'

export function registerAgentsHandlers() {
  ipcMain.handle('agents:list', (_, category?: string) => {
    const db = getDatabase()
    if (category) {
      const stmt = db.prepare('SELECT * FROM agents WHERE category = ?')
      stmt.bind([category])
      const results: any[] = []
      while (stmt.step()) {
        results.push(stmt.getAsObject())
      }
      stmt.free()
      return results
    }
    const stmt = db.prepare('SELECT * FROM agents')
    const results: any[] = []
    while (stmt.step()) {
      results.push(stmt.getAsObject())
    }
    stmt.free()
    return results
  })

  ipcMain.handle('agents:getById', (_, id: string) => {
    const db = getDatabase()
    const stmt = db.prepare('SELECT * FROM agents WHERE id = ?')
    stmt.bind([id])
    let result = null
    if (stmt.step()) {
      result = stmt.getAsObject()
    }
    stmt.free()
    return result
  })

  ipcMain.handle('agents:create', (_, agent: any) => {
    const db = getDatabase()
    const id = uuidv4()
    const now = new Date().toISOString()
    const stmt = db.prepare(`
      INSERT INTO agents (id, name, category, description, tags, icon, prompt, version, status, tool_connections, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    stmt.run([id, agent.name, agent.category, agent.description, JSON.stringify(agent.tags || []), agent.icon, agent.prompt, agent.version || '1.0', agent.status || 'not-installed', JSON.stringify([]), now, now])
    stmt.free()
    return { id, ...agent, created_at: now, updated_at: now }
  })

  ipcMain.handle('agents:update', (_, id: string, agent: any) => {
    const db = getDatabase()
    const now = new Date().toISOString()
    const stmt = db.prepare(`
      UPDATE agents SET name = ?, category = ?, description = ?, tags = ?, icon = ?, prompt = ?, version = ?, status = ?, tool_connections = ?, updated_at = ?
      WHERE id = ?
    `)
    stmt.run([agent.name, agent.category, agent.description, JSON.stringify(agent.tags), agent.icon, agent.prompt, agent.version, agent.status, JSON.stringify(agent.tool_connections || []), now, id])
    stmt.free()
    return { id, ...agent, updated_at: now }
  })

  ipcMain.handle('agents:delete', (_, id: string) => {
    const db = getDatabase()
    const stmt = db.prepare('DELETE FROM agents WHERE id = ?')
    stmt.run([id])
    stmt.free()
  })

  ipcMain.handle('agents:sync', (_, id: string, tool: string) => {
    const db = getDatabase()
    const stmt = db.prepare('SELECT * FROM agents WHERE id = ?')
    stmt.bind([id])
    if (stmt.step()) {
      const agent = stmt.getAsObject()
      stmt.free()
      const connections = JSON.parse((agent.tool_connections as string) || '[]')
      if (!connections.includes(tool)) {
        connections.push(tool)
        const updateStmt = db.prepare('UPDATE agents SET tool_connections = ? WHERE id = ?')
        updateStmt.run([JSON.stringify(connections), id])
        updateStmt.free()
      }
    } else {
      stmt.free()
    }
  })
}
