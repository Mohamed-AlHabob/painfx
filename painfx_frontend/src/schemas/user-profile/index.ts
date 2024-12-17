// src/schemas/userProfile.ts
import { z } from 'zod';

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  phone_number: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').nullable().optional(),
  html_content: z.string().nullable().optional(),
  json_content: z.record(z.any()).nullable().optional(),
  avatar: z.string().url().nullable().optional(),
  bio: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  gander: z.enum(['male', 'female', 'other']).nullable().optional(),
});

export const userProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('Invalid email address'),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  profile: ProfileSchema.optional(),
  date_joined: z.string().datetime().nullable().optional(),
  last_login: z.string().datetime().nullable().optional(),
});

export const userProfileListSchema = z.array(userProfileSchema);

export const createUpdateUserProfileSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone_number: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .optional(),
  geolocation:z.string().optional(),
  avatar: z.string().url().optional(),
  address:z.string().optional(),
});

export type UserProfile = z.infer<typeof userProfileSchema>;
export type CreateUpdateUserProfile = z.infer<typeof createUpdateUserProfileSchema>;
