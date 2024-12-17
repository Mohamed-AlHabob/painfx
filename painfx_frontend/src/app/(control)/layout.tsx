import { NavBar } from '@/features/control/components/nav-bar'
import { SubNav } from '@/features/control/components/sub-nav'
import RequireAuthPowers from '@/lib/RequireAuthPowers'
import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuthPowers>
    <div className="min-h-screen">
      <NavBar />
      <div className="sticky top-0 z-30 h-fit">
      <SubNav />
      </div>
      {children}
    </div>
    </RequireAuthPowers>
  )
}

