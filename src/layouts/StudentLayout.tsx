import type { PropsWithChildren } from 'react'
import { Outlet } from 'react-router-dom'

export default function StudentLayout({ children }: PropsWithChildren) {
  return <div className="min-h-screen bg-background">{children ?? <Outlet />}</div>
}
