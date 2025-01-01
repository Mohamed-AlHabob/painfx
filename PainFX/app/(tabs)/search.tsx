import { ScrollView, View, Text, TextInput } from 'react-native';
import { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react-native';
import { useAppContext } from '@/hooks/useAppContext';
import { Container } from '@/components/ui/container';

export default function Search() {
    const { isDarkMode,t } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ScrollView className={isDarkMode ? 'bg-black' : 'bg-white'}>
      <Container className="p-4">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mb-4">
          <SearchIcon size={20} color={isDarkMode ? '#666' : '#999'} />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder={t('search.placeholder')}
            placeholderTextColor={isDarkMode ? '#666' : '#999'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Text className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
          {t('search.trending')}
        </Text>
        {/* Add trending topics or search results here */}
      </Container>
    </ScrollView>
  );
}

