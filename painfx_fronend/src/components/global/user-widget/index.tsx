import { Notification } from "./notification"
import { UserDropDown } from "./user"

export const UserWidget = () => {
  return (
    <div className="gap-5 items-center hidden md:flex">
      <Notification />
      <UserDropDown/>
    </div>
  )
}
