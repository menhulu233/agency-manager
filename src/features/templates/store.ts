import { create } from 'zustand'
import type { Template } from './types'

interface TemplatesState {
  templates: Template[]
  selectedTemplate: Template | null
  loading: boolean
  loadTemplates: () => Promise<void>
  selectTemplate: (template: Template | null) => void
  importTemplate: (content: string, format: 'json' | 'yaml') => Promise<void>
  applyTemplate: (id: string) => Promise<void>
}

export const useTemplatesStore = create<TemplatesState>((set) => ({
  templates: [],
  selectedTemplate: null,
  loading: false,

  loadTemplates: async () => {
    set({ loading: true })
    try {
      const templates = await window.electronAPI.templates.list()
      set({ templates, loading: false })
    } catch (error) {
      console.error('Failed to load templates:', error)
      set({ loading: false })
    }
  },

  selectTemplate: (template) => set({ selectedTemplate: template }),

  importTemplate: async (content, format) => {
    await window.electronAPI.templates.import(content, format)
    const templates = await window.electronAPI.templates.list()
    set({ templates })
  },

  applyTemplate: async (id) => {
    await window.electronAPI.templates.apply(id)
  }
}))
