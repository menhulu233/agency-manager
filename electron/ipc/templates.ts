import { ipcMain } from 'electron'
import { getDatabase } from '../database'

export function registerTemplatesHandlers() {
  ipcMain.handle('templates:list', (_, category?: string) => {
    const db = getDatabase()
    if (category) {
      const stmt = db.prepare('SELECT * FROM templates WHERE category = ?')
      stmt.bind([category])
      const results: any[] = []
      while (stmt.step()) {
        results.push(stmt.getAsObject())
      }
      stmt.free()
      return results
    }
    const stmt = db.prepare('SELECT * FROM templates')
    const results: any[] = []
    while (stmt.step()) {
      results.push(stmt.getAsObject())
    }
    stmt.free()
    return results
  })

  ipcMain.handle('templates:import', (_, content: string, format: 'json' | 'yaml') => {
    const data = format === 'yaml' ? require('yaml').parse(content) : JSON.parse(content)
    // Import logic would go here
    return data
  })

  ipcMain.handle('templates:export', (_, ids: string[], format: 'json' | 'yaml') => {
    const db = getDatabase()
    const placeholders = ids.map(() => '?').join(',')
    const stmt = db.prepare(`SELECT * FROM templates WHERE id IN (${placeholders})`)
    stmt.bind(ids)
    const results: any[] = []
    while (stmt.step()) {
      results.push(stmt.getAsObject())
    }
    stmt.free()
    return format === 'yaml' ? require('yaml').stringify({ templates: results }) : JSON.stringify({ templates: results }, null, 2)
  })

  ipcMain.handle('templates:apply', (_, id: string) => {
    // Placeholder - would apply template
  })
}
