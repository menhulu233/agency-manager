import type { Database as SqlJsDatabase } from 'sql.js'
import path from 'path'
import { app } from 'electron'
import { createTables } from './schema'
import { seedDatabase } from './seed'

let db: SqlJsDatabase | null = null

export function getDatabase(): SqlJsDatabase {
  if (!db) {
    throw new Error('Database not initialized')
  }
  return db
}

export async function initDatabase(): Promise<SqlJsDatabase> {
  // Use eval('require') to bypass Vite bundler for sql.js
  const initSqlJs = eval('require')('sql.js') as () => Promise<any>
  const SQL = await initSqlJs()

  const userDataPath = app.getPath('userData')
  const dbPath = path.join(userDataPath, 'agency-manager.db')

  // Try to load existing database
  let data: Uint8Array | undefined
  try {
    const fs = require('fs')
    if (fs.existsSync(dbPath)) {
      data = new Uint8Array(fs.readFileSync(dbPath))
    }
  } catch (e) {
    // No existing database
  }

  db = data ? new SQL.Database(data) : new SQL.Database()

  createTables(db)
  seedDatabase(db)

  // Save periodically
  setInterval(() => {
    saveDatabase()
  }, 30000)

  return db
}

export function saveDatabase(): void {
  if (!db) return
  try {
    const userDataPath = app.getPath('userData')
    const dbPath = path.join(userDataPath, 'agency-manager.db')
    const fs = require('fs')
    const data = db.export()
    const buffer = Buffer.from(data)
    fs.writeFileSync(dbPath, buffer)
  } catch (e) {
    console.error('Failed to save database:', e)
  }
}

export function closeDatabase(): void {
  if (db) {
    saveDatabase()
    db.close()
    db = null
  }
}
