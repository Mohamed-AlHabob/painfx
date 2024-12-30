import { useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

interface Post {
  id: string;
  title: string;
  content: string;
  video_url?: string;
  thumbnail_url?: string;
}

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const storedPosts = await AsyncStorage.getItem('posts');
      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const createPost = useCallback(async (newPost: Omit<Post, 'id'>) => {
    setIsLoading(true);
    try {
      const id = Date.now().toString();
      const postWithId = { ...newPost, id };
      const updatedPosts = [...posts, postWithId];
      await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
      Alert.alert('Success', 'Post created successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  }, [posts]);

  const updatePost = useCallback(async (id: string, updatedData: Partial<Post>) => {
    setIsLoading(true);
    try {
      const updatedPosts = posts.map(post =>
        post.id === id ? { ...post, ...updatedData } : post
      );
      await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
      Alert.alert('Success', 'Post updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update post');
    } finally {
      setIsLoading(false);
    }
  }, [posts]);

  const deletePost = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const updatedPosts = posts.filter(post => post.id !== id);
      await AsyncStorage.setItem('posts', JSON.stringify(updatedPosts));
      setPosts(updatedPosts);
      Alert.alert('Success', 'Post deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete post');
    } finally {
      setIsLoading(false);
    }
  }, [posts]);

  return {
    posts,
    isLoading,
    createPost,
    updatePost,
    deletePost,
  };
};

