import { ipcMain } from 'electron'
import { getDatabase } from '../database'

export function registerLLMHandlers() {
  ipcMain.handle('llm:listProviders', () => {
    const db = getDatabase()
    const stmt = db.prepare('SELECT * FROM llm_providers')
    const results: any[] = []
    while (stmt.step()) {
      results.push(stmt.getAsObject())
    }
    stmt.free()
    return results
  })

  ipcMain.handle('llm:configure', (_, id: string, config: any) => {
    const db = getDatabase()
    const stmt = db.prepare('UPDATE llm_providers SET api_key = ?, default_model = ?, config = ?, is_active = ? WHERE id = ?')
    stmt.run([config.api_key, config.default_model, JSON.stringify(config), config.is_active ? 1 : 0, id])
    stmt.free()
  })

  ipcMain.handle('llm:test', async (_, id: string) => {
    // Placeholder - would test actual API connection
    return true
  })

  ipcMain.handle('llm:getUsage', () => {
    return { cost: 12.45, tokens: 142000 }
  })
}
