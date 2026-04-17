import { useI18n } from '../../../shared/i18n'
import { useThemeStore } from '../../../shared/theme/store'

export default function SettingsView() {
  const { t, locale, setLocale } = useI18n()
  const { theme, setTheme } = useThemeStore()

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-panel rounded-xl p-6">
        <h2 className="text-lg font-medium mb-6">{t('nav.settings')}</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">{t('settings.general')}</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                <span className="text-sm">{t('settings.theme')}</span>
                <select
                  value={theme}
                  onChange={e => setTheme(e.target.value as 'dark' | 'light')}
                  className="px-3 py-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded text-sm text-[var(--text)]"
                >
                  <option value="dark">{t('settings.dark')}</option>
                  <option value="light">{t('settings.light')}</option>
                </select>
              </div>
              <div className="flex items-center justify-between p-3 bg-card rounded-lg">
                <span className="text-sm">{t('settings.language')}</span>
                <select
                  value={locale}
                  onChange={e => setLocale(e.target.value as 'zh-CN' | 'en')}
                  className="px-3 py-1 bg-[var(--input-bg)] border border-[var(--input-border)] rounded text-sm text-[var(--text)]"
                >
                  <option value="zh-CN">{t('settings.zhCN')}</option>
                  <option value="en">{t('settings.en')}</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-3">{t('settings.about')}</h3>
            <div className="p-3 bg-card rounded-lg">
              <div className="text-sm font-medium mb-1">Agency Manager</div>
              <div className="text-xs text-gray-500">{t('settings.version')} 1.0.0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
