import React from "react"
import { Stack } from "expo-router"
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { ThemeProvider } from "@/providers/theme-provider"
import { LanguageProvider } from "@/providers/language-provider"


export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar style="auto" />
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  )
}
