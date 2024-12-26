import {
  CreditCard,
  Explore,
  Home,
} from "@/components/icons"
import { Monitor, Moon, Sun } from "lucide-react"
import { JSX } from "react"

export type MenuProps = {
  id: string
  label: string
  icon: JSX.Element
  path: string
  section?: boolean
  integration?: boolean
}

export type GroupMenuProps = {
  id: number
  label: string
  icon: JSX.Element
  path: string
}

export const AUTH_LANDING_PAGE_MENU: MenuProps[] = [
  {
    id: "1",
    label: "Posts",
    icon: <Home />,
    path: "/X/post",
    section: true,
  },
  {
    id: "2",
    label: "Doctors",
    icon: <CreditCard />,
    path: "/X/doctors",
    section: true,
  },
  {
    id: "3",
    label: "centers",
    icon: <Explore />,
    path: "/X/health-centers",
  },
  {
    id: "4",
    label: "Reels",
    icon: <Explore />,
    path: "/X/reel",
  },
  {
    id: "5",
    label: "Reservations",
    icon: <Explore />,
    path: "/X/reservations",
  },
]
export const LANDING_PAGE_MENU: MenuProps[] = [
  {
    id: "1",
    label: "centers",
    icon: <Home />,
    path: "/X",
    section: true,
  },
  {
    id: "2",
    label: "Doctors",
    icon: <CreditCard />,
    path: "/X/doctors",
    section: true,
  },
  {
    id: "3",
    label: "About us",
    icon: <Explore />,
    path: "/X/health-centers",
  },
  {
    id: "4",
    label: "Deals ",
    icon: <Explore />,
    path: "#pricing",
  },
]


export const MODE_TOGGLE_MENU: MenuProps[] = [
  {
    id: "0",
    label: "Light",
    icon: <Sun />,
    path: "",
  },
  {
    id: "1",
    label: "Dark",
    icon: <Moon/>,
    path: "storage",
  },
  {
    id: "2",
    label: "System",
    icon: <Monitor/>,
    path: "",
  },
]
type IntegrationsListItemProps = {
  id: string
  name: "stripe"
  logo: string
  description: string
  title: string
  modalDescription: string
}

export const REQUESTS_TABLE_HEADER = [
  'client',
  'date',
  'status',
  'action',
]

export const INTEGRATION_LIST_ITEMS: IntegrationsListItemProps[] = [
  {
    id: "1",
    name: "stripe",
    description:
      "Stripe is the fastest and easiest way to integrate payments and financial services into your software platform or marketplace.",
    logo: "914be637-39bf-47e6-bb81-37b553163945",
    title: "Connect Stripe Account",
    modalDescription:
      "The world’s most successful platforms and marketplaces including Shopify and DoorDash, use Stripe Connect.",
  },
]
