import { ipcMain } from 'electron'
import { getDatabase } from '../database'

export function registerCLIsHandlers() {
  ipcMain.handle('clis:list', () => {
    const db = getDatabase()
    const stmt = db.prepare('SELECT * FROM cli_tools')
    const results: any[] = []
    while (stmt.step()) {
      results.push(stmt.getAsObject())
    }
    stmt.free()
    return results
  })

  ipcMain.handle('clis:detect', () => {
    // Placeholder - would detect installed CLIs
    return []
  })

  ipcMain.handle('clis:connect', (_, id: string) => {
    const db = getDatabase()
    const now = new Date().toISOString()
    const stmt = db.prepare('UPDATE cli_tools SET status = ?, last_sync = ? WHERE id = ?')
    stmt.run(['connected', now, id])
    stmt.free()
  })

  ipcMain.handle('clis:disconnect', (_, id: string) => {
    const db = getDatabase()
    const stmt = db.prepare('UPDATE cli_tools SET status = ? WHERE id = ?')
    stmt.run(['disconnected', id])
    stmt.free()
  })
}
