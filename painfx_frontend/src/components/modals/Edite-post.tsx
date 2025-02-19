"use client"

import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslation } from "react-i18next"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, X } from "lucide-react"
import { useModal } from "@/hooks/use-modal-store"
import { usePosts } from "@/hooks/Social/post"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "../spinner"

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  file: z.instanceof(File).optional(),
  url: z.string().url().optional(),
  thumbnail: z.string().url().optional(),
})

type PostFormValues = z.infer<typeof postSchema>

export function EditPostModal() {
  const { t } = useTranslation()
  const { isOpen, onClose, type, data } = useModal()
  const { updatePost, isUpdating } = usePosts()
  const [isVideoEnabled, setIsVideoEnabled] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: data?.Post?.title || "",
      content: data?.Post?.content || "",
      url: data?.Post?.media_attachments?.[0]?.url || "",
      thumbnail: data?.Post?.media_attachments?.[0]?.thumbnail || "",
    },
  })

  const isModalOpen = isOpen && type === "editPost"
  const postId = data?.Post?.id || ""

  const onSubmit: SubmitHandler<PostFormValues> = async (values) => {
    await updatePost(postId, values)
    onClose()
    reset()
  }

  const fileWatch = watch("file")

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("edit_post")}</DialogTitle>
          <DialogDescription>{t("update_post_details")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t("title")}</Label>
            <Input id="title" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">{t("content")}</Label>
            <Textarea id="content" {...register("content")} rows={5} />
            {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
          </div>

          <Accordion type="single" collapsible>
            <AccordionItem value="video">
              <AccordionTrigger>
                <div className="flex items-center">
                  <Upload className="mr-2 h-4 w-4" />
                  {t("video_options")}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="video-enabled" checked={isVideoEnabled} onCheckedChange={setIsVideoEnabled} />
                    <Label htmlFor="video-enabled">{t("enable_video")}</Label>
                  </div>
                  {isVideoEnabled && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="file">{t("upload_video_file")}</Label>
                        <Input id="file" type="file" accept="video/*" {...register("file")} />
                        {errors.file && <p className="text-sm text-destructive">{errors.file.message}</p>}
                        {fileWatch && (
                          <div className="flex items-center justify-between bg-muted p-2 rounded-md">
                            <span className="text-sm truncate">{fileWatch?.name}</span>
                            <Button type="button" variant="ghost" size="sm" onClick={() => reset({ file: undefined })}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="url">{t("enter_video_url")}</Label>
                        <Input id="url" type="url" {...register("url")} />
                        {errors.url && <p className="text-sm text-destructive">{errors.url.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="thumbnail">{t("thumbnail")}</Label>
                        <Input id="thumbnail" type="url" {...register("thumbnail")} />
                        {errors.thumbnail && <p className="text-sm text-destructive">{errors.thumbnail.message}</p>}
                      </div>
                    </>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <DialogFooter>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Spinner className="mr-2" />
                  {t("updating_post")}
                </>
              ) : (
                t("update_post")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

