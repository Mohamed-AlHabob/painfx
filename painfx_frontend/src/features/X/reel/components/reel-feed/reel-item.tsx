'use client'

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Play } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { Post } from '@/schemas/Social/post';
import Interactions from '@/features/X/post/components/post-feed/interactions';


interface ReelItemProps {
  reel: Post;
}

const ReelItem: React.FC<ReelItemProps> = ({ reel }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.5 });

  useEffect(() => {
    if (isInView && videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.error("Video playback failed:", error);
        setIsPlaying(false);
      });
      setIsPlaying(true);
    } else if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isInView]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((error) => {
          console.error("Video playback failed:", error);
          setIsPlaying(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >

    {(reel.video_file !== null || reel.video_url) ? (
      <Card className="w-full max-w-lg h-[calc(100vh-100px)] overflow-hidden relative">
        <CardContent className="p-0 h-full">
          <div className="relative h-full">
                {!isPlaying && reel?.thumbnail_url && (
                  <Image
                    src={reel?.thumbnail_url}
                    alt="Reel thumbnail"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                )}
                <video
                  ref={videoRef}
                  src={reel?.video_file || reel?.video_url || ""}
                  className="w-full h-full object-cover"
                  loop
                  playsInline
                  onError={() => setIsPlaying(false)}
                />
                {!isPlaying && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute inset-0 w-full h-full bg-black/30 flex items-center justify-center"
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause Video" : "Play Video"}
                  >
                    <Play className="w-16 h-16 " />
                  </Button>
                )}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent"
            >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={reel.doctor?.user?.profile?.avatar || ""} alt={reel.doctor?.user.first_name || ""} />
                  <AvatarFallback>{reel.doctor?.user?.first_name?.charAt(0) || "S"}</AvatarFallback>
                </Avatar>
                <span className="font-semibold">
                  {`${reel.doctor?.user.first_name || ""} ${reel.doctor?.user.last_name || ""}`}
                </span>
              </div>
              <div className="flex space-x-2">
                <Interactions postId={reel.id || ""} initialLikeCount={reel.likes_count || 0} comments_count={reel.comments_count || 0} />
              </div>
            </div>
            <p className="mt-2">{reel.title}</p>
          </motion.div>
        </CardContent>
      </Card>
      ) : null}
    </motion.div>
  );
};

export default ReelItem;
