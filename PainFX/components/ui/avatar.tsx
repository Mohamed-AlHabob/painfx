import { useTheme } from "@/providers/theme-provider"
import { View, Image, Text, StyleSheet } from "react-native"


interface AvatarProps {
  source?: { uri: string }
  name?: string
  size?: number
}

export const Avatar: React.FC<AvatarProps> = ({ source, name, size = 40 }) => {
  const { theme } = useTheme()

  const containerStyle = [
    styles.container,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: source ? "transparent" : theme.colors.card,
    },
  ]

  const textStyle = [
    styles.text,
    {
      fontSize: size * 0.4,
      color: theme.colors.text,
    },
  ]

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <View style={containerStyle}>
      {source ? (
        <Image source={source} style={styles.image} />
      ) : name ? (
        <Text style={textStyle}>{getInitials(name)}</Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  text: {
    fontWeight: "600",
  },
})

