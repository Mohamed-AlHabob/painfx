// src/schemas/notification.ts

import { z } from 'zod';
import { userProfileSchema } from '../user-profile';

export const notificationSchema = z.object({
  id: z.string().uuid(),
  user: userProfileSchema,
  message: z.string().min(1, 'Message is required'),
  isRead: z.boolean(),
  createdAt: z.string().datetime(),
});

export const notificationListSchema = z.array(notificationSchema);

export type Notification = z.infer<typeof notificationSchema>;
