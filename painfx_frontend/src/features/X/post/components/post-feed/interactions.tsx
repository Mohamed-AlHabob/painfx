'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { useGetLikesQuery, useCreateLikeMutation, useDeleteLikeMutation } from '@/redux/services/booking/likeApiSlice'
import { extractErrorMessage } from '@/hooks/error-handling'
import { MessageCircle, Share2 } from 'lucide-react'
import { useRetrieveUserQuery } from '@/redux/services/auth/authApiSlice'
import { cn } from '@/lib'
import { Like as LikeIcon, Unlike } from '@/components/icons'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Like } from "@/schemas/Social"

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
  post: string // ID of the post being interacted with
  initialLikeCount: number
  commentsCount: number
}

export const Interactions: React.FC<InteractionsProps> & { Skeleton: React.FC } = ({ 
  post, 
  initialLikeCount,
  commentsCount 
}) => {
  const { data: user } = useRetrieveUserQuery()
  const userId = user?.id

  // Fetch likes for the specific post
  const { data: likes, isLoading: isFetchingLikes } = useGetLikesQuery(
    { post },
    {
      skip: !userId,
      selectFromResult: (result) => ({
        ...result,
        data: result.data as Like[], // Explicitly type the response as an array of Like objects
      }),
    }
  )

  const [createLike, { isLoading: isLiking }] = useCreateLikeMutation()
  const [deleteLike, { isLoading: isUnliking }] = useDeleteLikeMutation()

  const [isLiked, setIsLiked] = useState<boolean>(false)
  const [likeCount, setLikeCount] = useState<number>(initialLikeCount)

  // Update the like state when the likes data changes
  useEffect(() => {
    if (likes && userId) {
      const userLike = likes.find((like) => like.user?.id === userId)
      setIsLiked(!!userLike)
    }
  }, [likes, userId])

  const handleLikeToggle = useCallback(async () => {
    if (!userId) {
      toast.error("You must be logged in to like this.")
      return
    }

    const newIsLiked = !isLiked
    const newLikeCount = newIsLiked ? likeCount + 1 : likeCount - 1

    // Optimistic update
    setIsLiked(newIsLiked)
    setLikeCount(newLikeCount)

    try {
      if (newIsLiked) {
        await createLike({ post }).unwrap()
        toast.success('Liked!')
      } else {
        const userLike = likes?.find((like) => like.user?.id === userId)
        if (userLike) {
          await deleteLike(userLike.id).unwrap()
          toast.success('Like removed!')
        }
      }
    } catch (error: any) {
      // Revert state on error
      setIsLiked(!newIsLiked)
      setLikeCount(newIsLiked ? newLikeCount - 1 : newLikeCount + 1)
      toast.error(extractErrorMessage(error))
    }
  }, [isLiked, createLike, deleteLike, post, userId, likes, likeCount])

  const handleShare = useCallback(() => {
    const shareUrl = `${window.location.origin}/posts/${post}`
    if (navigator.share) {
      navigator.share({
        title: 'Check out this post!',
        url: shareUrl,
      }).then(() => {
        toast.success('Shared successfully!')
      }).catch((error: any) => {
        console.error('Error sharing:', error)
        toast.error('Failed to share.')
      })
    } else {
      navigator.clipboard.writeText(shareUrl)
        .then(() => toast.success('Link copied to clipboard!'))
        .catch(() => toast.error('Failed to copy link.'))
    }
  }, [post])

  return (
    <div className="flex items-center justify-between py-2 px-6">
      <div className="flex gap-5">
        <InteractionButton
          icon={isLiked ? <Unlike /> : <LikeIcon />}
          count={likeCount}
          onClick={handleLikeToggle}
          isActive={isLiked}
          isLoading={isLiking || isUnliking || isFetchingLikes}
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