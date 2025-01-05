'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Separator } from "@/components/ui/separator"
import { Play } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ReactPlayer from 'react-player';
import { MediaAttachments } from '@/schemas/Social/post';

interface PostMediaProps {
  mediaAttachments: MediaAttachments[];
}

export const PostMedia = ({ mediaAttachments }: PostMediaProps) => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const handlePlayClick = (index: number) => {
    setPlayingIndex(index);
  };

  const renderMedia = (media: MediaAttachments, index: number) => {
    const isPlaying = playingIndex === index;
    const isVideo = media.media_type === 'video';
    const mediaSource = media.file || media.url;

    if (!mediaSource) return null;

    if (isVideo) {
      return (
        <div className="relative aspect-video min-w-[300px] mx-2" key={index}>
          {(!isPlaying && (media.url || media.thumbnail)) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image 
                src={media.thumbnail || media.url || ''} 
                alt="Thumbnail" 
                layout="fill" 
                objectFit="cover" 
                className="rounded"
              />
              <button 
                onClick={() => handlePlayClick(index)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-30 transition-opacity"
              >
                <Play className="w-16 h-16 text-white" />
              </button>
            </div>
          )}
          {(isPlaying || !media.thumbnail) && (
            <ReactPlayer
              url={mediaSource}
              playing={isPlaying}
              controls
              width="100%"
              height="100%"
              className="rounded"
            />
          )}
        </div>
      );
    } else {
      // Render image
      return (
        <div className="relative aspect-video min-w-[300px] mx-2" key={index}>
          <Image 
            src={mediaSource} 
            alt="Post media" 
            layout="fill" 
            objectFit="cover" 
            className="rounded"
          />
        </div>
      );
    }
  };

  return (
    <>
      {mediaAttachments && mediaAttachments.length > 0 && (
        <div className="mb-4 px-3 overflow-x-auto flex space-x-4">
          {mediaAttachments.map((media, index) => (
            <React.Fragment key={index}>
              {renderMedia(media, index)}
              {index < mediaAttachments.length - 1 && (
                <Separator orientation="vertical" className="my-3" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  );
};

PostMedia.Skeleton = function ItemSkeleton() {
  return (
    <div className="w-full pt-4 dark:bg-[#1C1C1E] rounded-lg border dark:border-[#27272A] overflow-hidden">
      <Skeleton className="h-[280px] w-full dark:bg-[#202020]" />
    </div>
  )
}
