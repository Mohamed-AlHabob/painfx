import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Heart, MessageCircle, Repeat2, Send } from 'lucide-react-native';
import { useAppContext } from '@/hooks/useAppContext';

interface PostProps {
  post: {
    id: string;
    author: {
      name: string;
      username: string;
      avatar: string;
      verified: boolean;
    };
    content: {
      text: string;
      description: string;
    };
    stats: {
      likes: number;
      replies: number;
      reposts: number;
    };
    timeAgo: string;
  };
}

export function Post({ post }: PostProps) {
    const { isDarkMode } = useAppContext();

  return (
    <View 
      className={`p-4 border-b ${
        isDarkMode 
          ? 'border-gray-800' 
          : 'border-gray-200'
      }`}
    >
      <View className="flex-row items-start mb-3">
        <Image
          source={{ uri: post.author.avatar }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {post.author.name}
            </Text>
            {post.author.verified && (
              <View className="ml-1 bg-blue-500 rounded-full p-1">
                <Text className="text-white text-xs">✓</Text>
              </View>
            )}
          </View>
          <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            @{post.author.username}
          </Text>
        </View>
        <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          {post.timeAgo}
        </Text>
      </View>

      <Text className={`mb-3 ${isDarkMode ? 'text-white' : 'text-black'}`}>
        {post.content.text}
      </Text>
      <Text className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {post.content.description}
      </Text>

      <View className="flex-row justify-between">
        <TouchableOpacity className="flex-row items-center">
          <Heart size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
          <Text className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {post.stats.likes}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center">
          <MessageCircle size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
          <Text className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {post.stats.replies}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center">
          <Repeat2 size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
          <Text className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {post.stats.reposts}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Send size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

