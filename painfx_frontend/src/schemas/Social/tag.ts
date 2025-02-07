import { z } from 'zod';
export const TagSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, "Tag name is required"),
  });
  
  export type Tag = z.infer<typeof TagSchema>;