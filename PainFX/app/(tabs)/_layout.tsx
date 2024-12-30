import { Tabs } from 'expo-router';
import { useSelector } from 'react-redux';
import { Home, Video, Users, Bell, Briefcase, User } from 'lucide-react-native';
import { colors } from '../../config/theme';
import { RootState } from '@/redux/store';


export default function TabsLayout() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // if (!isAuthenticated) {
  //   return null; // This will redirect to the auth flow
  // }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reels"
        options={{
          title: 'Reels',
          tabBarIcon: ({ color }) => <Video size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="network"
        options={{
          title: 'My Network',
          tabBarIcon: ({ color }) => <Users size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => <Bell size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          title: 'Jobs',
          tabBarIcon: ({ color }) => <Briefcase size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

