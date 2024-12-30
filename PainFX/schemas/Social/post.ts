import { z } from 'zod';
import { doctorSchema } from '../Doctor';

export const postSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().nullable().optional(),
    doctor: doctorSchema.optional(),
    content: z.string().nullable().optional(),
    video_file:  z.any().nullable().optional(),
    video_url: z.string().url("Invalid video URL").nullable().optional(),
    thumbnail_url: z.string().url("Invalid thumbnail URL").nullable().optional(),
    comments_count: z.number().nullable().optional(),
    likes_count: z.number().nullable().optional(),
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
    video_file:  z.any().optional(),
    video_url: z.string().url("Invalid video URL").optional(),
    thumbnail_url: z.string().url("Invalid thumbnail URL").optional(),
  });
  
  export type CreateUpdatePostSchema = z.infer<typeof createUpdatePostSchema>;
  
  
  