import { create } from 'zustand'
import type { Team } from './types'

interface TeamsState {
  teams: Team[]
  selectedTeam: Team | null
  loading: boolean
  loadTeams: () => Promise<void>
  selectTeam: (team: Team | null) => void
  createTeam: (team: Omit<Team, 'id' | 'created_at' | 'updated_at' | 'llm_provider_id'> & { llm_provider_id?: string }) => Promise<void>
  updateTeam: (id: string, team: Partial<Team>) => Promise<void>
  deleteTeam: (id: string) => Promise<void>
  launchTeam: (id: string) => Promise<void>
}

export const useTeamsStore = create<TeamsState>((set) => ({
  teams: [],
  selectedTeam: null,
  loading: false,

  loadTeams: async () => {
    set({ loading: true })
    try {
      const teams = await window.electronAPI.teams.list()
      set({ teams, loading: false })
    } catch (error) {
      console.error('Failed to load teams:', error)
      set({ loading: false })
    }
  },

  selectTeam: (team) => set({ selectedTeam: team }),

  createTeam: async (team) => {
    const created = await window.electronAPI.teams.create(team)
    set((state) => ({
      teams: [...state.teams, created],
      selectedTeam: created
    }))
  },

  updateTeam: async (id, team) => {
    const updated = await window.electronAPI.teams.update(id, team)
    set((state) => ({
      teams: state.teams.map((t) => (t.id === id ? updated : t)),
      selectedTeam: state.selectedTeam?.id === id ? updated : state.selectedTeam
    }))
  },

  deleteTeam: async (id) => {
    await window.electronAPI.teams.delete(id)
    set((state) => ({
      teams: state.teams.filter((t) => t.id !== id),
      selectedTeam: state.selectedTeam?.id === id ? null : state.selectedTeam
    }))
  },

  launchTeam: async (id) => {
    await window.electronAPI.teams.launch(id)
  }
}))
