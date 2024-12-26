"use client";

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
import { usePosts } from "@/hooks/Social/post";
import { useTranslation } from "react-i18next";

export function ConfirmDeletePost() {
  const { t } = useTranslation();
  const { isOpen, onClose, type, data } = useModal();
  const { onDeletePost, isDeleting } = usePosts();
  const isModalOpen = isOpen && type === "deletePost";

  const postId = data?.Post?.id || "";
  const postTitle = data?.Post?.title || t("this_post");

  const handleConfirm = async () => {
    if (!postId) {
      console.error("Post ID is missing.");
      return;
    }

    try {
      await onDeletePost(postId);
      onClose();
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {t("delete_post")}
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {t("confirm_delete_post")} <br />
            <span className="text-red-500 font-semibold">{postTitle}</span>?
            <br /> {t("this_action_cannot_be_undone")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isDeleting} onClick={onClose} variant="ghost">
              {t("cancel")}
            </Button>
            <Button
              disabled={isDeleting}
              onClick={handleConfirm}
              variant="destructive"
            >
              {isDeleting ? t("deleting") : t("confirm")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
