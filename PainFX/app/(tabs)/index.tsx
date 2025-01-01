import { ScrollView, RefreshControl } from 'react-native';
import { useState } from 'react';
import { Container } from '@/components/ui/container';
import { Post } from '@/components/post';
import { useAppContext } from '@/hooks/useAppContext';


export default function Home() {
  const { isDarkMode } = useAppContext();
  const [refreshing, setRefreshing] = useState(false);
  
  const posts = [
    {
      id: '1',
      author: {
        name: 'droos.english',
        username: 'droos.english',
        avatar: '/placeholder.svg?height=40&width=40',
        verified: true
      },
      content: {
        text: 'A Trip to the Beach',
        description: 'Last weekend, I went to the beach with my family. The weather was sunny and warm. We played in the sand and built a big sandcastle. My brother swam in the sea, but I just walked near the water. We ate sandwiches and drank orange juice. I collected some small shells and put them in my bag. In the evening, we watched the sunset. It was very beautiful. I had a great time at the beach.',
      },
      stats: {
        likes: 156,
        replies: 50,
        reposts: 40
      },
      timeAgo: '14h'
    },
    // Add more posts as needed
  ];

  return (
    <ScrollView
      className={isDarkMode ? 'bg-black' : 'bg-white'}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            // Add refresh logic
            setTimeout(() => setRefreshing(false), 1000);
          }}
        />
      }
    >
      <Container>
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </Container>
    </ScrollView>
  );
}

