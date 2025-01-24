import { View, TouchableOpacity, StyleSheet, Text } from "react-native"
import { useTranslation } from "react-i18next"
import { Feather } from "@expo/vector-icons"
import { useTheme } from "@/providers/theme-provider"

interface ModeToggleProps {
  size?: number
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ size = 24 }) => {
  const { theme, setTheme, themeType } = useTheme()
  const { t } = useTranslation()

  const themes: { type: "light" | "dark" | "blue" | "green"; icon: string; label: string }[] = [
    { type: "light", icon: "sun", label: "Light" },
    { type: "dark", icon: "moon", label: "Dark" },
    { type: "blue", icon: "droplet", label: "Blue" },
    { type: "green", icon: "leaf", label: "Green" },
  ]

  const handleThemeChange = () => {
    const currentIndex = themes.findIndex((t) => t.type === themeType)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex].type)
  }

  const currentTheme = themes.find((t) => t.type === themeType)

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleThemeChange}
        style={[
          styles.button,
          {
            backgroundColor: theme.colors.card,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Feather name={currentTheme?.icon as any} size={size} color={theme.colors.text} style={styles.icon} />
        <Text style={[styles.text, { color: theme.colors.text }]}>{t(currentTheme?.label.toLowerCase() || "")}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
})

