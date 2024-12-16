import { PostComments } from "@/features/X/post/components/comments"
import { PostCommentForm } from "@/features/X/post/components/post-comments"
import { PostInfo } from "@/features/X/post/components/post-info"

const PostPage = async ({ params }: {   params: Promise<{ postid: string }>}) => {

  const postid = (await params).postid
return (
        <div className="grid grid-cols-4 px-5 py-5 gap-x-10">
        <div className="col-span-4 lg:col-span-3">
          <PostInfo id={postid} />
          <PostCommentForm
          />
          <PostComments postid={postid} />
        </div>
      </div>
    )
}
export default PostPage