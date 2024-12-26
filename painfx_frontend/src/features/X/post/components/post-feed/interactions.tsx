'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useGetUserLikeQuery, useLikePostMutation, useUnlikePostMutation } from '@/redux/services/booking/likeApiSlice'
import { extractErrorMessage } from '@/hooks/error-handling'
import { MessageCircle, Share2 } from 'lucide-react'
import { useRetrieveUserQuery } from '@/redux/services/auth/authApiSlice'
import { cn } from '@/lib'
import { Like, Unlike } from '@/components/icons'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

// Improved type definition for better type safety
interface InteractionButtonProps {
  icon: React.ReactNode
  count: number
  onClick?: () => void
  isActive?: boolean
  isLoading?: boolean
  label: string
  activeColor?: string
}

// Memoized InteractionButton component for better performance
const InteractionButton = React.memo<InteractionButtonProps>(({
  icon,
  count,
  onClick,
  isActive,
  isLoading,
  label,
  activeColor = "text-primary"
}) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={onClick}
    disabled={isLoading}
    aria-label={label}
    className={cn(
      "flex items-center space-x-2 text-sm",
      isActive ? activeColor : "text-muted-foreground",
      isLoading && "opacity-50 cursor-not-allowed"
    )}
  >
    <motion.span 
      whileTap={{ scale: 0.9 }} 
      aria-hidden="true"
    >
      {icon}
    </motion.span>
    <span>{count}</span>
  </Button>
))

InteractionButton.displayName = 'InteractionButton'

interface InteractionsProps {
  postId: string
  initialLikeCount: number
  commentsCount: number
}

export const Interactions: React.FC<InteractionsProps> & { Skeleton: React.FC } = ({ 
  postId, 
  initialLikeCount,
  commentsCount 
}) => {
  const { data: user } = useRetrieveUserQuery()
  const userId = user?.id

  const { data: userLike, isLoading: isFetchingLike } = useGetUserLikeQuery(
    { postId, userId: userId || "" }, 
    { skip: !userId }
  )

  const [likePost, { isLoading: isLiking }] = useLikePostMutation()
  const [unlikePost, { isLoading: isUnliking }] = useUnlikePostMutation()

  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [likeCount, setLikeCount] = useState<number>(initialLikeCount)

  useEffect(() => {
    if (userLike) {
      setIsLiked(true)
    }
  }, [userLike])

  const handleLikeToggle = useCallback(async () => {
    if (!userId) {
      toast.error("You must be logged in to like a post.")
      return
    }

    const newIsLiked = !isLiked
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1

    setIsLiked(newIsLiked)
    setLikeCount(newLikeCount)

    try {
      if (newIsLiked) {
        await likePost({ post: postId }).unwrap()
        toast.success('Post liked!')
      } else if (userLike) {
        await unlikePost({
          id: userLike.id,
          postId: postId
        }).unwrap()
        toast.success('Like removed!')
      }
    } catch (error: any) {
      // Revert state on error
      setIsLiked(!newIsLiked)
      setLikeCount(newIsLiked ? newLikeCount - 1 : newLikeCount + 1)
      toast.error(extractErrorMessage(error))
    }
  }, [isLiked, likePost, unlikePost, postId, userId, userLike, likeCount])

  const handleShare = useCallback(() => {
    const shareUrl = `${window.location.origin}/X/post/${postId}`
    if (navigator.share) {
      navigator.share({
        title: 'Check out this post!',
        url: shareUrl,
      }).then(() => {
        toast.success('Post shared successfully!')
      }).catch((error: any) => {
        console.error('Error sharing:', error)
        toast.error('Failed to share the post.')
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
        .then(() => toast.success('Link copied to clipboard!'))
        .catch(() => toast.error('Failed to copy link.'))
    }
  }, [postId])

  return (
    <div className="flex items-center justify-between py-2 px-6">
      <div className="flex gap-5">
        <InteractionButton
          icon={isLiked ? <Unlike /> : <Like />}
          count={likeCount}
          onClick={handleLikeToggle}
          isActive={isLiked}
          isLoading={isLiking || isUnliking || isFetchingLike}
          label={isLiked ? 'Unlike post' : 'Like post'}
          activeColor="text-red-500"
        />
        <InteractionButton
          icon={<MessageCircle size={16} />}
          count={commentsCount}
          label="Comment on post"
        />
        <InteractionButton
          icon={<Share2 size={16} />}
          count={0}
          onClick={handleShare}
          label="Share post"
        />
      </div>
    </div>
  )
}

Interactions.Skeleton = function InteractionsSkeleton() {
  return (
    <div className="flex items-center justify-between py-2 px-6">
      <div className="flex gap-5">
        {[0, 1, 2].map((index) => (
          <div key={index} className="flex items-center space-x-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-8 h-4" />
          </div>
        ))}
      </div>
    </div>
  )
}

