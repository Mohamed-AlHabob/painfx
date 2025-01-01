import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from '../hooks/useTranslation';



const languages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'ku', name: 'کوردی' },
];

const LanguageSwitcher: React.FC = () => {
  const { locale, setLocale, t } = useTranslation();

  return (
    <View className='mt-4'>
      <Text className={`text-lg font-bold mb-2 `}>
        {t('selectLanguage')}
      </Text>
      <View className='flex-row justify-between'>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.code}
            onPress={() => setLocale(lang.code)}
            className={`px-4 py-2 rounded-full ${
              locale === lang.code
           
                  ? 'bg-blue-600'
                  : 'bg-blue-500'

            }`}
          >
            <Text
              className={`${
                locale === lang.code
                  ? 'text-white font-bold'
             
             
                  : 'text-gray-600'
              }`}
            >
              {lang.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default LanguageSwitcher;

