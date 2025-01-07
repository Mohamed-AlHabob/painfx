import { z } from 'zod';
export const media_attachmentsSchema = z.object({
    id: z.string().uuid().optional(),
    media_type: z.enum(['image', 'video']), // Only allow "image" or "video"
    file: z.any().nullable().optional(), // File object (for uploads)
    url: z.string().url("Invalid URL").nullable().optional(), // URL for hosted media
    thumbnail: z.any().nullable().optional(), // Thumbnail for videos
    order: z.number().nullable().optional(), // Order of media in a post
  });
  
  export type MediaAttachments = z.infer<typeof media_attachmentsSchema>;