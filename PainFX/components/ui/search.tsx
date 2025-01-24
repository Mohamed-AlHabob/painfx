import { useState } from "react"
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import { Feather } from "@expo/vector-icons"
import { useTheme } from "@/providers/theme-provider"

interface SearchProps {
  onSearch: (query: string) => void
  placeholder?: string
  glassEffect?: boolean
}

export const Search: React.FC<SearchProps> = ({ onSearch, placeholder = "Search...", glassEffect = false }) => {
  const [query, setQuery] = useState("")
  const { theme } = useTheme()

  const handleSearch = () => {
    onSearch(query)
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }, glassEffect && styles.glassEffect]}>
      <TextInput
        style={[styles.input, { color: theme.colors.text }]}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.placeholderText}
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity onPress={handleSearch}>
        <Feather name="search" size={24} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 8,
  },
  input: {
    flex: 1,
    marginRight: 8,
    fontSize: 16,
  },
  glassEffect: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: "blur(10px)",
  },
})

