import React, { useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity, StyleSheet, RefreshControl, Text } from 'react-native';
import { useSelector } from 'react-redux';

import { colors, spacing, borderRadius } from '../../config/theme';
import { PostCard } from '@/components/post-card';
import { useRefresh } from '@/hooks/useRefresh';
import { RootState } from '@/redux/store';
import { useGetPostsQuery } from '@/redux/services/booking/postApiSlice';
import { useRetrieveUserQuery } from '@/redux/services/auth/authApiSlice';

interface Post {
  id: string;
  author: {
    name: string;
    headline: string;
    avatar: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export default function HomeScreen() {
  const { data: user } = useRetrieveUserQuery();
  const { data: posts, error, isLoading,isFetching } = useGetPostsQuery({ page: 1 });

  // if (isFetching || isLoading) {
  //   return (
  //       <PostItem.Skeleton />
  //   )
  // }
  
  if (!posts || error) {
    return <Text>sss</Text>;
  }
  
  // const [posts, setPosts] = useState<Post[]>([
  //   {
  //     id: '1',
  //     author: {
  //       name: 'Sarah Wilson',
  //       headline: 'Software Engineer at Tech Corp',
  //       avatar: '/placeholder.svg?height=48&width=48',
  //     },
  //     content: 'Excited to share that I\'ve started a new position as Senior Software Engineer! #newjob #tech',
  //     image: '/placeholder.svg?height=300&width=600',
  //     likes: 142,
  //     comments: 23,
  //     timestamp: '2h',
  //   },
  //   {
  //     id: '2',
  //     author: {
  //       name: 'Tech Insights',
  //       headline: 'Technology News and Updates',
  //       avatar: '/placeholder.svg?height=48&width=48',
  //     },
  //     content: 'The future of AI is here! Check out our latest report on emerging trends in artificial intelligence and machine learning.',
  //     likes: 856,
  //     comments: 134,
  //     timestamp: '4h',
  //   },
  // ]);

  const onRefresh = async () => {
    // Simulate fetching new posts
    await new Promise(resolve => setTimeout(resolve, 1500));
    // In a real app, you would fetch new posts from an API here
  };

  const { refreshing, handleRefresh } = useRefresh(onRefresh);

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.postBox}>
        <Image 
          source={{ uri: user?.profile?.avatar || "" }} 
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.postButton}>
          <Text style={styles.postButtonText}>Start a post</Text>
        </TouchableOpacity>
      </View>

      {posts.results.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  postBox: {
    flexDirection: 'row',
    padding: spacing.large,
    backgroundColor: colors.white,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    marginRight: spacing.medium,
  },
  postButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.text.secondary,
    borderRadius: borderRadius.round,
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.large,
  },
  postButtonText: {
    color: colors.text.secondary,
  },
});

