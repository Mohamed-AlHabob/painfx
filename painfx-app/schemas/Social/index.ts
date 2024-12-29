import { z } from 'zod';
import { userProfileSchema } from '../user-profile';
import { postSchema } from './post';

export const commentSchema = z.object({
  post: postSchema.optional(),
  user: userProfileSchema.optional(),
  commentText: z.string().optional(),
  parentCommentId: z.string().uuid().optional(),
  createdAt: z.string().datetime().optional(),
});

export const commentListSchema = z.array(commentSchema);

export type Comment = z.infer<typeof commentSchema>;


export const likeSchema = z.object({
  id: z.string().uuid(),
  post: z.string().optional(),
  user:  userProfileSchema.optional(),
  createdAt: z.string().datetime().optional(),
});

export const likeListSchema = z.array(likeSchema);

export type Like = z.infer<typeof likeSchema>;


export const createUpdateLikeSchema = z.object({
  postId: z.string().uuid().optional(),
});
export type createUpdateLike = z.infer<typeof createUpdateLikeSchema>;

export const createUpdateCommentSchema = z.object({
  postId: z.string().uuid(),
  commentText: z.string(),
  parentCommentId: z.string().uuid().nullable().optional(),
});

export type createUpdateComment = z.infer<typeof createUpdateCommentSchema>;