import { View } from 'react-native';
import PostItem from '@/components/PostItem';
import { useGetCommentsQuery } from '@/redux/services/booking/CommentApiSlice';


interface CommentsProps {
  threadId: string;
}

const Comments = ({ threadId }: CommentsProps) => {
const {data:comments} = useGetCommentsQuery(threadId);

  return (
    <View>
      {comments?.map((comment) => (
        <PostItem key={comment.user?.id} post={comment} />
      ))}
    </View>
  );
};
export default Comments;
