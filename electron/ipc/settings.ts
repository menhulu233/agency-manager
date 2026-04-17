import { ipcMain } from 'electron'
import { getDatabase } from '../database'
import { v4 as uuidv4 } from 'uuid'

function parseSettingValue(raw: string): any {
  try {
    return JSON.parse(raw)
  } catch {
    return raw
  }
}

export function registerSettingsHandlers() {
  ipcMain.handle('settings:get', (_, key: string) => {
    const db = getDatabase()
    const stmt = db.prepare('SELECT value FROM settings WHERE key = ?')
    stmt.bind([key])
    let result = null
    if (stmt.step()) {
      result = parseSettingValue(stmt.getAsObject().value as string)
    }
    stmt.free()
    return result
  })

  ipcMain.handle('settings:update', (_, key: string, value: any) => {
    const db = getDatabase()
    const id = uuidv4()
    const stmt = db.prepare('INSERT OR REPLACE INTO settings (id, key, value) VALUES (?, ?, ?)')
    stmt.run([id, key, JSON.stringify(value)])
    stmt.free()
  })

  ipcMain.handle('settings:getAll', () => {
    const db = getDatabase()
    const stmt = db.prepare('SELECT key, value FROM settings')
    const result: Record<string, any> = {}
    while (stmt.step()) {
      const row = stmt.getAsObject()
      result[row.key as string] = parseSettingValue(row.value as string)
    }
    stmt.free()
    return result
  })
}
