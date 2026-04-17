import { ReactNode } from 'react'

interface CardGridProps {
  children: ReactNode
}

export default function CardGrid({ children }: CardGridProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2.5">
      {children}
    </div>
  )
}
