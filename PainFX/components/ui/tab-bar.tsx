import React from "react"
import { View, TouchableOpacity, StyleSheet, Text } from "react-native"
import { useTranslation } from "react-i18next"
import { Feather } from "@expo/vector-icons"
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated"
import { useTheme } from "@/providers/theme-provider"

interface TabBarProps {
  state: any
  descriptors: any
  navigation: any
}

export const TabBar: React.FC<TabBarProps> = ({ state, descriptors, navigation }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key]
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name

        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({ name: route.name, merge: true })
          }
        }

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          })
        }

        const animatedStyle = useAnimatedStyle(() => {
          return {
            transform: [{ scale: withSpring(isFocused ? 1 : 1) }],
          }
        })

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
          >
            <Animated.View style={animatedStyle}>
              <Feather
                name={label.toLowerCase()}
                size={20}
                color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
              />
              <Text style={[styles.label, { color: isFocused ? theme.colors.primary : theme.colors.textSecondary }]}>
                {t(label.toLowerCase())}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    height: 60,
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    marginTop: 4,
  },
})

