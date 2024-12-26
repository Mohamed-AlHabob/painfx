import { NavBar } from '@/features/control/components/nav-bar'
import { SubNav } from '@/features/control/components/sub-nav'
import RequireAuthPowers from '@/lib/RequireAuthPowers'
import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuthPowers>
      <div className="min-h-screen font-[family-name:var(--font-geist-sans)] overflow-hidden flex flex-col"> 
        <NavBar />
        <div className="sticky top-0 z-30">
          <SubNav />
        </div>
        <div className="flex-1 flex flex-col md:flex-row">
          {children}
        </div>
      </div>
    </RequireAuthPowers>
  )
}
