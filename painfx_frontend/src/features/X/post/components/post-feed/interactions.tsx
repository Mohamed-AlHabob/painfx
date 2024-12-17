"use client";
import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useGetUserLikeQuery, useLikePostMutation, useUnlikePostMutation } from '@/redux/services/booking/likeApiSlice';
import { extractErrorMessage } from '@/hooks/error-handling';
import { MessageCircle } from 'lucide-react';
import { useRetrieveUserQuery } from '@/redux/services/auth/authApiSlice';
import { cn } from '@/lib';
import { Like, Unlike } from '@/components/icons';


interface LikeButtonProps {
  postId: string;
  initialLikeCount: number;
  comments_count:number;
}

const Interactions: React.FC<LikeButtonProps> = ({ postId, initialLikeCount,comments_count }) => {
  const { data: user } = useRetrieveUserQuery();
  const userId = user?.id;

  const { data: userLike, isLoading: isFetchingLike } = useGetUserLikeQuery({ postId, userId: userId || "" }, { skip: !userId });

  const [isLiked, setIsLiked] = useState<boolean>(!!userLike);
  const [likeCount, setLikeCount] = useState<number>(initialLikeCount);
  const [likePost, { isLoading: isLiking }] = useLikePostMutation();
  const [unlikePost, { isLoading: isUnliking }] = useUnlikePostMutation();

  useEffect(() => {
    setIsLiked(!!userLike);
   
  }, [userLike]);

  const handleLike = useCallback(async () => {
    if (isLiked) return;

    if (!userId) {
      toast.error("You must be logged in to like a post.");
      return;
    }

    setIsLiked(true);
    setLikeCount((prev) => prev + 1);

    try {
      await likePost({ post: postId }).unwrap();
      toast.success('Post liked!');
    } catch (error : any) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
      toast.error(extractErrorMessage(error));
    }
  }, [isLiked, likePost, postId, userId]);
  const handleUnlike = useCallback(async () => {
    if (!isLiked || !userLike) return;

    setIsLiked(false);
    setLikeCount((prev) => prev - 1);

    try {
      await unlikePost({
        id: userLike.id,
        postId: postId
      }).unwrap();
      toast.success('Like removed!');
    } catch (error :any) {
      setIsLiked(true);
      setLikeCount((prev) => prev + 1);
      toast.error(extractErrorMessage(error));
    }
  }, [isLiked, postId, unlikePost, userLike]);

  return (
    <div
    className={cn(
      "flex items-center justify-between py-2 px-6",
    )}>
      <div className="flex gap-5 text-[#757272] text-sm">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={isLiked ? handleUnlike : handleLike}
        disabled={isLiking || isUnliking || isFetchingLike}
        aria-label={isLiked ? 'Unlike post' : 'Like post'}
        className={`flex items-center space-x-2 focus:outline-none ${
          isLiked ? 'text-red-500' : 'text-gray-500'
        }`}
      >
          <span className="flex gap-1 justify-center items-center">
        {isLiked ? (
          <motion.span
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 0.3 }}
          >
            <Unlike />
          </motion.span>
        ) : (
          <Like />
        )}
        </span>
        <span>{likeCount}</span>
      </motion.button>
         <motion.button
         whileTap={{ scale: 0.9 }}
         aria-label={isLiked ? 'Unlike post' : 'Like post'}
         className={`flex gap-5 text-[#757272] text-sm ${
           isLiked ? 'text-red-500' : 'text-gray-500'
         }`}>
          <MessageCircle size={16} />
          {comments_count}
        </motion.button>
    </div>
    </div>
  );
};

export default Interactions;
