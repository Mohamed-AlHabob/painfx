'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { Separator } from "@/components/ui/separator";
import { Play } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import ReactPlayer from 'react-player';
import { MediaAttachments } from '@/schemas';

interface ReelVideoProps {
  video: MediaAttachments[];
}

export const ReelVideo = ({ video }: ReelVideoProps) => {
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [errorIndex, setErrorIndex] = useState<number | null>(null);

  const handlePlayClick = (index: number) => {
    setPlayingIndex(index);
    setErrorIndex(null); // Reset error state when trying to play again
  };

  const handleError = (index: number) => {
    setErrorIndex(index);
  };

  const renderMedia = (media: MediaAttachments, index: number) => {
    const isPlaying = playingIndex === index;
    const isVideo = media.media_type === 'video';
    const mediaSource = media.file || media.url;

    if (!mediaSource) return null;

    if (isVideo) {
      return (
        <div className="relative aspect-video" key={index}>
          {(!isPlaying && (media.url || media.thumbnail)) && (
            <div className="relative h-full">
              <Image
                src={media.thumbnail || ""}
                alt="Reel thumbnail"
                fill
                style={{ objectFit: 'cover' }}
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
              className="rounded"
              onError={() => handleError(index)}
            />
          )}
          {errorIndex === index && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <p className="text-white">Failed to load video.</p>
            </div>
          )}
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <>
      {video && video.length > 0 && (
        <div className="mb-4 px-3">
          {video.map((media, index) => (
            <React.Fragment key={index}>
              {renderMedia(media, index)}
              {index < video.length - 1 && (
                <Separator orientation="horizontal" className="my-3" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </>
  );
};

ReelVideo.Skeleton = function ItemSkeleton() {
  return (
    <div className="w-full pt-4 dark:bg-[#1C1C1E] rounded-lg border dark:border-[#27272A] overflow-hidden">
      <Skeleton className="h-[280px] w-full dark:bg-[#202020]" />
    </div>
  );
};