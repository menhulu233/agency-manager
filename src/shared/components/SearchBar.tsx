import { useState } from 'react'
import { useI18n } from '../../shared/i18n'

interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
}

export default function SearchBar({ placeholder, onSearch }: SearchBarProps) {
  const { t } = useI18n()
  const [value, setValue] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    onSearch(e.target.value)
  }

  return (
    <input
      type="text"
      placeholder={placeholder ?? t('search.placeholder')}
      value={value}
      onChange={handleChange}
      className="flex-1 px-3 py-2 bg-card border border-card rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accent"
    />
  )
}
