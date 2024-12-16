import { ConfigSidebar } from '@/features/control/components/config-sidebar'
import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex m-auto max-w-screen-xl ">
        <ConfigSidebar />
      {children}
    </div>
  )
}

