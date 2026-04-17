import { create } from 'zustand'

export type Theme = 'dark' | 'light'

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  loadTheme: () => Promise<void>
  syncTheme: (theme: Theme) => Promise<void>
}

const STORAGE_KEY = 'agency-theme'

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) as Theme) || 'dark',

  setTheme: (theme) => {
    localStorage.setItem(STORAGE_KEY, theme)
    document.documentElement.dataset.theme = theme
    set({ theme })
    // Notify Electron title bar (no-op if not in Electron context)
    window.electronAPI?.theme?.updateTitleBar(getTitleBarColors(theme))
    // Sync to SQLite settings
    get().syncTheme(theme).catch(console.error)
  },

  toggleTheme: () => {
    const next = get().theme === 'dark' ? 'light' : 'dark'
    get().setTheme(next)
  },

  loadTheme: async () => {
    try {
      const saved = await window.electronAPI.settings.get('theme')
      if (saved === 'dark' || saved === 'light') {
        get().setTheme(saved)
      }
    } catch (e) {
      console.error('Failed to load theme from settings:', e)
    }
  },

  syncTheme: async (theme) => {
    try {
      await window.electronAPI.settings.update('theme', theme)
    } catch (e) {
      console.error('Failed to sync theme to settings:', e)
    }
  }
}))

export function getTitleBarColors(theme: Theme) {
  if (theme === 'light') {
    return { bg: '#FFFFFF', symbol: '#1A1D23', windowBg: '#F8F9FB' }
  }
  return { bg: '#16213e', symbol: '#e0e0e0', windowBg: '#1a1a2e' }
}
