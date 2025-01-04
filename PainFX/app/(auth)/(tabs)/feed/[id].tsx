import {
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  View,
  Text,
} from 'react-native';
import { Link, useLocalSearchParams } from 'expo-router';
import Comments from '@/components/Comments';

import { Colors } from '@/constants/Colors';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useGetPostQuery } from '@/redux/services/booking/postApiSlice';
import PostItem from '@/components/PostItem';
import { useRetrieveUserQuery } from '@/redux/services/auth/authApiSlice';

const Page = () => {
  const { id } = useLocalSearchParams();
  const { data:post,error,isLoading,isFetching } = useGetPostQuery(id as string);
  const { data: user } = useRetrieveUserQuery();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={{ flexGrow: 1, marginBottom: 0 }}>
      <ScrollView>
        {post ? (
          <PostItem post={post} />
        ) : (
          <ActivityIndicator />
        )}
        <Comments threadId={id as string } />
      </ScrollView>
      <View style={styles.border} />
      <Link href={`/(modal)/reply/${id}`} asChild>
        <TouchableOpacity style={styles.replyButton}>
          <Image
            source={{ uri: user?.profile?.avatar as string }}
            style={styles.replyButtonImage}
          />
          <Text>Reply to {post?.doctor?.user.first_name}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};
export default Page;
const styles = StyleSheet.create({
  border: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.border,
    marginVertical: 2,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    margin: 6,
    backgroundColor: Colors.itemBackground,
    borderRadius: 100,
    gap: 10,
  },
  replyButtonImage: {
    width: 25,
    height: 25,
    borderRadius: 15,
  },
});
