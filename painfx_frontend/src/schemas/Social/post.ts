import { z } from 'zod';
import { doctorSchema } from '../Doctor';
import { media_attachmentsSchema } from './media-attachments';
import { TagSchema } from './tag';
import {commentSchema} from "./index"

export const postSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().nullable().optional(),
  doctor: doctorSchema.optional(),
  content: z.string().nullable().optional(),
  media_attachments: z.array(media_attachmentsSchema).nullable().optional(),
  comments: z.array(commentSchema).nullable().optional(),
  tags: z.array(TagSchema).nullable().optional(),
  likes_count: z.number().nullable().optional(),
  comments_count: z.number().nullable().optional(),
  created_at: z.string().datetime().nullable().optional(),
  updated_at: z.string().datetime().nullable().optional(),
});

export const postListSchema = z.array(postSchema);

export type Post = z.infer<typeof postSchema>;

export const postListResponseSchema = z.object({
  results: z.array(postSchema),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
  }).optional(),
});

export const createUpdatePostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required").max(255, "Title must be 255 characters or less"),
  content: z.string().min(1, "Content is required").max(10000, "Content must be 10000 characters or less"),
  mediaAttachments: z.array(media_attachmentsSchema).optional(), // Optional media attachments
  tags: z.array(TagSchema).optional(), // Optional tags
});

export type CreateUpdatePost = z.infer<typeof createUpdatePostSchema>;