import { useTheme } from "@/providers/theme-provider"
import { View, ActivityIndicator, StyleSheet } from "react-native"

interface LoaderProps {
  size?: "small" | "large"
  color?: string
}

export const Loader: React.FC<LoaderProps> = ({ size = "small", color }) => {
  const { theme } = useTheme()

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color || theme.colors.primary} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
})

