import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, MessageSquare, Bell } from 'lucide-react-native';
import { colors, spacing, borderRadius } from '../config/theme';

export const Header: React.FC = () => {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push('/')}>
        <Image
          source={{ uri: '/linkedin-logo.png' }}
          style={styles.logo}
        />
      </TouchableOpacity>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.iconButton}>
          <Search size={24} color={colors.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <MessageSquare size={24} color={colors.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Bell size={24} color={colors.text.secondary} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
        >
          <Image
            source={{ uri: '/placeholder.svg?height=32&width=32' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.small,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: spacing.small,
    marginLeft: spacing.small,
  },
  profileButton: {
    marginLeft: spacing.small,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.round,
  },
});
