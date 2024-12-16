import { RefreshCcw } from "lucide-react"
import {
  Buisness,
  Fitness,
  LifeStyle,
  Music,
  PersonalDevelopment,
  SocialMedia,
  Tech,
} from "@/components/icons"
import { JSX } from "react"

export type ReasonsListProps = {
  id: string
  label: string
  icon: JSX.Element
  path: string
}

export const REASONS_LIST: ReasonsListProps[] = [
  {
    id: "0",
    label: "All",
    icon: <RefreshCcw />,
    path: "",
  },
  {
    id: "1",
    label: "Performance",
    icon: <Fitness />,
    path: "Performance",
  },
  {
    id: "2",
    label: "for fun",
    icon: <Music />,
    path: "music",
  },
  {
    id: "3",
    label: "Buisness",
    icon: <Buisness />,
    path: "buisness",
  },
  {
    id: "4",
    label: "exploration",
    icon: <LifeStyle />,
    path: "exploration",
  },
  {
    id: "5",
    label: "Judiciary",
    icon: <PersonalDevelopment />,
    path: "Judiciary",
  },
  {
    id: "6",
    label: "Confirm information",
    icon: <SocialMedia />,
    path: "Confirm information",
  },
  {
    id: "7",
    label: "Tech",
    icon: <Tech />,
    path: "tech",
  },
]
