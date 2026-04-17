import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'
import { initDatabase, closeDatabase } from './database'
import { registerAgentsHandlers } from './ipc/agents'
import { registerLLMHandlers } from './ipc/llm'
import { registerMCPHandlers } from './ipc/mcp'
import { registerTeamsHandlers } from './ipc/teams'
import { registerCLIsHandlers } from './ipc/clis'
import { registerTemplatesHandlers } from './ipc/templates'
import { registerSettingsHandlers } from './ipc/settings'

// Disable GPU acceleration for stability
app.disableHardwareAcceleration()

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#1a1a2e',
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    },
    show: false
  })

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
  })

  // Load the app
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Window control IPC handlers
  ipcMain.on('window:minimize', () => {
    mainWindow?.minimize()
  })

  ipcMain.on('window:maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow?.maximize()
    }
  })

  ipcMain.on('window:close', () => {
    mainWindow?.close()
  })

  ipcMain.handle('window:isMaximized', () => {
    return mainWindow?.isMaximized() ?? false
  })

  ipcMain.on('theme:updateTitleBar', (_, colors) => {
    // Frameless window — renderer handles its own title bar via CSS
    // This IPC kept for potential native title bar future use
    console.debug('theme:updateTitleBar', colors)
  })
}

// Register all IPC handlers
function registerIPCHandlers() {
  registerAgentsHandlers()
  registerLLMHandlers()
  registerMCPHandlers()
  registerTeamsHandlers()
  registerCLIsHandlers()
  registerTemplatesHandlers()
  registerSettingsHandlers()
}

app.whenReady().then(async () => {
  await initDatabase()
  registerIPCHandlers()
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  closeDatabase()
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  closeDatabase()
})
