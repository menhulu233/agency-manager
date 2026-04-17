import { ipcMain } from 'electron'
import { getDatabase } from '../database'
import { execSync } from 'child_process'

const DETECTABLE_TOOLS = [
  { cmd: 'claude', name: 'Claude Code', tool_type: 'claude_code' },
  { cmd: 'claude-code', name: 'Claude Code', tool_type: 'claude_code' },
  { cmd: 'cursor', name: 'Cursor', tool_type: 'cursor' },
  { cmd: 'windsurf', name: 'Windsurf', tool_type: 'windsurf' },
  { cmd: 'aider', name: 'Aider', tool_type: 'aider' },
  { cmd: 'openclaw', name: 'OpenClaw', tool_type: 'openclaw' },
  { cmd: 'opencode', name: 'OpenCode', tool_type: 'opencode' },
  { cmd: 'gemini', name: 'Gemini CLI', tool_type: 'gemini_cli' },
  { cmd: 'kimi', name: 'Kimi Code', tool_type: 'kimi' },
  { cmd: 'qwen', name: 'Qwen Code', tool_type: 'qwen' },
]

function detectCommand(cmd: string): string | null {
  try {
    const isWindows = process.platform === 'win32'
    const result = execSync(`${isWindows ? 'where' : 'which'} ${cmd}`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore']
    })
    const path = result.trim().split('\n')[0].trim()
    return path || null
  } catch {
    return null
  }
}

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
    const db = getDatabase()
    const detected: any[] = []
    const now = new Date().toISOString()

    const seenTypes = new Set<string>()

    for (const tool of DETECTABLE_TOOLS) {
      if (seenTypes.has(tool.tool_type)) continue

      const path = detectCommand(tool.cmd)
      if (!path) continue

      seenTypes.add(tool.tool_type)

      const existingStmt = db.prepare('SELECT id, status FROM cli_tools WHERE tool_type = ?')
      existingStmt.bind([tool.tool_type])
      let existing: any = null
      if (existingStmt.step()) {
        existing = existingStmt.getAsObject()
      }
      existingStmt.free()

      if (existing) {
        const update = db.prepare('UPDATE cli_tools SET path = ?, last_sync = ? WHERE id = ?')
        update.run([path, now, existing.id])
        update.free()
        detected.push({ ...existing, path, last_sync: now })
      } else {
        const id = `${tool.tool_type}-${Date.now()}`
        const insert = db.prepare('INSERT INTO cli_tools (id, name, tool_type, path, status, last_sync) VALUES (?, ?, ?, ?, ?, ?)')
        insert.run([id, tool.name, tool.tool_type, path, 'disconnected', now])
        insert.free()
        detected.push({ id, name: tool.name, tool_type: tool.tool_type, path, status: 'disconnected', last_sync: now })
      }
    }

    return detected
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
