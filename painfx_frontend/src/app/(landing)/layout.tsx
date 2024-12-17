import {LandingPageNavbar} from "@/features/landing/components/navbar"

const LandingPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)] overflow-hidden"> 
    <LandingPageNavbar  />
      {children}
    </div>
  )
}

export default LandingPageLayout
