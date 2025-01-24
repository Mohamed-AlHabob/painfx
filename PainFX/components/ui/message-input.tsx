import { useState } from "react"
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { Feather } from "@expo/vector-icons"
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated"
import { useTheme } from "@/providers/theme-provider"


interface MessageInputProps {
  onSend: (message: string) => void
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState("")
  const { theme } = useTheme()
  const { t } = useTranslation()

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim())
      setMessage("")
    }
  }

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withSpring(message.length > 0 ? 1 : 0.5),
    }
  })

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TextInput
        style={[styles.input, { color: theme.colors.text }]}
        value={message}
        onChangeText={setMessage}
        placeholder={t("startThread")}
        placeholderTextColor={theme.colors.textSecondary}
        multiline
      />
      <Animated.View style={animatedStyle}>
        <TouchableOpacity
          style={[styles.sendButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleSend}
          disabled={message.length === 0}
        >
          <Feather name="arrow-up" size={24} color={theme.colors.buttonText} />
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 12,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
})

