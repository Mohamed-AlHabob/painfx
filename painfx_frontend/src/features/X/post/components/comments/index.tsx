"use client"

// import { useGetCommentsQuery } from "@/redux/services/booking/CommentApiSlice"

type PostCommentsProps = {
  postid: string
}

export const PostComments = ({  }: PostCommentsProps) => {
  // const { data } = useGetCommentsQuery()
  // const { onReply, onSetReply, onSetActiveComment, activeComment } = useReply()

  return (
    <div className="mt-5">
      {/* {data?.post ? (
        data.map((comment) => (
          <UserComment
            id={comment.id}
            key={comment.id}
            // onReply={() => onSetReply(comment.id)}
            // reply={onReply}
            username={`${comment.user.firstname} ${comment.user.lastname}`}
            image={comment.user.image || ""}
            content={comment.content}
            postid={postid}
            replyCount={comment._count.reply}
            commentid={comment.commentId}
            replied={comment.replied}
            // activeComment={activeComment}
            // onActiveComment={() => onSetActiveComment(comment.id)}
          />
        ))
      ) : (
        <p className="text-themeTextGray">No Comments</p>
      )} */}
    </div>
  )
}
