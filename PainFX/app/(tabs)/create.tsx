import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Image, AtSign } from 'lucide-react-native';

import { useAppContext } from '@/hooks/useAppContext';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/Button';

export default function Create() {
    const { isDarkMode,t } = useAppContext();
  const [post, setPost] = useState('');

  return (
    <Container className={`p-4 ${isDarkMode ? 'bg-black' : 'bg-white'}`}>
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 rounded-full bg-gray-300 mr-3" />
        <Text className={`font-semibold ${isDarkMode ? 'text-white' : 'text-black'}`}>
          YourUsername
        </Text>
      </View>
      <TextInput
        className={`text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}
        placeholder={t('create.placeholder')}
        placeholderTextColor={isDarkMode ? '#666' : '#999'}
        multiline
        value={post}
        onChangeText={setPost}
      />
      <View className="flex-row justify-between items-center">
        <View className="flex-row">
          <TouchableOpacity className="mr-4">
            <Image size={24} color={isDarkMode ? '#fff' : '#000'} />
          </TouchableOpacity>
          <TouchableOpacity>
            <AtSign size={24} color={isDarkMode ? '#fff' : '#000'} />
          </TouchableOpacity>
        </View>
        <Button onPress={() => {/* Handle post creation */}}>
          {t('create.post')}
        </Button>
      </View>
    </Container>
  );
}

