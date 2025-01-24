import { useTheme } from "@/providers/theme-provider"
import { useEffect } from "react"
import { View, Text, StyleSheet, Animated } from "react-native"



interface ToastProps {
  message: string
  duration?: number
  onHide: () => void
  type?: "success" | "error" | "info"
  glassEffect?: boolean
}

export const Toast: React.FC<ToastProps> = ({
  message,
  duration = 3000,
  onHide,
  type = "info",
  glassEffect = false,
}) => {
  const { theme } = useTheme()
  const opacity = new Animated.Value(0)

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(duration),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onHide())
  }, [])

  const backgroundColor = {
    success: theme.colors.success,
    error: theme.colors.error,
    info: theme.colors.info,
  }[type]

  return (
    <Animated.View style={[styles.container, { opacity, backgroundColor }, glassEffect && styles.glassEffect]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  )
}


const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    padding: 15,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
  },
  glassEffect: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
  },
})

