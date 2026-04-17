import { ipcMain } from 'electron'
import { getDatabase } from '../database'
import { execSync } from 'child_process'

const DETECTABLE_TOOLS = [
  { cmd: 'claude', name: 'Claude Code', tool_type: 'claude_code' },
  { cmd: 'claude-code', name: 'Claude Code', tool_type: 'claude_code' },
  { cmd: 'cursor', name: 'Cursor', tool_type: 'cursor' },
  { cmd: 'code', name: 'VS Code', tool_type: 'vscode' },
  { cmd: 'windsurf', name: 'Windsurf', tool_type: 'windsurf' },
  { cmd: 'aider', name: 'Aider', tool_type: 'aider' },
  { cmd: 'node', name: 'Node.js', tool_type: 'node' },
  { cmd: 'npm', name: 'NPM', tool_type: 'npm' },
  { cmd: 'pnpm', name: 'PNPM', tool_type: 'pnpm' },
  { cmd: 'yarn', name: 'Yarn', tool_type: 'yarn' },
  { cmd: 'python', name: 'Python', tool_type: 'python' },
  { cmd: 'python3', name: 'Python 3', tool_type: 'python' },
  { cmd: 'git', name: 'Git', tool_type: 'git' },
  { cmd: 'docker', name: 'Docker', tool_type: 'docker' },
  { cmd: 'kubectl', name: 'kubectl', tool_type: 'kubectl' },
  { cmd: 'gh', name: 'GitHub CLI', tool_type: 'gh' },
  { cmd: 'terraform', name: 'Terraform', tool_type: 'terraform' },
  { cmd: 'aws', name: 'AWS CLI', tool_type: 'aws' },
  { cmd: 'az', name: 'Azure CLI', tool_type: 'az' },
  { cmd: 'gcloud', name: 'Google Cloud SDK', tool_type: 'gcloud' },
  { cmd: 'bun', name: 'Bun', tool_type: 'bun' },
  { cmd: 'deno', name: 'Deno', tool_type: 'deno' },
  { cmd: 'cargo', name: 'Rust (Cargo)', tool_type: 'cargo' },
  { cmd: 'go', name: 'Go', tool_type: 'go' },
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
