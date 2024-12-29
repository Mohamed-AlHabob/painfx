import { z } from 'zod';

export const videoSchema = z.object({
    id: z.string().uuid(),
    video_file: z.string().url().nullable().optional(),
    video_url: z.string().url().nullable().optional(),
    thumbnail_url: z.string().url().nullable().optional(),
  });
  
  export const videoListSchema = z.array(videoSchema);
  
  export type Video = z.infer<typeof videoSchema>;
  
  export const createUpdateVideoSchema = z.object({
    title: z.string(),
    // video_file: z.
    video_url: z.string().url().optional(),
    thumbnail_url: z.string().url().optional(),
  });
  export type createUpdateVideo = z.infer<typeof createUpdateVideoSchema>;