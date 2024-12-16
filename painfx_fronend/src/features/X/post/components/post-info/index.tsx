"use client"

import { NoResult } from "@/components/global/no-results"
import UserCard from "@/components/global/user-widget/user-card"
import Interactions from "../post-feed/interactions"
import Image from "next/image"
import { useGetPostQuery } from "@/redux/services/booking/postApiSlice"
import { useState } from "react"
import { Play } from "lucide-react"
import { Separator } from "@/components/ui/separator"

type PostInfoProps = {
  id: string
}

export const PostInfo = ({ id }: PostInfoProps) => {
  const { data:post,error } = useGetPostQuery(id)
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  if (!post || error) {
    return <NoResult message={'No results found'} backTo={'/post'} linkName={"back"}/>;
  }

  return (
    <div className="flex flex-col gap-y-5">
        <UserCard 
          name={`${post.doctor?.user.first_name} ${post.doctor?.user.last_name}`} 
          avatar={post.doctor?.user.profile?.avatar || ""} 
          id={post.doctor?.user?.id || ""} 
          role={post.doctor?.specialization?.name || ""} 
        />
      <div className="flex flex-col gap-y-3">
        <h2 className="text-2xl font-bold">{post.title}</h2>
        {post.content}
      </div>

      {post.video_file === null && post.video_url && (
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
                src={post.video_file || ""} 
                className="w-full h-full rounded" 
                autoPlay={isPlaying}
              />
            )}
          </div>
          <Separator orientation="horizontal" className="mt-3" />
        </div>
      )}

      <Interactions 
        postId={post.id || ""} 
        initialLikeCount={post.likes_count || 0} 
        comments_count={post.comments_count || 0} 
      />
    </div>
  )
}
