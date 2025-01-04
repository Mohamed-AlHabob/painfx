// import ThreadComposer from '@/components/ThreadComposer';
import { ActivityIndicator, View,Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
// import Thread from '@/components/Thread';


const Page = () => {
  const { id } = useLocalSearchParams();

  return (
    <View>
      {/* {thread ? (
        <Thread thread={thread as Doc<'messages'> & { creator: Doc<'users'> }} />
        <Text>Reply</Text>
      ) : (
        <ActivityIndicator />
      )} */}

      {/* <ThreadComposer isReply={true} threadId={id as Id<'messages'>} /> */}
      <Text>Reply</Text>
    </View>
  );
};
export default Page;
