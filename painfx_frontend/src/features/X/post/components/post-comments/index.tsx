"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

export const PostCommentForm = () => {
  return (
    <div className="flex flex-col gap-y-5">
      <form
        // onSubmit={onCreateComment}
        className="flex items-center border-2 bg-transparent py-2 px-3 mt-5 border-themeGray rounded-xl overflow-hidden"
      >
        <Input
          // {...register("comment")}
          className="flex-1 bg-transparent border-none outline-none"
          placeholder="Add a comment..."
        />
        <Button variant="ghost" className="p-0 hover:bg-transparent">
          <Send className="text-themeGray" />
        </Button>
      </form>
      {/* {isPending && variables && (
        <UserComment
          postid={postid}
          id={variables.commentid}
          optimistic
          username={username}
          image={image}
          content={variables.content}
        />
      )} */}
    </div>
  )
}
