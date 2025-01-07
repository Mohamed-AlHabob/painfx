import { z } from 'zod';
import { userProfileSchema } from '../user-profile';
import { postSchema } from './post';

export const commentSchema = z.object({
  id: z.string().uuid().optional(),
  user: userProfileSchema.optional(),
  content_type: z.string(), // e.g., "post", "comment", "event"
  object_id: z.string().uuid(), // ID of the object being commented on
  text: z.string(),
  parent: z.string().uuid().nullable().optional(), // For nested comments
  created_at: z.string().datetime().optional(),
});

export const commentListSchema = z.array(commentSchema);

export type Comment = z.infer<typeof commentSchema>;

export const createUpdateCommentSchema = z.object({
  content_type: z.string(), // e.g., "post", "comment", "event"
  object_id: z.string().uuid(), // ID of the object being commented on
  text: z.string().min(1, "Comment text is required"),
  parent: z.string().uuid().nullable().optional(), // For nested comments
});

export type CreateUpdateComment = z.infer<typeof createUpdateCommentSchema>;


export const likeSchema = z.object({
  id: z.string().uuid(),
  user: userProfileSchema.optional(),
  content_type: z.string(), // e.g., "post", "comment", "event"
  object_id: z.string().uuid(), // ID of the object being liked
  created_at: z.string().datetime().optional(),
});

export const likeListSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(likeSchema),
});



export type Like = z.infer<typeof likeSchema>;

export const createUpdateLikeSchema = z.object({
  content_type: z.string(), // e.g., "post", "comment", "event"
  object_id: z.string().uuid(), // ID of the object being liked
});

export type CreateUpdateLike = z.infer<typeof createUpdateLikeSchema>;