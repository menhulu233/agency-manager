import { useEffect, useState } from 'react'
import { useTeamsStore } from '../store'
import { ThreeColumnLayout, LeftSidebar, CardGrid, DetailPanel } from '../../../shared/components'
import { useI18n } from '../../../shared/i18n'

export default function TeamsView() {
  const { t } = useI18n()
  const { teams, selectedTeam, loadTeams, selectTeam, createTeam, updateTeam, deleteTeam, launchTeam } = useTeamsStore()
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', icon: '🚀', description: '' })
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadTeams()
  }, [])

  useEffect(() => {
    if (selectedTeam && editing) {
      setForm({
        name: selectedTeam.name,
        icon: selectedTeam.icon || '🚀',
        description: selectedTeam.description || ''
      })
    }
  }, [selectedTeam, editing])

  const resetForm = () => {
    setForm({ name: '', icon: '🚀', description: '' })
  }

  const handleCreate = async () => {
    if (!form.name.trim()) return
    setProcessing(true)
    await createTeam(form)
    setProcessing(false)
    setCreating(false)
    resetForm()
  }

  const handleUpdate = async () => {
    if (!selectedTeam || !form.name.trim()) return
    setProcessing(true)
    await updateTeam(selectedTeam.id, form)
    setProcessing(false)
    setEditing(false)
  }

  const handleDelete = async () => {
    if (!selectedTeam) return
    if (!confirm(t('teams.confirmDelete') || '确认删除该团队？')) return
    setProcessing(true)
    await deleteTeam(selectedTeam.id)
    setProcessing(false)
    setEditing(false)
  }

  const handleLaunch = async () => {
    if (!selectedTeam) return
    setProcessing(true)
    await launchTeam(selectedTeam.id)
    setProcessing(false)
  }

  const leftSidebar = (
    <LeftSidebar title={t('teams.myTeams')}>
      {teams.map(team => (
        <div
          key={team.id}
          className={`left-item px-3 py-2.5 rounded-lg flex items-center gap-2.5 cursor-pointer text-sm mb-0.5 ${
            selectedTeam?.id === team.id ? 'bg-accent text-white' : 'text-gray-400 hover:bg-card'
          }`}
          onClick={() => {
            selectTeam(team)
            setEditing(false)
            setCreating(false)
          }}
        >
          <span className="text-base">{team.icon}</span>
          <span className="flex-1">{team.name}</span>
        </div>
      ))}
      {!creating ? (
        <button
          onClick={() => {
            setCreating(true)
            setEditing(false)
            selectTeam(null)
            resetForm()
          }}
          className="w-full mt-2 px-3 py-2 bg-accent text-white text-xs rounded-lg"
        >
          + {t('teams.createTeam')}
        </button>
      ) : (
        <div className="mt-2 space-y-2 p-2 bg-card rounded-lg">
          <input
            type="text"
            placeholder={t('teams.teamName') || '团队名称'}
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full px-2 py-1.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded text-xs text-[var(--text)]"
          />
          <input
            type="text"
            placeholder={t('teams.icon') || '图标'}
            value={form.icon}
            onChange={e => setForm({ ...form, icon: e.target.value })}
            className="w-full px-2 py-1.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded text-xs text-[var(--text)]"
          />
          <textarea
            placeholder={t('teams.description') || '描述'}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full px-2 py-1.5 bg-[var(--input-bg)] border border-[var(--input-border)] rounded text-xs text-[var(--text)] resize-none"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              disabled={processing}
              className="flex-1 px-2 py-1.5 bg-accent text-white text-xs rounded disabled:opacity-50"
            >
              {processing ? '...' : t('common.create') || '创建'}
            </button>
            <button
              onClick={() => { setCreating(false); resetForm() }}
              className="flex-1 px-2 py-1.5 bg-[var(--button-secondary-bg)] text-[var(--text)] text-xs rounded hover:bg-[var(--button-secondary-hover)]"
            >
              {t('common.cancel') || '取消'}
            </button>
          </div>
        </div>
      )}
    </LeftSidebar>
  )

  const center = (
    <>
      <div className="flex gap-2 p-3 border-b border-card">
        <input
          type="text"
          placeholder={t('search.placeholder')}
          className="flex-1 px-3 py-2 bg-card border border-card rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent"
        />
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
        <CardGrid>
          {teams.map(team => (
            <div
              key={team.id}
              className="bg-card rounded-lg p-3 cursor-pointer border-2 border-transparent hover:border-accent transition"
              onClick={() => {
                selectTeam(team)
                setEditing(false)
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{team.icon}</span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{team.name}</h4>
                  <p className="text-[10px] text-gray-500">{team.description || t('teams.noDescription')}</p>
                </div>
              </div>
            </div>
          ))}
        </CardGrid>
      </div>
    </>
  )

  const rightPanel = (
    <DetailPanel title={t('teams.teamDetail')}>
      {selectedTeam ? (
        editing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-sm text-[var(--text)]"
              placeholder={t('teams.teamName') || '团队名称'}
            />
            <input
              type="text"
              value={form.icon}
              onChange={e => setForm({ ...form, icon: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-sm text-[var(--text)]"
              placeholder={t('teams.icon') || '图标'}
            />
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-lg text-sm text-[var(--text)] resize-none"
              rows={3}
              placeholder={t('teams.description') || '描述'}
            />
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                disabled={processing}
                className="flex-1 px-3 py-1.5 bg-accent text-white text-xs rounded-lg disabled:opacity-50"
              >
                {processing ? '...' : t('common.save') || '保存'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="flex-1 px-3 py-1.5 bg-[var(--button-secondary-bg)] text-[var(--text)] text-xs rounded-lg hover:bg-[var(--button-secondary-hover)]"
              >
                {t('common.cancel') || '取消'}
              </button>
            </div>
            <button
              onClick={handleDelete}
              disabled={processing}
              className="w-full px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-opacity-90 disabled:opacity-50"
            >
              {t('common.delete') || '删除'}
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{selectedTeam.icon}</span>
              <div>
                <div className="text-sm font-medium">{selectedTeam.name}</div>
                <div className="text-[10px] text-gray-500">{t('teams.createdAt')} {selectedTeam.created_at?.split('T')[0]}</div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-3">{selectedTeam.description || t('teams.noDescription')}</p>
            <div className="flex gap-2">
              <button
                onClick={handleLaunch}
                disabled={processing}
                className="flex-1 px-3 py-1.5 bg-accent text-white text-xs rounded-lg disabled:opacity-50"
              >
                {processing ? '...' : t('teams.launch')}
              </button>
              <button
                onClick={() => setEditing(true)}
                className="flex-1 px-3 py-1.5 bg-[var(--button-secondary-bg)] text-[var(--text)] text-xs rounded-lg hover:bg-[var(--button-secondary-hover)]"
              >
                {t('teams.edit')}
              </button>
            </div>
          </div>
        )
      ) : (
        <div className="text-center text-gray-500 text-sm py-8">
          {t('teams.selectHint')}
        </div>
      )}
    </DetailPanel>
  )

  return <ThreeColumnLayout leftSidebar={leftSidebar} center={center} rightPanel={rightPanel} />
}
