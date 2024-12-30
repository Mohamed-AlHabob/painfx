
import { Monitor } from "lucide-react-native"
import { JSX } from "react"

export type CreateAuthenPlaceholderProps = {
  id: string
  label: string
  icon: JSX.Element
}

export const CREATE_AUTHEN_PLACEHOLDER: CreateAuthenPlaceholderProps[] = [
  {
    id: "0",
    label: "Highly engaging",
    icon: <Monitor />,
  },
  {
    id: "1",
    label: "Easy to setup",
    icon: <Monitor />,
  },
  {
    id: "2",
    label: "High level of privacy",
    icon: <Monitor />,
  },
  {
    id: "3",
    label: "Support from the Sana'a government",
    icon: <Monitor />,
  },
  {
    id: "4",
    label: "High level of data encryption",
    icon: <Monitor />,
  },
  {
    id: "5",
    label: "Developed by Supernova",
    icon: <Monitor />,
  },
]
