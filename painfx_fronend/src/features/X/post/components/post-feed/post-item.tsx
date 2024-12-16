'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Interactions from './interactions';
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

interface PostItemProps {
  post: Post;
}

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const pathname = usePathname()
  const { onOpen } = useModal();
  const [isPlaying, setIsPlaying] = useState(false);
  const { data: user } = useRetrieveUserQuery();

  const handlePlayClick = () => {
    setIsPlaying(true);
  };
  
  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation();
    onOpen(action, {Post : post });
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
        <Link href={`${pathname}/${post.id}`} className="w-full">
          <div className="flex flex-col gap-y-3">
            <h2 className="text-2xl">{post.title}</h2>
            {post.content}
          </div>
        </Link>
      </CardContent>
      <Separator orientation="horizontal" className="mt-3" />
      {/* {post.tags && post.tags.length > 0 && (
        <div className="mb-4 px-3">
          {post.tags.map((tag) => (
            <span key={tag.id} className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full mr-2 text-sm">
              {tag.name}
            </span>
          ))}
        </div>
      )} */}

      {/* Display video if exists */}
{/* Display video if exists */}
{(post.video_file !== null || post.video_url) ? (
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
      {(isPlaying || !post.thumbnail_url) && (
        <video 
          controls 
          src={post.video_file || post.video_url || ""} 
          className="w-full h-full rounded" 
          autoPlay={isPlaying}
        />
      )}
    </div>
    <Separator orientation="horizontal" className="mt-3" />
  </div>
) : null}

      <Interactions 
        postId={post.id || ""} 
        initialLikeCount={post.likes_count || 0} 
        comments_count={post.comments_count || 0} 
      />
    </Card>
  );
};

export default PostItem;

