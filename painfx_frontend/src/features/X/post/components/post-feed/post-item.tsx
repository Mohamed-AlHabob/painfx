'use client'

import React from 'react';
import { Interactions } from './interactions';
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import UserCard from '@/components/global/user-widget/user-card';
import { Post } from '@/schemas';
import { Edit, Trash } from 'lucide-react';
import { ActionTooltip } from '@/components/global/action-tooltip';
import { ModalType, useModal } from '@/hooks/use-modal-store';
import { useRetrieveUserQuery } from '@/redux/services/auth/authApiSlice';
import { Skeleton } from '@/components/ui/skeleton';
import { PostMedia } from './post-media';
import { Tag } from '@/schemas'; // Import the Tag schema

interface PostItemProps {
  post: Post;
}

export const PostItem = ({ post }: PostItemProps) => {
  const { onOpen } = useModal();
  const { data: user } = useRetrieveUserQuery();

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { Post: post });
  };

  return (
    <Card className="dark:border-themeGray group dark:bg-[#1A1A1D] first-letter:rounded-2xl overflow-hidden mb-5">
      <CardContent className="p-3 flex flex-col gap-y-6 items-start">
        <div className="flex items-center gap-x-2 justify-between w-full">
          <UserCard 
            name={`${post.doctor?.user?.first_name || ""} ${post.doctor?.user?.last_name || ""}`} 
            avatar={post.doctor?.user?.profile?.avatar || ""} 
            id={post.doctor?.user?.id || ""} 
            role={post.doctor?.specialization?.name || ""}
            email={post.doctor?.user?.email || ""}
            phone_number={post.doctor?.user?.profile?.phone_number || ""}
            address={post.doctor?.user?.profile?.address || ""}
            joined={post.doctor?.user?.created_at || ""}
          />
          {post.doctor?.user?.id === user?.id && (
            <div className='flex items-center gap-x-2'>
              <ActionTooltip label="Edit">
                <Edit
                  onClick={(e) => onAction(e, "editPost")}
                  className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                />
              </ActionTooltip>
              <ActionTooltip label="Delete">
                <Trash
                  onClick={(e) => onAction(e, "deletePost")}
                  className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition"
                />
              </ActionTooltip>
            </div>
          )}
        </div>
        <Link href={`/X/post/${post.id}`} className="w-full">
          <div className="flex flex-col gap-y-3">
            <h2 className="text-2xl">{post.title}</h2>
            <p>{post.content}</p>
            {/* Display Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: Tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      </CardContent>
      <Separator orientation="horizontal" className="mt-3" />
      <PostMedia mediaAttachments={Array.isArray(post?.media_attachments) ? post.media_attachments : []} />
      <Interactions 
        post={post.id || ""} 
        initialLikeCount={post.likes_count || 0} 
        commentsCount={post.comments_count || 0} 
      />
    </Card>
  );
};

PostItem.Skeleton = function ItemSkeleton() {
  return (
    <div className="w-full pt-4 dark:bg-[#1C1C1E] rounded-lg border dark:border-[#27272A] overflow-hidden">
      <div className="flex items-center mb-3 px-4">
        <Skeleton className="w-12 h-12 mr-4 rounded-full dark:bg-[#202020]" />
        <div>
          <Skeleton className="h-5 w-24 rounded-md dark:bg-[#202020] mb-1" />
          <Skeleton className="h-4 w-40 rounded-md dark:bg-[#202020]" />
        </div>
      </div>
      <Skeleton className="h-[280px] w-full dark:bg-[#202020]" />
      <div className="flex items-center gap-3 border-t dark:border-[#27272A] px-6 py-2">
        <Interactions.Skeleton />
      </div>
    </div>
  )
}