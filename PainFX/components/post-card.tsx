import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { PostActions } from './post-actions';
import { colors, fontSizes, spacing, borderRadius } from '../config/theme';
import { Post } from '@/schemas/Social/post';

interface PostCardProps {
  post: Post
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Image 
          source={{ uri: post.doctor?.user.profile?.avatar || "" }} 
          style={styles.authorAvatar}
        />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{post.doctor?.user.first_name}</Text>
          <Text style={styles.authorHeadline}>{post.title}</Text>
          <Text style={styles.timestamp}>{post.created_at}</Text>
        </View>
      </View>

      <Text style={styles.content}>{post.content}</Text>
      
      {post.thumbnail_url && (
        <Image 
          source={{ uri: post.thumbnail_url || "" }}
          style={styles.postImage}
        />
      )}

      <PostActions
        likes={post.likes_count ||0}
        comments={post.comments_count || 0}
        onLike={() => console.log('Like')}
        onComment={() => console.log('Comment')}
        onShare={() => console.log('Share')}
        onSend={() => console.log('Send')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  post: {
    backgroundColor: colors.white,
    marginTop: spacing.small,
    paddingVertical: spacing.medium,
  },
  postHeader: {
    flexDirection: 'row',
    padding: spacing.medium,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.medium,
  },
  authorInfo: {
    marginLeft: spacing.medium,
    flex: 1,
  },
  authorName: {
    fontWeight: '600',
    fontSize: fontSizes.large,
  },
  authorHeadline: {
    color: colors.text.secondary,
    fontSize: fontSizes.medium,
    marginTop: spacing.small / 2,
  },
  timestamp: {
    color: colors.text.secondary,
    fontSize: fontSizes.small,
    marginTop: spacing.small / 2,
  },
  content: {
    padding: spacing.medium,
    fontSize: fontSizes.medium,
    lineHeight: fontSizes.large * 1.4,
  },
  postImage: {
    width: '100%',
    height: 300,
  },
});

