"use client"

import type React from "react"
import { Heart, MessageCircle, Share } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useLikePostMutation, useUnlikePostMutation } from "@/redux/services/booking/likeApiSlice"
import { toast } from 'sonner'
import { useRouter } from "next/navigation"

interface InteractionsProps {
  postId: string
  likesCount: number
  commentsCount: number
  isLiked: boolean
}

export const Interactions: React.FC<InteractionsProps> & {
  Skeleton: React.FC
} = ({ postId, likesCount, commentsCount, isLiked }) => {
  const [likePost] = useLikePostMutation()
  const [unlikePost] = useUnlikePostMutation()
  const router = useRouter()

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikePost(postId).unwrap()
      } else {
        await likePost(postId).unwrap()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      })
    }
  }

  const handleComment = () => {
    router.push(`/X/post/${postId}`)
  }

  const handleShare = () => {
    toast({
      title: "Share",
      description: "Sharing functionality not implemented yet",
    })
  }

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={handleLike}>
        <Heart className={`w-5 h-5 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
        <span>{likesCount}</span>
      </Button>
      <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={handleComment}>
        <MessageCircle className="w-5 h-5" />
        <span>{commentsCount}</span>
      </Button>
      <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={handleShare}>
        <Share className="w-5 h-5" />
      </Button>
    </div>
  )
}

Interactions.Skeleton = function InteractionsSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="w-16 h-8" />
      <Skeleton className="w-16 h-8" />
      <Skeleton className="w-16 h-8" />
    </div>
  )
}

