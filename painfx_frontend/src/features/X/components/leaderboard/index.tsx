import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"



export const LeaderBoardCard = () => {
  return (
    <Card
      className={cn(
        "dark:border-themeGray dark:bg-[#1A1A1D] lg:sticky lg:top-0 mt-10 lg:mt-0 rounded-xl p-5 overflow-hidden",
      )}
    >
      <h2 className="text-xl font-bold">
        leaderboard (30-days)
      </h2>
      <p className="text-sm">
        See who performed the best this month.
      </p>
    </Card>
  )
}
