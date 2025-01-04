import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Link } from 'expo-router';
import { Post } from '@/schemas/Social/post';
import { useLikePostMutation } from '@/redux/services/booking/likeApiSlice';

type PostItemProps = {
  post: Post;
};

const PostItem = ({ post }: PostItemProps) => {
  const [likePost, { isLoading: isLiking }] = useLikePostMutation()
  return (
    <View style={styles.container}>
      <Image source={{ uri: post.doctor?.user.profile?.avatar || "" }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Link href={`/feed/profile/${post.doctor?.user.id}`} asChild>
              <Text style={styles.username}>
                {post.doctor?.user.first_name || ""} {post.doctor?.user?.last_name || ""}
              </Text>
            </Link>
            <Text style={styles.timestamp}>
              {new Date(post?.created_at || "").toLocaleDateString()}
            </Text>
          </View>
          <Ionicons
            name="ellipsis-horizontal"
            size={24}
            color={Colors.border}
            style={{ alignSelf: 'flex-end' }}
          />
        </View>
        <Text style={styles.content}>{post.content}</Text>
        {(post.video_file && post.video_file.length > 0) || (post.thumbnail_url && post.thumbnail_url.length > 0) && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.mediaContainer}>
            
              <Link
                href={`/(auth)/(modal)/image/${encodeURIComponent(post.thumbnail_url || "")}?threadId=${post.id}&likeCount=${post.likes_count || 0}&commentCount=${post.comments_count || 0}&retweetCount=${post.comments_count || 0}`}
                asChild>
                <TouchableOpacity>
                  <Image source={{ uri: post.thumbnail_url || "" }} style={styles.mediaImage} />
                </TouchableOpacity>
              </Link>
           
          </ScrollView>
        )}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => likePost({ post: post.id || "" })}>
            <Ionicons name="heart-outline" size={24} color="black" />
            <Text style={styles.actionText}>{post.likes_count || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="black" />
            <Text style={styles.actionText}>{post.comments_count || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="repeat-outline" size={24} color="black" />
            <Text style={styles.actionText}>{post.likes_count || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Feather name="send" size={22} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostItem;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    flexDirection: 'row',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    color: '#777',
    fontSize: 12,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
  },
  mediaImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  mediaContainer: {
    flexDirection: 'row',
    gap: 14,
    paddingRight: 40,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    marginLeft: 5,
  },
});
