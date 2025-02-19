"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/use-modal-store"
import { usePosts } from "@/hooks/Social/post"
import { useModalTranslation, type ModalProps } from "@/utils/modal-utils"
import { Trash2 } from "lucide-react"

export function ConfirmDeletePost({ isOpen, onClose }: ModalProps) {
  const { t, modalTitles, buttonLabels } = useModalTranslation()
  const { data } = useModal()
  const { onDeletePost } = usePosts()
  const [isDeleting, setIsDeleting] = useState(false)

  const postId = data?.Post?.id || ""
  const postTitle = data?.Post?.title || t("this_post")

  const handleConfirm = async () => {
    if (!postId) {
      console.error("Post ID is missing.")
      return
    }
    setIsDeleting(true)
    try {
      await onDeletePost(postId)
      onClose()
    } catch (error) {
      console.error("Failed to delete post:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            {modalTitles.deletePost}
          </DialogTitle>
          <DialogDescription>
            {t("confirm_delete_post")} <br />
            <span className="font-semibold text-red-500">{postTitle}</span>?
            <br /> {t("this_action_cannot_be_undone")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isDeleting}>
            {buttonLabels.cancel}
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isDeleting}>
            {isDeleting ? buttonLabels.deleting : buttonLabels.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

