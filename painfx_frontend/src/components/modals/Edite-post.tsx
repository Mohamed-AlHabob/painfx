'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";
import { PostFormValues, usePosts } from "@/hooks/Social/post";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Spinner } from "../spinner";
import { Upload } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function EditPostModal() {
  const { t } = useTranslation();
  const { isOpen, onClose, type, data } = useModal();
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const { updatePost, errors, register, isUpdating } = usePosts();
  const isModalOpen = isOpen && type === "editPost";

  const postId = data?.Post?.id || "";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values: Partial<PostFormValues> = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      file: formData.get("file") as File,
      thumbnail: formData.get("thumbnail") as string,
    };

    const videoFile = formData.get("video_file") as File | null;
    if (videoFile instanceof File) {
      values.file = videoFile;
    }

    updatePost(postId, values);
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {t("edit_post")}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {t("update_post_details")}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">{t("title")}</Label>
            <Input
              id="title"
              defaultValue={data?.Post?.title || ""}
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">{t("content")}</Label>
            <Textarea
              id="content"
              defaultValue={data?.Post?.content || ""}
              {...register("content")}
              rows={5}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsVideoExpanded(!isVideoExpanded)}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isVideoExpanded ? t("hide_video_options") : t("add_video")}
            </Button>
          </div>

          {isVideoExpanded && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file">{t("upload_video_file")}</Label>
                <Input
                  id="file"
                  type="file"
                  accept="video/*"
                  {...register("file")}
                />
                {errors.file && (
                  <p className="text-red-500 text-sm">
                    {errors.file.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="url">{t("enter_video_url")}</Label>
                <Input
                  id="url"
                  defaultValue={data?.Post?.media_attachments?.[0]?.url || ""}
                  type="url"
                  {...register("url")}
                />
                {errors.url && (
                  <p className="text-red-500 text-sm">
                    {errors.url.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnail">{t("thumbnail")}</Label>
                <Input
                  id="thumbnail"
                  defaultValue={data?.Post?.media_attachments?.[0]?.thumbnail ?? ""}
                  type="url"
                  {...register("thumbnail")}
                />
                {errors.thumbnail && (
                  <p className="text-red-500 text-sm">
                    {errors.thumbnail.message}
                  </p>
                )}
              </div>
            </div>
          )}
          <DialogFooter className="px-6 py-4">
            <div className="flex items-center justify-between w-full">
              <Button type="submit" className="w-full" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Spinner />
                    {t("creating_post")}
                  </>
                ) : (
                  t("create_post")
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
