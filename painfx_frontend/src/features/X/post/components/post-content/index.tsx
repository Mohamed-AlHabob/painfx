"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, X } from "lucide-react"
import { useCreatePostMutation } from "@/redux/services/booking/postApiSlice"
import { Badge } from "@/components/ui/badge"

export default function PostContent() {
  const [createPost, { isLoading }] = useCreatePostMutation()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [mediaFiles, setMediaFiles] = useState<File[]>([])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const postData = {
      title,
      content,
      tags: tags.map((tag) => ({ name: tag })),
      media_attachments: mediaFiles.map((file) => ({
        media_type: file.type.startsWith("image") ? "image" : "video",
        file,
        url: undefined,
      })),
    }

    try {
      await createPost(postData).unwrap()
      setTitle("")
      setContent("")
      setTags([])
      setMediaFiles([])
    } catch (error) {
      console.error("Failed to create post:", error)
    }
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      e.preventDefault()
      setTags([...tags, e.currentTarget.value.trim()])
      e.currentTarget.value = ""
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setMediaFiles([...mediaFiles, ...files])
    }
  }

  const handleRemoveFile = (file: File) => {
    setMediaFiles(mediaFiles.filter((f) => f !== file))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input id="tags" placeholder="Add a tag and press Enter" onKeyDown={handleAddTag} />
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => handleRemoveTag(tag)}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="media_attachments">Media Attachments</Label>
        <Input id="media_attachments" type="file" multiple onChange={handleFileChange} />
        <div className="flex flex-wrap gap-2">
          {mediaFiles.map((file) => (
            <Badge key={file.name} variant="secondary" className="gap-1">
              {file.name}
              <Button variant="ghost" size="icon" className="h-4 w-4 p-0" onClick={() => handleRemoveFile(file)}>
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Creating..." : "Create Post"}
      </Button>
    </form>
  )
}

