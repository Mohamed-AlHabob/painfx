"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Play } from "lucide-react"
import { MediaAttachments } from "@/schemas"

interface PostMediaProps {
  mediaAttachments: MediaAttachments[]
}

export const PostMedia: React.FC<PostMediaProps> = ({ mediaAttachments }) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaAttachments | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  if (mediaAttachments.length === 0) {
    return null
  }

  const sortedMedia = [...mediaAttachments].sort((a, b) => (a.order || 0) - (b.order || 0))

  const handleMediaClick = (media: MediaAttachments) => {
    setSelectedMedia(media)
  }

  const closeDialog = () => {
    setSelectedMedia(null)
  }

  const renderMediaItem = (media: MediaAttachments, index: number) => {
    const imageUrl = media.url || media.file || "/placeholder.svg"
    const thumbnailUrl = media.thumbnail || imageUrl

    if (media.media_type === "image") {
      return (
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={`Post image ${index + 1}`}
          layout="fill"
          objectFit="cover"
          className="rounded-md cursor-pointer transition-transform hover:scale-105"
          onClick={() => handleMediaClick(media)}
          onLoadingComplete={() => setIsLoading(false)}
        />
      )
    } else if (media.media_type === "video") {
      return (
        <div className="relative w-full h-full" onClick={() => handleMediaClick(media)}>
          <Image
            src={thumbnailUrl || "/placeholder.svg"}
            alt={`Video thumbnail ${index + 1}`}
            layout="fill"
            objectFit="cover"
            className="rounded-md cursor-pointer"
            onLoadingComplete={() => setIsLoading(false)}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="w-12 h-12 text-white opacity-80" />
          </div>
        </div>
      )
    }
    return null
  }

  const gridClassName = cn("grid gap-2", {
    "grid-cols-1": sortedMedia.length === 1,
    "grid-cols-2": sortedMedia.length === 2,
    "grid-cols-2 md:grid-cols-3": sortedMedia.length >= 3,
    "grid-rows-2": sortedMedia.length >= 3,
  })

  return (
    <>
      <div className={gridClassName}>
        {sortedMedia.map((media, index) => (
          <div
            key={media.id}
            className={cn("relative aspect-square overflow-hidden rounded-md", {
              "col-span-2 row-span-2": index === 0 && sortedMedia.length > 2,
              "md:col-span-1 md:row-span-1": index !== 0 && sortedMedia.length > 2,
            })}
          >
            {isLoading && <Skeleton className="w-full h-full" />}
            {renderMediaItem(media, index)}
          </div>
        ))}
      </div>

      <Dialog open={!!selectedMedia} onOpenChange={closeDialog}>
        <DialogContent className="max-w-4xl w-full h-full flex items-center justify-center">
          {selectedMedia?.media_type === "image" ? (
            <Image
              src={selectedMedia.url || selectedMedia.file || "/placeholder.svg"}
              alt="Full-size image"
              layout="fill"
              objectFit="contain"
            />
          ) : (
            <video
              src={selectedMedia?.url || selectedMedia?.file}
              controls
              className="max-w-full max-h-full"
              autoPlay
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

