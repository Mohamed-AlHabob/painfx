import { Empty } from "@/components/icons"
import { RefreshCcw } from "lucide-react"
import Link from "next/link"

type NoResultProps = {
  message: string
  backTo: string
  linkName?: string
}

export const NoResult = ({ message, backTo, linkName }: NoResultProps) => {
  return (
    <div className="lg:col-span-3 md:col-span-2 flex flex-col items-center gap-y-16">
      <div>
        <p className="text-xl font-semibold text-themeTextGray">
          {message}
        </p>
      </div>
      <Empty />
      {linkName && (
        <Link href={backTo} className="flex gap-3 text-themeTextGray">
          <RefreshCcw />
          {linkName}
        </Link>
      )}
    </div>
  )
}
