'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Interactions } from './interactions';
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import UserCard from '@/components/global/user-widget/user-card';
import { usePathname } from 'next/navigation';
import { Post } from '@/schemas/Social/post';
import { Edit, Play, Trash } from 'lucide-react';
import { ActionTooltip } from '@/components/global/action-tooltip';
import { ModalType, useModal } from '@/hooks/use-modal-store';
import { useRetrieveUserQuery } from '@/redux/services/auth/authApiSlice';
import { Skeleton } from '@/components/ui/skeleton';

interface PostItemProps {
  post: Post;
}

export const PostItem = ({ post }: PostItemProps) => {
  const pathname = usePathname()
  const { onOpen } = useModal();
  const [isPlaying, setIsPlaying] = useState(false);
  const { data: user } = useRetrieveUserQuery();

  const handlePlayClick = () => {
    setIsPlaying(true);
  };
  
  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, { Post: post });
  }

  const isYouTubeUrl = (url: string): boolean => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  const getYouTubeEmbedUrl = (url: string): string => {
    const videoId = url.split('v=')[1] || url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  }

  const renderVideo = () => {
    if (!post.video_file && !post.video_url) return null;

    const videoSource = post.video_file || post.video_url;
    if (!videoSource) return null;

    if (isYouTubeUrl(videoSource)) {
      return (
        <iframe
          src={getYouTubeEmbedUrl(videoSource)}
          className="w-full h-full rounded"
          allowFullScreen
        />
      );
    }

    return (
      <video 
        controls 
        src={videoSource} 
        className="w-full h-full rounded" 
        autoPlay={isPlaying}
      />
    );
  }

  return (
    <Card className="dark:border-themeGray group dark:bg-[#1A1A1D] first-letter:rounded-2xl overflow-hidden mb-5">
      <CardContent className="p-3 flex flex-col gap-y-6 items-start">
        <div className="flex items-center gap-x-2 justify-between w-full">
          <UserCard 
            name={`${post.doctor?.user.first_name} ${post.doctor?.user.last_name}`} 
            avatar={post.doctor?.user.profile?.avatar || ""} 
            id={post.doctor?.user?.id || ""} 
            role={post.doctor?.specialization?.name || ""}
            email={post.doctor?.user.email}
            phone_number={post.doctor?.user?.profile?.phone_number || ""}
            address={post.doctor?.user?.profile?.address || ""}
            joined={post.doctor?.user?.date_joined || ""}
          />
          {post.doctor?.user?.id == user?.id && (
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
            {post.content}
          </div>
        </Link>
      </CardContent>
      <Separator orientation="horizontal" className="mt-3" />

      {(post.video_file !== null || post.video_url) && (
        <div className="mb-4 px-3">
          <div className="relative aspect-video">
            {!isPlaying && post.thumbnail_url && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Image 
                  src={post.thumbnail_url} 
                  alt="Thumbnail" 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded"
                />
                <button 
                  onClick={handlePlayClick}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-30 transition-opacity"
                >
                  <Play className="w-16 h-16 text-white" />
                </button>
              </div>
            )}
            {(isPlaying || !post.thumbnail_url) && renderVideo()}
          </div>
          <Separator orientation="horizontal" className="mt-3" />
        </div>
      )}
      <Interactions 
        postId={post.id || ""} 
        initialLikeCount={post.likes_count || 0} 
        commentsCount={post.comments_count || 0} 
      />
    </Card>
  );
};

PostItem.Skeleton = function ItemSkeleton({ level }: { level?: number }) {
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

