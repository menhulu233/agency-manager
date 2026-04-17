import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import zhCN from './zh-CN.json'
import en from './en.json'

type Translations = Record<string, string>
type Locale = 'zh-CN' | 'en'

const translations: Record<Locale, Translations> = {
  'zh-CN': zhCN,
  'en': en,
}

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

const STORAGE_KEY = 'agency-locale'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    return (typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) as Locale) || 'zh-CN'
  })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    // Load saved locale from SQLite on mount
    window.electronAPI.settings.get('language')
      .then((saved: any) => {
        if (saved === 'zh-CN' || saved === 'en') {
          setLocaleState(saved)
          localStorage.setItem(STORAGE_KEY, saved)
        }
      })
      .catch(console.error)
      .finally(() => setLoaded(true))
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale)
    if (loaded) {
      window.electronAPI.settings.update('language', locale).catch(console.error)
    }
  }, [locale, loaded])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
  }

  const t = (key: string): string => {
    return translations[locale][key] ?? key
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
