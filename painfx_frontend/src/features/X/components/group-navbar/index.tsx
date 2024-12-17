"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CONSTANTS } from "@/constants"
import { useNavigation } from "@/hooks/navigation"
import { cn } from "@/lib/utils"
import Link from "next/link"

type MenuProps = {
  orientation: "mobile" | "desktop"
}


const Menu = ({ orientation }: MenuProps) => {
  const { section, onSetSection } = useNavigation()
  switch (orientation) {
    case "desktop":
      return (
        <Card className="dark:bg-themeGray dark:border-themeGray bg-clip-padding backdrop--blur__safari backdrop-filter backdrop-blur-2xl bg-opacity-60 p-1 lg:flex z-50  lg:sticky lg:top-0 lg:mt-0 rounded-xl overflow-hidden  md:rounded-xl flex items-center justify-center w-fit">
          <CardContent className="p-0 flex gap-2">
            {CONSTANTS.landingPageMenu.map((menuItem) => (
              <Link
                href={menuItem.path}
                onClick={() => onSetSection(menuItem.path)}
                className={cn(
                  "rounded-xl flex gap-2 py-2 px-4 items-center",
                  section == menuItem.path
                    ? "bg-gray-200 dark:bg-[#09090B] dark:border-[#27272A]"
                    : "",
                )}
                key={menuItem.id}
              >
                {section == menuItem.path && menuItem.icon}
                {menuItem.label}
              </Link>
            ))}
          </CardContent>
        </Card>
      )

    case "mobile":
      return (
        <div className="flex flex-col mt-10">
          {CONSTANTS.landingPageMenu.map((menuItem) => (
            <Link
              href={menuItem.path}
              onClick={() => onSetSection(menuItem.path)}
              className={cn(
                "rounded-xl flex gap-2 py-2 px-4 items-center",
                section == menuItem.path ? "dark:bg-themeGray dark:border-[#27272A]" : "",
              )}
              key={menuItem.id}
            >
              {menuItem.icon}
              {menuItem.label}
            </Link>
          ))}
        </div>
      )
    default:
      return <></>
  }
}

export default Menu
