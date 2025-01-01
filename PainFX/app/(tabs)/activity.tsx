import { ScrollView, View, Text, Image } from 'react-native';
import { Container } from '../../components/ui/container';
import { useAppContext } from '@/hooks/useAppContext';

export default function Activity() {
  const { isDarkMode,t } = useAppContext();

  const activities = [
    {
      id: '1',
      type: 'follow',
      user: {
        name: 'John Doe',
        avatar: '/placeholder.svg?height=40&width=40'
      },
      timeAgo: '2h'
    },
    {
      id: '2',
      type: 'like',
      user: {
        name: 'Jane Smith',
        avatar: '/placeholder.svg?height=40&width=40'
      },
      post: 'Your recent post',
      timeAgo: '4h'
    },
    // Add more activities
  ];

  return (
    <ScrollView className={isDarkMode ? 'bg-black' : 'bg-white'}>
      <Container className="p-4">
        <Text className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
          {t('activity.title')}
        </Text>
        {activities.map(activity => (
          <View key={activity.id} className="flex-row items-center mb-4">
            <Image
              source={{ uri: activity.user.avatar }}
              className="w-10 h-10 rounded-full mr-3"
            />
            <View className="flex-1">
              <Text className={isDarkMode ? 'text-white' : 'text-black'}>
                <Text className="font-semibold">{activity.user.name}</Text>
                {' '}
                {activity.type === 'follow' ? t('activity.followed') : t('activity.liked')}
                {activity.type === 'like' && ` "${activity.post}"`}
              </Text>
              <Text className="text-gray-500">{activity.timeAgo}</Text>
            </View>
          </View>
        ))}
      </Container>
    </ScrollView>
  );
}

