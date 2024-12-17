import { Notification } from "@/components/global/user-widget/notification"
import { UserDropDown } from "@/components/global/user-widget/user"
import { Home, Message } from "@/components/icons"

import Link from "next/link"


const MobileNav = async () => {


  return (
    <div className="bg-[#1A1A1D] w-screen py-3 px-11 fixed bottom-0 z-50 md:hidden justify-between items-center flex">
      <Link href={`/X`}>
        <Home className="h-7 w-7" />
      </Link>
      <Notification />
      <Link href={`/X`}>
        <Message className="h-7 w-7" />
      </Link>
      <UserDropDown  />
    </div>
  )
}

export default MobileNav
