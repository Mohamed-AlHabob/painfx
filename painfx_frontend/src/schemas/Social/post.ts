import { z } from 'zod';
import { doctorSchema } from '../Doctor';


export const media_attachmentsSchema = z.object({
  id: z.string().uuid().optional(),
  media_type: z.string().nullable().optional(),
  file: z.any().nullable().optional(),
  url: z.string().url("Invalid URL").nullable().optional(),
  thumbnail: z.any().nullable().optional(),
  order: z.number().nullable().optional(),
});

export type MediaAttachments = z.infer<typeof media_attachmentsSchema>;

export const postSchema = z.object({
    id: z.string().uuid().optional(),
    title: z.string().nullable().optional(),
    doctor: doctorSchema.optional(),
    content: z.string().nullable().optional(),
    media_attachments: z.array(media_attachmentsSchema).nullable().optional(),
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
  });
  
  export type CreateUpdatePostSchema = z.infer<typeof createUpdatePostSchema>;
  
  
  