import { useTheme } from '@/providers/theme-provider';
import React from 'react';
import { View, Text, StyleSheet } from "react-native"


interface ChatBubbleProps {
  message: string
  isOwn: boolean
  timestamp: string
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isOwn, timestamp }) => {
  const { theme } = useTheme()

  const bubbleStyle = [
    styles.bubble,
    isOwn ? styles.ownBubble : styles.otherBubble,
    {
      backgroundColor: isOwn ? theme.colors.primary : theme.colors.card,
    },
  ]

  const textStyle = [
    styles.text,
    {
      color: isOwn ? theme.colors.buttonText : theme.colors.text,
    },
  ]

  const timestampStyle = [
    styles.timestamp,
    {
      color: isOwn ? theme.colors.buttonText : theme.colors.textSecondary,
    },
  ]

  return (
    <View style={[styles.container, isOwn && styles.ownContainer]}>
      <View style={bubbleStyle}>
        <Text style={textStyle}>{message}</Text>
        <Text style={timestampStyle}>{timestamp}</Text>
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: "80%",
  },
  ownContainer: {
    alignSelf: "flex-end",
  },
  bubble: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  ownBubble: {
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
  },
  timestamp: {
    fontSize: 12,
    alignSelf: "flex-end",
    marginTop: 4,
  },
})