import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { PostActions } from '../../components/post-actions';
import { colors, fontSizes, spacing, borderRadius } from '../../config/theme';


interface Reel {
  id: string;
  video: string;
  user: {
    name: string;
    avatar: string;
  };
  description: string;
  likes: number;
  comments: number;
}

const { width, height } = Dimensions.get('window');

export default function ReelsScreen() {
  const [reels, setReels] = useState<Reel[]>([
    {
      id: '1',
      video: 'https://example.com/reel1.mp4',
      user: {
        name: 'John Doe',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      description: 'Check out this amazing project!',
      likes: 1200,
      comments: 84,
    },
    {
      id: '2',
      video: 'https://example.com/reel2.mp4',
      user: {
        name: 'Jane Smith',
        avatar: '/placeholder.svg?height=40&width=40',
      },
      description: 'A day in the life of a software engineer',
      likes: 3500,
      comments: 210,
    },
  ]);

  const renderReel = ({ item }: { item: Reel }) => (
    <View style={styles.reelContainer}>
      <Video
        source={{ uri: item.video }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        style={styles.video}
      />
      <View style={styles.overlay}>
        <View style={styles.userInfo}>
          <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
          <Text style={styles.userName}>{item.user.name}</Text>
        </View>
        <Text style={styles.description}>{item.description}</Text>
        <PostActions
          likes={item.likes}
          comments={item.comments}
          onLike={() => console.log('Like')}
          onComment={() => console.log('Comment')}
          onShare={() => console.log('Share')}
          onSend={() => console.log('Send')}
        />
      </View>
    </View>
  );

  return (
    <FlatList
      data={reels}
      renderItem={renderReel}
      keyExtractor={(item) => item.id}
      pagingEnabled
      snapToInterval={height}
      decelerationRate="fast"
    />
  );
}

const styles = StyleSheet.create({
  reelContainer: {
    width,
    height,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    padding: spacing.large,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.medium,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.round,
    marginRight: spacing.medium,
  },
  userName: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: fontSizes.large,
  },
  description: {
    color: colors.white,
    marginBottom: spacing.large,
  },
});

