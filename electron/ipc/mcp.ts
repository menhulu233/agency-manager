import { ipcMain } from 'electron'
import { getDatabase } from '../database'

export function registerMCPHandlers() {
  ipcMain.handle('mcp:listServers', () => {
    const db = getDatabase()
    const stmt = db.prepare('SELECT * FROM mcp_servers')
    const results: any[] = []
    while (stmt.step()) {
      results.push(stmt.getAsObject())
    }
    stmt.free()
    return results
  })

  ipcMain.handle('mcp:configure', (_, id: string, config: any) => {
    const db = getDatabase()
    const now = new Date().toISOString()
    const stmt = db.prepare('UPDATE mcp_servers SET config = ?, updated_at = ? WHERE id = ?')
    stmt.run([JSON.stringify(config), now, id])
    stmt.free()
  })

  ipcMain.handle('mcp:start', (_, id: string) => {
    const db = getDatabase()
    const now = new Date().toISOString()
    const stmt = db.prepare('UPDATE mcp_servers SET status = ?, updated_at = ? WHERE id = ?')
    stmt.run(['running', now, id])
    stmt.free()
  })

  ipcMain.handle('mcp:stop', (_, id: string) => {
    const db = getDatabase()
    const now = new Date().toISOString()
    const stmt = db.prepare('UPDATE mcp_servers SET status = ?, updated_at = ? WHERE id = ?')
    stmt.run(['stopped', now, id])
    stmt.free()
  })
}
