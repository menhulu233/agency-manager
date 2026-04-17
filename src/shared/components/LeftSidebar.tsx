import { ReactNode } from 'react'

interface LeftSidebarProps {
  title: string
  children: ReactNode
}

export default function LeftSidebar({ title, children }: LeftSidebarProps) {
  return (
    <>
      <div className="px-4 py-3 border-b border-card">
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        {children}
      </div>
    </>
  )
}
