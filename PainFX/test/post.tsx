import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Heart, MessageCircle, Repeat2, Send } from 'lucide-react-native';
import { useAppContext } from '@/hooks/useAppContext';
import { Skeleton } from './ui/skeleton';
import { Post } from '@/schemas/Social/post';
import getTimeAgo from './ui/getTimeAgo';

interface PostProps {
  post: Post;
}

export function PostItem({ post }: PostProps) {
  const { isDarkMode } = useAppContext();
  const timeAgo = getTimeAgo(post.created_at || "");
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
          source={{ uri: post.doctor?.user.profile?.avatar || "" }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className={`font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
              {post.doctor?.user.first_name} {post.doctor?.user.last_name}
            </Text>
            {post.doctor?.specialization  && (
              <View className="ml-1 bg-blue-500 rounded-full p-1">
                <Text className="text-white text-xs">✓</Text>
              </View>
            )}
          </View>
          <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            @{post.doctor?.user.email}
          </Text>
        </View>
        <Text className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
          {timeAgo}
        </Text>
      </View>

      <Text className={`mb-3 ${isDarkMode ? 'text-white' : 'text-black'}`}>
        {post.title}
      </Text>
      <Text className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {post.content}
      </Text>

      <View className="flex-row justify-between">
        <TouchableOpacity className="flex-row items-center">
          <Heart size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
          <Text className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {post.likes_count}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center">
          <MessageCircle size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
          <Text className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {post.likes_count}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity className="flex-row items-center">
          <Repeat2 size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
          <Text className={`ml-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {post.comments_count}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Send size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

PostItem.skeleton = function PostSkeleton() {
  const { isDarkMode } = useAppContext();
  return (
    <View className={isDarkMode ? 'bg-black' : 'bg-white'}>
    <View className="flex-row items-center mb-2">
      <Skeleton width={40} height={40} radius={20} />
      <View className="ml-2">
        <Skeleton width={120} height={16} className="mb-1" />
        <Skeleton width={80} height={14} />
      </View>
    </View>
    <Skeleton width="100%" height={16} className="mb-2" />
    <Skeleton width="100%" height={16} className="mb-2" />
    <Skeleton width="80%" height={16} className="mb-4" />
    <View className="flex-row justify-between">
      <Skeleton width={40} height={20} />
      <Skeleton width={40} height={20} />
      <Skeleton width={40} height={20} />
      <Skeleton width={40} height={20} />
    </View>
  </View>

);
};