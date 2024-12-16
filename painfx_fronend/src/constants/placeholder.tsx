import {
  Chat,
  Courses,
  Document,
  Grid,
  Heart,
  MegaPhone,
} from "@/components/icons"
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
    icon: <MegaPhone />,
  },
  {
    id: "1",
    label: "Easy to setup",
    icon: <Heart />,
  },
  {
    id: "2",
    label: "High level of privacy",
    icon: <Chat />,
  },
  {
    id: "3",
    label: "Support from the Sana'a government",
    icon: <Grid />,
  },
  {
    id: "4",
    label: "High level of data encryption",
    icon: <Document />,
  },
  {
    id: "5",
    label: "Developed by Supernova",
    icon: <Courses />,
  },
]
