import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MoreHorizontal } from 'lucide-react-native';
import { colors, fontSizes, spacing, borderRadius } from '../../config/theme';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'connection' | 'mention';
  content: string;
  timestamp: string;
  avatar: string;
  isRead: boolean;
}

export default function NotificationsScreen() {
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'like',
      content: 'David Chen liked your post about AI developments',
      timestamp: '2h',
      avatar: '/placeholder.svg?height=48&width=48',
      isRead: false,
    },
    {
      id: '2',
      type: 'connection',
      content: 'Sarah Wilson accepted your connection request',
      timestamp: '4h',
      avatar: '/placeholder.svg?height=48&width=48',
      isRead: true,
    },
    {
      id: '3',
      type: 'comment',
      content: 'Michael Brown commented on your article',
      timestamp: '1d',
      avatar: '/placeholder.svg?height=48&width=48',
      isRead: true,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <MoreHorizontal size={24} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {notifications.map(notification => (
        <TouchableOpacity 
          key={notification.id} 
          style={[
            styles.notification,
            !notification.isRead && styles.unread
          ]}
        >
          <Image 
            source={{ uri: notification.avatar }}
            style={styles.avatar}
          />
          <View style={styles.content}>
            <Text style={styles.notificationText}>
              {notification.content}
            </Text>
            <Text style={styles.timestamp}>{notification.timestamp}</Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreHorizontal size={20} color={colors.text.secondary} />
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.large,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: fontSizes.xxlarge,
    fontWeight: '600',
  },
  settingsButton: {
    padding: spacing.small,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.large,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  unread: {
    backgroundColor: colors.background,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.round,
  },
  content: {
    flex: 1,
    marginLeft: spacing.medium,
  },
  notificationText: {
    fontSize: fontSizes.medium,
    lineHeight: fontSizes.large * 1.4,
  },
  timestamp: {
    color: colors.text.secondary,
    fontSize: fontSizes.small,
    marginTop: spacing.small / 2,
  },
  moreButton: {
    padding: spacing.small,
  },
});

