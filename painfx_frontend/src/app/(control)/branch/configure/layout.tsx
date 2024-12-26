import { ConfigSidebar } from '@/features/control/components/config-sidebar'
import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row m-auto max-w-screen-xl">
      <ConfigSidebar />
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  )
}
