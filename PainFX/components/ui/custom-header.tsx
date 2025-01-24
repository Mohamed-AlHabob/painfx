import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"
import { useTranslation } from "react-i18next"
import { useTheme } from "@/providers/theme-provider"

interface CustomHeaderProps {
  title: string
  onSettingsPress?: () => void
  onNotificationPress?: () => void
  showVip?: boolean
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  onSettingsPress,
  onNotificationPress,
  showVip = true,
}) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  return (
    <LinearGradient
      colors={theme.colors.headerGradient as [string, string, ...string[]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        {showVip && (
          <View style={styles.leftSection}>
            <View style={styles.vipContainer}>
              <LinearGradient
                colors={theme.colors.vipGradient as [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.upgradeBadge}
              >
                <Text style={styles.upgradeText}>{t("upgrade")}</Text>
              </LinearGradient>
              <View style={styles.vipBadge}>
                <Text style={styles.vipText}>VIP</Text>
              </View>
            </View>
          </View>
        )}

        <Text style={[styles.title, { color: theme.colors.buttonText }]}>{title}</Text>

        <View style={styles.rightSection}>
          <TouchableOpacity onPress={onNotificationPress} style={styles.iconButton}>
            <Feather name="zap" size={24} color={theme.colors.buttonText} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSettingsPress} style={styles.iconButton}>
            <Feather name="sliders" size={24} color={theme.colors.buttonText} />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  leftSection: {
    flex: 1,
  },
  vipContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  upgradeBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
  },
  upgradeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  vipBadge: {
    backgroundColor: "#FFD700",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  vipText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    flex: 2,
    textAlign: "center",
  },
  rightSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
})

