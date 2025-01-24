import { View, TextInput, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { Feather } from "@expo/vector-icons"
import { useTheme } from "@/providers/theme-provider"


interface MapSearchProps {
  onSearch: (text: string) => void
}

export const MapSearch: React.FC<MapSearchProps> = ({ onSearch }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  return (
    <View style={[styles.container]}>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
        <Feather name="search" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={[styles.input, { color: theme.colors.text }]}
          placeholder={t("searchByCity")}
          placeholderTextColor={theme.colors.textSecondary}
          onChangeText={onSearch}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 8,
    zIndex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 2,
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
})

