import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { Avatar } from "./avatar"
import { Feather } from "@expo/vector-icons"
import { useTheme } from "@/providers/theme-provider"

interface ThreadProps {
  username: string
  content: string
  timestamp: string
  likes: number
  replies: number
  avatarSource?: { uri: string }
}

export const Thread: React.FC<ThreadProps> = ({ username, content, timestamp, likes, replies, avatarSource }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  return (
    <View style={[styles.container, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.avatarContainer}>
        <Avatar source={avatarSource} name={username} size={40} />
        <View style={[styles.threadLine, { backgroundColor: theme.colors.border }]} />
      </View>
      <View style={styles.contentContainer}>
        <Text style={[styles.username, { color: theme.colors.text }]}>{username}</Text>
        <Text style={[styles.content, { color: theme.colors.text }]}>{content}</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="heart" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="message-circle" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="repeat" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="send" size={20} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.stats, { color: theme.colors.textSecondary }]}>
          {likes} {t("likes")} · {replies} {t("replies")} · {timestamp}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    marginRight: 12,
    alignItems: "center",
  },
  threadLine: {
    width: 2,
    flex: 1,
    marginTop: 8,
  },
  contentContainer: {
    flex: 1,
  },
  username: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  content: {
    fontSize: 16,
    marginBottom: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  actionButton: {
    marginRight: 16,
  },
  stats: {
    fontSize: 14,
  },
})

