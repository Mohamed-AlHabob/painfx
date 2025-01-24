import React from "react"
import { useState } from "react"
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from "react-native"
import { useTranslation } from "react-i18next"
import { useTheme } from "@/providers/theme-provider"
import { useLanguage } from "@/providers/language-provider"
import { MessageInput } from "@/components/ui/message-input"
import { Thread } from "@/components/ui/thread"

const sampleThreads = [
  {
    id: "1",
    username: "johndoe",
    content: "Just posted my first thread! #excited",
    timestamp: "2h ago",
    likes: 42,
    replies: 7,
    avatarSource: { uri: "https://randomuser.me/api/portraits/men/1.jpg" },
  },
  {
    id: "2",
    username: "janedoe",
    content: "Loving the new Threads app! What do you all think?",
    timestamp: "4h ago",
    likes: 108,
    replies: 23,
    avatarSource: { uri: "https://randomuser.me/api/portraits/women/1.jpg" },
  },
    {
        id: "3",
        username: "jackdoe",
        content: "Just posted my first thread! #excited",
        timestamp: "2h ago",
        likes: 42,
        replies: 7,
        avatarSource: { uri: "https://randomuser.me/api/portraits/women/2.jpg"}
    },
]

export default function Home() {
  const { theme, setTheme, themeType } = useTheme()
  const { language, setLanguage } = useLanguage()
  const { t } = useTranslation()
  const [threads, setThreads] = useState(sampleThreads)

  const handleNewThread = (content: string) => {
    const newThread = {
      id: String(threads.length + 1),
      username: "currentuser",
      content,
      timestamp: "Just now",
      likes: 0,
      replies: 0,
      avatarSource: { uri: "https://randomuser.me/api/portraits/lego/1.jpg" },
    }
    setThreads([newThread, ...threads])
  }

  const toggleTheme = () => {
    const themes: ("light" | "dark" | "blue" | "green")[] = ["light", "dark", "blue", "green"]
    const currentIndex = themes.indexOf(themeType)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const toggleLanguage = () => {
    const languages = ["en", "ar", "ku"]
    const currentIndex = languages.indexOf(language)
    const nextIndex = (currentIndex + 1) % languages.length
    setLanguage(languages[nextIndex])
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleTheme} style={styles.button}>
          <Text style={[styles.buttonText, { color: theme.colors.text }]}>{t("changeTheme")}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleLanguage} style={styles.button}>
          <Text style={[styles.buttonText, { color: theme.colors.text }]}>{t("changeLanguage")}</Text>
        </TouchableOpacity>
      </View>
      <FlatList data={threads} renderItem={({ item }) => <Thread {...item} />} keyExtractor={(item) => item.id} />
      <MessageInput onSend={handleNewThread} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  button: {
    padding: 8,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
  },
})

