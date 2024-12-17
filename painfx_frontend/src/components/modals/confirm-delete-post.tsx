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


export function ConfirmDeletePost() {
  const { isOpen, onClose, type, data } = useModal();
  const { onDeletePost, isDeleting } = usePosts();
  const isModalOpen = isOpen && type === "deletePost";

  const postId = data?.Post?.id || "";
  const postTitle = data?.Post?.title || "this post";

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
            Delete Post
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to delete <br />
            <span className="text-red-500 font-semibold">{postTitle}</span>?
            <br /> This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isDeleting} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={isDeleting}
              onClick={handleConfirm}
              variant="destructive"
            >
              {isDeleting ? "Deleting..." : "Confirm"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
