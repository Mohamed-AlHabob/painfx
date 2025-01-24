import React from "react"
import { View, Text, StyleSheet } from "react-native"

import { useTranslation } from "react-i18next"
import { useTheme } from "@/providers/theme-provider"
import { CustomHeader } from "@/components/ui/custom-header"

export default function Search() {
  const { theme } = useTheme()
  const { t } = useTranslation()

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CustomHeader title={t("search")} onSettingsPress={() => {}} onNotificationPress={() => {}} />
      <View style={styles.content}>
        <Text style={[styles.text, { color: theme.colors.text }]}>Search Screen</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
  },
})

