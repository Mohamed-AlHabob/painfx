import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useTranslation } from "react-i18next"
import { useTheme } from "@/providers/theme-provider"

interface Tab {
  key: string
  label: string
  hasDropdown?: boolean
}

interface CustomTabBarProps {
  tabs: Tab[]
  activeTab: string
  onTabPress: (tabKey: string) => void
}

export const CustomTabBar: React.FC<CustomTabBarProps> = ({ tabs, activeTab, onTabPress }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.tabBackground }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => onTabPress(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                { color: theme.colors.inactiveTab },
                activeTab === tab.key && { color: theme.colors.activeTab },
              ]}
            >
              {t(tab.label.toLowerCase())}
              {tab.hasDropdown && (
                <Feather
                  name="chevron-down"
                  size={16}
                  color={activeTab === tab.key ? theme.colors.activeTab : theme.colors.inactiveTab}
                  style={styles.dropdownIcon}
                />
              )}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "white",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dropdownIcon: {
    marginLeft: 4,
  },
})

