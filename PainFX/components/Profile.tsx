import { View, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Tabs from '@/components/Tabs'; 
import { useState } from 'react';
import { Colors } from '@/constants/Colors';
import PostItem from '@/components/PostItem';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';

import React from 'react';

import { useLogoutMutation, useRetrieveUserQuery } from '@/redux/services/auth/authApiSlice';
import { UserProfile } from './UserProfile';
import { useGetPostsQuery } from '@/redux/services/booking/postApiSlice';
type ProfileProps = {
  userId?: string;
  showBackButton?: boolean;
};

export default function Profile({ userId, showBackButton = false }: ProfileProps) {
  const { top } = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Threads');
  const { data: user, isLoading,isFetching } = useRetrieveUserQuery();
  const { data: posts, error, } = useGetPostsQuery({ page: 1 });
  const router = useRouter();
  const [logout] = useLogoutMutation();




  const handleTabChange = (tab: any) => {
    setActiveTab(tab);
  };

  return (
    <View style={[styles.container, { paddingTop: top }]}>
      <FlatList
        data={posts?.results || []}
        renderItem={({ item }) => (
          <Link href={`/feed/${item._id}`} asChild>
            <TouchableOpacity>
              {posts?.results?.map((post) => (
              <PostItem post={post} key={post.id} />
              ))}
            </TouchableOpacity>
          </Link>
        )}
        ListEmptyComponent={
          <Text style={styles.tabContentText}>You haven't posted anything yet.</Text>
        }
        ItemSeparatorComponent={() => (
          <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: Colors.border }} />
        )}
        ListHeaderComponent={
          <>
            <View style={styles.header}>
              {showBackButton ? (
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                  <Ionicons name="chevron-back" size={24} color="#000" />
                  <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
              ) : (
                <MaterialCommunityIcons name="web" size={24} color="black" />
              )}
              <View style={styles.headerIcons}>
                <Ionicons name="logo-instagram" size={24} color="black" />
                <TouchableOpacity onPress={() => logout()}>
                  <Ionicons name="log-out-outline" size={24} color="black" />
                </TouchableOpacity>
              </View>
            </View>
            {userId ? <UserProfile userId={userId} /> : <UserProfile userId={user?.id} />}

            <Tabs onTabChange={handleTabChange} />
          </>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  tabContentText: {
    fontSize: 16,
    marginVertical: 16,
    color: Colors.border,
    alignSelf: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    fontSize: 16,
  },
});
