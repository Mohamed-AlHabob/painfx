// src/schemas/usersAudit.ts

import { z } from 'zod';
import { userProfileSchema } from '../user-profile';

export const usersAuditSchema = z.object({
  id: z.string().uuid(),
  user: userProfileSchema,
  changedData: z.record(z.string(), z.any()),
  changedAt: z.string().datetime(),
});

export const usersAuditListSchema = z.array(usersAuditSchema);

export type UsersAudit = z.infer<typeof usersAuditSchema>;
