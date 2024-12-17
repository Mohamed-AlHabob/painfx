"use client"

import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { toast } from "sonner"

type CopyButtonProps = {
  content: string
  name: string
}

export const CopyButton = ({ content,name }: CopyButtonProps) => {
  return (
    <Button
      onClick={() => {
        navigator.clipboard.writeText(content)
        toast("Copied", {
          description: "Affiliate link copied to clipboard",
        })
      }}
      className="flex hover:bg-themeDarkGray gap-x-3"
      variant="outline"
    >
      <Copy size={20} />
      {name}
    </Button>
  )
}
