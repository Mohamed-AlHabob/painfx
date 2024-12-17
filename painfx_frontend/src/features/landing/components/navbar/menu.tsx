"use client"
import { ModeToggle } from "@/components/mode-toggle"
import { Card, CardContent } from "@/components/ui/card"
import { CONSTANTS } from "@/constants"
import { useNavigation } from "@/hooks/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"

type MenuProps = {
  orientation: "mobile" | "desktop"
  isAuthenticated: boolean
}

export function Menu({ orientation, isAuthenticated }: MenuProps) {
  const { section, onSetSection } = useNavigation()
  const menuItems = isAuthenticated
    ? CONSTANTS.landingPageMenu
    : CONSTANTS.authlandingPageMenu

  switch (orientation) {
    case "desktop":
      return (
        <Card className=" bg-clip-padding backdrop--blur__safari backdrop-filter backdrop-blur-2xl bg-opacity-60 p-1 ml-28 lg:flex hidden rounded-xl">
          <CardContent className="p-0 flex gap-2">
            {menuItems.map((menuItem) => (
              <Link
                key={menuItem.id}
                href={menuItem.path}
                {...(menuItem.section && {
                  onClick: () => onSetSection(menuItem.path),
                })}
                className={cn(
                  "rounded-xl flex gap-2 py-2 px-4 items-center",
                  section === menuItem.path
                    ? "bg-gray-400 dark:bg-[#09090B] border-[#27272A]"
                    : "",
                )}
              >
                {section === menuItem.path && menuItem.icon}
                {menuItem.label}
              </Link>
            ))}
          </CardContent>
        </Card>
      )

    case "mobile":
      return (
        <div className="flex flex-col mt-10">
          {menuItems.map((menuItem) => (
            <Link
              key={menuItem.id}
              href={menuItem.path}
              {...(menuItem.section && {
                onClick: () => onSetSection(menuItem.path),
              })}
              className={cn(
                "rounded-xl flex gap-2 py-2 px-4 items-center",
                section === menuItem.path
                  ? "bg-gray-400 dark:bg-[#09090B] border-[#27272A]"
                  : "",
              )}
            >
              {menuItem.icon}
              {menuItem.label}
            </Link>
          ))}
          <div className="flex justify-center items-center mt-96 mx-6">
            {/* <p>mode</p> */}
            <ModeToggle />
          </div>
        </div>
      )
    default:
      return <></>
  }
}

