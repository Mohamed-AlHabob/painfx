import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '@/hooks/useAppContext';
import { Moon, Sun, Globe } from 'lucide-react-native';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'ku', name: 'کوردی' },
];

export default function TabTwoScreen() {
  const { locale, setLocale, t, isRTL, isDarkMode, toggleTheme } = useAppContext();

  return (
    <SafeAreaView className="flex-1">
      <ScrollView
        className={`flex-1 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
        contentContainerClassName="p-4"
      >
        <View className="items-center mb-6">
          <Text
            className={`text-2xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            {t('settings.title')}
          </Text>
          <Text
            className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
          >
            {t('settings.subtitle')}
          </Text>
        </View>

        <View className="mb-6">
          <Text
            className={`text-lg font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            {t('settings.appearance')}
          </Text>
          <TouchableOpacity
            onPress={toggleTheme}
            className={`flex-row items-center justify-between p-4 rounded-lg ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
            accessibilityRole="button"
            accessibilityLabel={t('settings.toggleTheme')}
          >
            <View className="flex-row items-center">
              {isDarkMode ? (
                <Moon className="w-6 h-6 text-yellow-400 mr-3" />
              ) : (
                <Sun className="w-6 h-6 text-yellow-500 mr-3" />
              )}
              <Text
                className={`text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              >
                {t('settings.toggleTheme')}
              </Text>
            </View>
            <Text
              className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
            >
              {isDarkMode ? t('settings.darkMode') : t('settings.lightMode')}
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <Text
            className={`text-lg font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}
          >
            {t('settings.language')}
          </Text>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              onPress={() => setLocale(lang.code)}
              className={`flex-row ${isRTL ? 'flex-row-reverse' : ''} items-center justify-between p-4 rounded-lg mb-2 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              } ${locale === lang.code ? 'border-2 border-blue-500' : ''}`}
              accessibilityRole="radio"
              accessibilityState={{ checked: locale === lang.code }}
              accessibilityLabel={`${t('settings.selectLanguage')} ${lang.name}`}
            >
              <View className="flex-row items-center">
                <Globe
                  className={`w-6 h-6 mr-3 ${
                    locale === lang.code
                      ? 'text-blue-500'
                      : isDarkMode
                      ? 'text-gray-400'
                      : 'text-gray-500'
                  }`}
                />
                <Text
                  className={`text-base ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {lang.name}
                </Text>
              </View>
              {locale === lang.code && (
                <View className="w-4 h-4 rounded-full bg-blue-500" />
              )}
            </TouchableOpacity>

          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
