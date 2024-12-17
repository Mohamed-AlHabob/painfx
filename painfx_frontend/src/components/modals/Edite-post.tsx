"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button} from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { PostFormValues, usePosts } from "@/hooks/Social/post";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Spinner } from "../spinner";
import { Upload } from "lucide-react";
import { useState } from "react";

export function EditPostModal() {
  const { isOpen, onClose, type, data } = useModal();
  const [isVideoExpanded, setIsVideoExpanded] = useState(false)
  const { updatePost,errors,register, isUpdating } = usePosts();
  const isModalOpen = isOpen && type === "editPost";

  const postId = data?.Post?.id || "";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values: Partial<PostFormValues> = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      video_url: formData.get('video_url') as string,
      thumbnail_url: formData.get('thumbnail_url') as string,
    };
    
    const videoFile = formData.get('video_file') as File | null;
    if (videoFile instanceof File) {
      values.video_file = videoFile;
    }

    updatePost(postId, values);
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className=" overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit Post
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Update the details of your post below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        defaultValue={data?.Post?.title || ""}
        {...register('title')}
      />
      {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
    </div>
    <div className="space-y-2">
      <Label htmlFor="content">Content</Label>
      <Textarea
        id="content"
        defaultValue={data?.Post?.content || ""}
        {...register('content')}
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
          //  defaultValue={data?.Post?.video_file || null}
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
            defaultValue={data?.Post?.video_url || ""}
            type="url"
            {...register('video_url')}
          />
          {errors.video_url && <p className="text-red-500 text-sm">{errors.video_url.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="thumbnail_url">Thumbnail URL (optional)</Label>
          <Input
            id="thumbnail_url"
            defaultValue={data?.Post?.thumbnail_url || ""}
            type="url"
            {...register('thumbnail_url')}
          />
          {errors.thumbnail_url && <p className="text-red-500 text-sm">{errors.thumbnail_url.message}</p>}
        </div>
      </div>
    )}
          <DialogFooter className="px-6 py-4">
            <div className="flex items-center justify-between w-full">
            <Button type="submit" className="w-full" disabled={isUpdating}>
      {isUpdating ? (
        <>
          <Spinner />
          Creating Post...
        </>
      ) : (
        'Create Post'
      )}
    </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
