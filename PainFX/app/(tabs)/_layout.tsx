import { Tabs } from 'expo-router';
import { Home, Search, PenSquare, Heart, User } from 'lucide-react-native';
import { useAppContext } from '@/hooks/useAppContext';

export default function TabsLayout() {
  const { isDarkMode } = useAppContext();
  
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: isDarkMode ? '#000' : '#fff',
          borderTopColor: isDarkMode ? '#333' : '#e5e7eb',
        },
        tabBarActiveTintColor: isDarkMode ? '#fff' : '#000',
        tabBarInactiveTintColor: isDarkMode ? '#666' : '#999',
        headerStyle: {
          backgroundColor: isDarkMode ? '#000' : '#fff',
        },
        headerTintColor: isDarkMode ? '#fff' : '#000',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <Search size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <PenSquare size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="activity"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

