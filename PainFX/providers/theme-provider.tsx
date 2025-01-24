import React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useColorScheme } from "react-native"

type ThemeType = "light" | "dark" | "blue" | "green"

type Theme = {
  dark: boolean
  colors: {
    primary: string
    background: string
    card: string
    text: string
    textSecondary: string
    border: string
    notification: string
    buttonText: string
    placeholderText: string
    headerGradient: string[]
    backgroundGradient: string[]
    vipGradient: string[]
    tabBackground: string
    activeTab: string
    inactiveTab: string
    success: string
    error: string
    info: string
  }
}

const themes: Record<ThemeType, Theme> = {
  light: {
    dark: false,
    colors: {
      primary: "#6B35E8",
      background: "#FFFFFF",
      card: "#F2F2F2",
      text: "#000000",
      textSecondary: "#8E8E93",
      border: "#E5E5E5",
      notification: "#FF3B30",
      buttonText: "#FFFFFF",
      placeholderText: "#C7C7CC",
      headerGradient: ["#6B35E8", "#4A238C"],
      backgroundGradient: ["#4A238C", "#2A1650"],
      vipGradient: ["#FFB800", "#FF8A00"],
      tabBackground: "#1a1a1a",
      activeTab: "#FFFFFF",
      inactiveTab: "#8E8E93",
      success: "#00C853",
      error: "#00C853",
      info: "#00C853",
    },
  },
  dark: {
    dark: true,
    colors: {
      primary: "#6B35E8",
      background: "#000000",
      card: "#1C1C1E",
      text: "#FFFFFF",
      textSecondary: "#8E8E93",
      border: "#38383A",
      notification: "#FF453A",
      buttonText: "#FFFFFF",
      placeholderText: "#8E8E93",
      headerGradient: ["#6B35E8", "#4A238C"],
      backgroundGradient: ["#4A238C", "#2A1650"],
      vipGradient: ["#FFB800", "#FF8A00"],
      tabBackground: "#1a1a1a",
      activeTab: "#FFFFFF",
      inactiveTab: "#8E8E93",
      success: "#00C853",
      error: "#00C853",
      info: "#00C853",
    },
  },
  blue: {
    dark: false,
    colors: {
      primary: "#007AFF",
      background: "#F0F8FF",
      card: "#E1F0FF",
      text: "#000000",
      textSecondary: "#5A5A5A",
      border: "#B8D8FF",
      notification: "#FF3B30",
      buttonText: "#FFFFFF",
      placeholderText: "#A0A0A0",
      headerGradient: ["#007AFF", "#66B2FF"],
      backgroundGradient: ["#66B2FF", "#99D6FF"],
      vipGradient: ["#FFB800", "#FF8A00"],
      tabBackground: "#1a1a1a",
      activeTab: "#FFFFFF",
      inactiveTab: "#8E8E93",
      success: "#00C853",
      error: "#00C853",
      info: "#00C853",
    },
  },
  green: {
    dark: false,
    colors: {
      primary: "#34C759",
      background: "#F0FFF0",
      card: "#E1FFE1",
      text: "#000000",
      textSecondary: "#5A5A5A",
      border: "#B8FFB8",
      notification: "#FF3B30",
      buttonText: "#FFFFFF",
      placeholderText: "#A0A0A0",
      headerGradient: ["#34C759", "#80E896"],
      backgroundGradient: ["#80E896", "#C2F2D0"],
      vipGradient: ["#FFB800", "#FF8A00"],
      tabBackground: "#1a1a1a",
      activeTab: "#FFFFFF",
      inactiveTab: "#8E8E93",
      success: "#00C853",
      error: "#00C853",
      info: "#00C853",
    },
  },
}

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: ThemeType) => void
  themeType: ThemeType
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme()
  const [themeType, setThemeType] = useState<ThemeType>(colorScheme === "dark" ? "dark" : "light")

  useEffect(() => {
    setThemeType(colorScheme === "dark" ? "dark" : "light")
  }, [colorScheme])

  const setTheme = (newTheme: ThemeType) => {
    setThemeType(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme: themes[themeType], setTheme, themeType }}>{children}</ThemeContext.Provider>
  )
}

