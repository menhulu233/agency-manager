import { ipcMain } from 'electron'
import { getDatabase } from '../database'
import { v4 as uuidv4 } from 'uuid'

export function registerTeamsHandlers() {
  ipcMain.handle('teams:list', () => {
    const db = getDatabase()
    const stmt = db.prepare('SELECT * FROM teams')
    const results: any[] = []
    while (stmt.step()) {
      results.push(stmt.getAsObject())
    }
    stmt.free()
    return results
  })

  ipcMain.handle('teams:create', (_, team: any) => {
    const db = getDatabase()
    const id = uuidv4()
    const now = new Date().toISOString()
    const stmt = db.prepare('INSERT INTO teams (id, name, icon, description, llm_provider_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    stmt.run([id, team.name, team.icon || '🚀', team.description, team.llm_provider_id, now, now])
    stmt.free()
    return { id, ...team, created_at: now, updated_at: now }
  })

  ipcMain.handle('teams:update', (_, id: string, team: any) => {
    const db = getDatabase()
    const now = new Date().toISOString()
    const stmt = db.prepare('UPDATE teams SET name = ?, icon = ?, description = ?, llm_provider_id = ?, updated_at = ? WHERE id = ?')
    stmt.run([team.name, team.icon, team.description, team.llm_provider_id, now, id])
    stmt.free()
    return { id, ...team, updated_at: now }
  })

  ipcMain.handle('teams:delete', (_, id: string) => {
    const db = getDatabase()
    const stmt1 = db.prepare('DELETE FROM team_members WHERE team_id = ?')
    stmt1.run([id])
    stmt1.free()
    const stmt2 = db.prepare('DELETE FROM teams WHERE id = ?')
    stmt2.run([id])
    stmt2.free()
  })

  ipcMain.handle('teams:launch', (_, id: string) => {
    // Placeholder - would launch the team
  })
}
