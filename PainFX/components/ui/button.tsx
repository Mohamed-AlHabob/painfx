import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native"
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated"
import { useTheme } from "@/providers/theme-provider"
import React from "react"


interface ButtonProps {
  onPress: () => void
  title: string
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  disabled?: boolean
  loading?: boolean
  icon?: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
}) => {
  const { theme } = useTheme()

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(disabled ? 0.95 : 1) }],
    }
  })

  const buttonStyle = [
    styles.button,
    styles[size],
    styles[variant],
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    { backgroundColor: variant === "primary" ? theme.colors.primary : "transparent" },
    variant === "outline" && { borderColor: theme.colors.primary, borderWidth: 1 },
  ]

  const textStyle = [
    styles.text,
    styles[`${size}Text`],
    { color: variant === "primary" ? theme.colors.buttonText : theme.colors.primary },
  ]

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}>
        {loading ? (
          <ActivityIndicator color={theme.colors.buttonText} />
        ) : (
          <>
            {icon && <Text style={styles.icon}>{icon}</Text>}
            <Text style={textStyle}>{title}</Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  sm: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  md: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  lg: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  primary: {},
  secondary: {},
  outline: {},
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    fontWeight: "600",
  },
  smText: {
    fontSize: 14,
  },
  mdText: {
    fontSize: 16,
  },
  lgText: {
    fontSize: 18,
  },
  icon: {
    marginRight: 8,
  },
})

