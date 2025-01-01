import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Settings } from 'lucide-react-native';

import { useAppContext } from '@/hooks/useAppContext';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/Button';

export default function Profile() {
    const { isDarkMode,t } = useAppContext();
  
  const profile = {
    name: 'Mohamad Alhabob',
    username: 'super.nova.co',
    bio: 'Super Nova',
    followers: 63,
    following: 100,
    verified: false
  };

  return (
    <ScrollView className={isDarkMode ? 'bg-black' : 'bg-white'}>
      <Container className="p-4">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {profile.name}
            </Text>
            <Text className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {profile.username}
            </Text>
          </View>
          <Image
            source={{ uri: '/placeholder.svg?height=80&width=80' }}
            className="w-20 h-20 rounded-full"
          />
        </View>

        <Text className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {profile.bio}
        </Text>

        <View className="flex-row mb-6">
          <Text className={`mr-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <Text className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {profile.followers}
            </Text> {t('profile.followers')}
          </Text>
          <Text className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            <Text className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {profile.following}
            </Text> {t('profile.following')}
          </Text>
        </View>

        <View className="flex-row mb-6">
          <Button variant="outline" className="flex-1 mr-2">
            {t('profile.editProfile')}
          </Button>
          <Button variant="outline" className="flex-1 ml-2">
            {t('profile.shareProfile')}
          </Button>
        </View>

        <Link href="/settings" asChild>
          <TouchableOpacity className="self-end">
            <Settings size={24} color={isDarkMode ? '#fff' : '#000'} />
          </TouchableOpacity>
        </Link>

        {/* Add tabs for Threads, Replies, and Reposts */}
      </Container>
    </ScrollView>
  );
}

