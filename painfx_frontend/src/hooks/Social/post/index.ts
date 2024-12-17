
"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useGetPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
} from "@/redux/services/booking/postApiSlice";
import { createUpdatePostSchema } from "@/schemas/Social/post";
import { useCallback } from "react";
import { extractErrorMessage } from "@/hooks/error-handling";

export interface PostFormValues {
  id?: string;
  title: string;
  content: string;
  video_file?: File;
  video_url?: string;
  thumbnail_url?: string;
}

export const usePosts = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostFormValues>({
    resolver: zodResolver(createUpdatePostSchema),
  });

  const { data: posts, refetch: refetchPosts, isLoading: isLoadingPosts, error: postsError } = useGetPostsQuery({});

  const [createPost, { isLoading: isCreatingPost }] = useCreatePostMutation();
  const [updatePostMutation, { isLoading: isUpdating }] = useUpdatePostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const onCreatePost = useCallback(() => {
    return handleSubmit(async (values) => {
      try {
        await toast.promise(
          createPost(values).unwrap(),
          {
            loading: "Creating post...",
            success: async () => {
              reset();
              await refetchPosts();
              return "Post created successfully!";
            },
            error: (error: any) => extractErrorMessage(error),
          }
        );
        reset();
      }
      catch (error: any) {
        toast.error(extractErrorMessage(error));
      }
    })();
  }, [createPost, reset, refetchPosts, handleSubmit]);

  const onUpdatePost = useCallback(() => {
    return handleSubmit(async ({ id, ...values }) => {
      if (!id) return;
      try {
        await toast.promise(
          updatePostMutation({ id, ...values }).unwrap(),
          {
            loading: "Updating post...",
            success: async () => {
              reset();
              await refetchPosts();
              return "Post updated successfully!";
            },
            error: (error) => extractErrorMessage(error),
          }
        );
        reset();
      } catch (error:any) {
        toast.error(extractErrorMessage(error));
      }
    })();
  }, [updatePostMutation, reset, refetchPosts, handleSubmit]);

  const updatePost = useCallback(async (id: string, values: Partial<PostFormValues>) => {
    try {
      await toast.promise(
        updatePostMutation({ id, ...values }).unwrap(),
        {
          loading: "Updating post...",
          success: async () => {
            reset();
            await refetchPosts();
            return "Post updated successfully!";
          },
          error: (error) => extractErrorMessage(error),
        }
      );
    } catch (error: any) {
      toast.error(extractErrorMessage(error));
      throw error;
    }
  }, [updatePostMutation, reset, refetchPosts]);

  const onDeletePost = useCallback(async (id: string) => {
    try {
      await toast.promise(
        deletePost({ id }).unwrap(),
        {
          loading: "Deleting post...",
          success: async () => {
            reset();
            await refetchPosts();
            return "Post deleted successfully!";
          },
          error: (error) => extractErrorMessage(error),
        }
      );
    } catch (error: any) {
      toast.error(extractErrorMessage(error));
    }
  }, [deletePost, reset, refetchPosts]);

  const isLoading = isCreatingPost || isUpdating || isDeleting || isLoadingPosts;

  return {
    posts,
    isLoadingPosts,
    postsError,
    isCreatingPost,
    isUpdating,
    isDeleting,
    isLoading,
    onCreatePost,
    onUpdatePost,
    updatePost,
    onDeletePost,
    register,
    errors,
  };
};
