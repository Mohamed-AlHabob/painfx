'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from 'lucide-react';
import { usePosts } from '@/hooks/Social/post';


export default function PostContent() {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false)
  const { register, errors, onCreatePost, isLoading } = usePosts()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onCreatePost()
  }
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        {...register('title')}
        placeholder="Enter your post title"
      />
      {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
    </div>
    <div className="space-y-2">
      <Label htmlFor="content">Content</Label>
      <Textarea
        id="content"
        {...register('content')}
        placeholder="Write your post content here"
        rows={5}
      />
      {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
    </div>

    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsVideoExpanded(!isVideoExpanded)}
        className="w-full"
      >
        <Upload className="mr-2 h-4 w-4" />
        {isVideoExpanded ? 'Hide Video Options' : 'Add Video'}
      </Button>
    </div>

    {isVideoExpanded && (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="video_file">Upload Video File</Label>
          <Input
            id="video_file"
            type="file"
            accept="video/*"
            {...register('video_file')}
          />
          {errors.video_file && <p className="text-red-500 text-sm">{errors.video_file.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="video_url">Or Enter Video URL</Label>
          <Input
            id="video_url"
            type="url"
            placeholder="https://example.com/video.mp4"
            {...register('video_url')}
          />
          {errors.video_url && <p className="text-red-500 text-sm">{errors.video_url.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="thumbnail_url">Thumbnail URL (optional)</Label>
          <Input
            id="thumbnail_url"
            type="url"
            placeholder="https://example.com/thumbnail.jpg"
            {...register('thumbnail_url')}
          />
          {errors.thumbnail_url && <p className="text-red-500 text-sm">{errors.thumbnail_url.message}</p>}
        </div>
      </div>
    )}

    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating Post...
        </>
      ) : (
        'Create Post'
      )}
    </Button>
  </form>
  );
};

