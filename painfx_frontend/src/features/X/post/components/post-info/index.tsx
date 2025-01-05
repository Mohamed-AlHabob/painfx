"use client"

import { NoResult } from "@/components/global/no-results"
import UserCard from "@/components/global/user-widget/user-card"
import {Interactions} from "../post-feed/interactions"
import { useGetPostQuery } from "@/redux/services/booking/postApiSlice"
import { useState } from "react"
import { Edit, Trash } from 'lucide-react';
import { ActionTooltip } from '@/components/global/action-tooltip';
import { ModalType, useModal } from '@/hooks/use-modal-store';
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useRetrieveUserQuery } from '@/redux/services/auth/authApiSlice';
import { PostMedia } from "../post-feed/post-media"
type PostInfoProps = {
  id: string
}

export const PostInfo = ({ id }: PostInfoProps) => {
  const { data:post,error,isLoading,isFetching } = useGetPostQuery(id)
  const { data: user } = useRetrieveUserQuery();
  const { onOpen } = useModal();

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { Post: post });
  };

  if (isFetching || isLoading) {
    <PostInfo.Skeleton />
  }
  if (error) {
    return <NoResult message={'No results found'} backTo={'/post'} linkName={"back"}/>;
  }

  return (
    <div className="flex flex-col gap-y-5">
        <UserCard 
          name={`${post?.doctor?.user?.first_name || ""} ${post?.doctor?.user.last_name || ""}`} 
          avatar={post?.doctor?.user.profile?.avatar || ""} 
          id={post?.doctor?.user?.id || ""} 
          role={post?.doctor?.specialization?.name || ""} 
          email={post?.doctor?.user.email}
          phone_number={post?.doctor?.user?.profile?.phone_number || ""}
          address={post?.doctor?.user?.profile?.address || ""}
          joined={post?.doctor?.user?.date_joined || ""}
        />
          {post?.doctor?.user?.id == user?.id && (
            <div className='flex items-center gap-x-2'>
              <ActionTooltip label="Edit">
                <Edit
                  onClick={(e) => onAction(e, "editPost")}
                  className="w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                />
              </ActionTooltip>
              <ActionTooltip label="Delete">
                <Trash
                  onClick={(e) => onAction(e, "deletePost")}
                  className="w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                />
              </ActionTooltip>
            </div>
          )}
      <div className="flex flex-col gap-y-3">
        <h2 className="text-2xl font-bold">{post?.title}</h2>
        {post?.content}
      </div>
      <PostMedia mediaAttachments={Array.isArray(post?.media_attachments) ? post.media_attachments : []} />
      <Interactions 
        postId={post?.id || ""} 
        initialLikeCount={post?.likes_count || 0} 
        commentsCount={post?.comments_count || 0} 
      />
    </div>
  )
}


PostInfo.Skeleton = function PostInfoSkeleton({ level }: { level?: number }) {
  return (
    <div
      style={{
        paddingLeft: level ? `${(level * 12) + 25}px` : "12px"
      }}
      className="flex gap-x-2 py-[3px]"
    >
<div className="flex flex-col gap-y-5">
      <div className="flex items-center gap-x-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex flex-col">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex flex-col gap-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="mb-4 px-3">
        <div className="relative aspect-video bg-gray-200 rounded">
          <Skeleton className="absolute inset-0" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
        </div>
        <Separator orientation="horizontal" className="mt-3" />
      </div>
      <div className="flex items-center gap-x-4">
        <Skeleton className="h-6 w-6 rounded-full" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
    </div>
  )
}
