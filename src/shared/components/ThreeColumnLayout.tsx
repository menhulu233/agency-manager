import { ReactNode } from 'react'

interface ThreeColumnLayoutProps {
  leftSidebar: ReactNode
  center: ReactNode
  rightPanel: ReactNode
}

export default function ThreeColumnLayout({ leftSidebar, center, rightPanel }: ThreeColumnLayoutProps) {
  return (
    <div className="grid grid-cols-[200px_1fr_300px] gap-3 min-h-[calc(100vh-130px)]">
      <aside className="bg-panel rounded-xl overflow-hidden flex flex-col">
        {leftSidebar}
      </aside>
      <main className="bg-panel rounded-xl overflow-hidden flex flex-col">
        {center}
      </main>
      <aside className="bg-panel rounded-xl overflow-hidden flex flex-col">
        {rightPanel}
      </aside>
    </div>
  )
}
