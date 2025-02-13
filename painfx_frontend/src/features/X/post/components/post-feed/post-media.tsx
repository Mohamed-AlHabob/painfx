'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ReactPlayer from 'react-player';
import { MediaAttachments } from '@/schemas/Social/media-attachments';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

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

    // Handle missing or invalid media source
    if (!mediaSource) {
      return (
        <div className="relative min-w-[320px] w-[320px] h-[280px] rounded-lg overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">Media not available</p>
        </div>
      );
    }

    if (isVideo) {
      return (
        <div className="relative min-w-[320px] w-[320px] h-[280px] rounded-lg overflow-hidden flex items-center justify-center">
          {!isPlaying && media.thumbnail && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Image 
                src={media.thumbnail} 
                alt="Video thumbnail" 
                fill
                className="rounded object-cover"
                priority={index === 0} // Prioritize loading the first thumbnail
              />
              <button 
                onClick={() => handlePlayClick(index)}
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-30 transition-opacity"
                aria-label="Play video"
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
              className="absolute top-0 left-0 w-full h-full"
              config={{
                file: {
                  attributes: {
                    controlsList: 'nodownload', // Disable download option
                  },
                },
              }}
            />
          )}
        </div>
      );
    } else {
      return (
        <div className="relative min-w-[320px] w-[320px] h-[280px] rounded-lg overflow-hidden flex items-center justify-center">
          <Image 
            src={mediaSource} 
            alt="Post media" 
            fill
            className="rounded object-cover object-center"
            priority={index === 0} // Prioritize loading the first image
          />
        </div>
      );
    }
  };

  return (
    <>
      {mediaAttachments?.length > 0 && (
        <ScrollArea className="w-full overflow-hidden">
          <div className="flex space-x-3 px-3 py-2">
            {mediaAttachments.map((media, index) => (
              <React.Fragment key={index}>
                {renderMedia(media, index)}
              </React.Fragment>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
    </>
  );
};

PostMedia.Skeleton = function ItemSkeleton() {
  return (
    <div className="w-full pt-4 dark:bg-[#1C1C1E] rounded-lg border dark:border-[#27272A] overflow-hidden">
      <Skeleton className="h-[280px] w-full dark:bg-[#202020]" />
    </div>
  );
};