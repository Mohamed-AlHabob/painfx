"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SwitchLanguage() {
  return (
<div className="space-y-2">
<div className="flex items-center justify-between">
            <span className="text-sm">Language</span>
            <Select defaultValue="english">
              <SelectTrigger className="w-24 h-8">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="spanish">Spanish</SelectItem>
                <SelectItem value="french">French</SelectItem>
                <SelectItem value="german">German</SelectItem>
              </SelectContent>
            </Select>
          </div>
    </div>
  )
}