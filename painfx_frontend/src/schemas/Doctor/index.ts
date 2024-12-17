// src/schemas/doctor.ts

import { z } from 'zod';
import { userProfileSchema } from '../user-profile';


export const specializationSchema = z.object({
  id: z.string().optional(),
  name: z.string().nullable().optional(),
});

export const doctorSchema = z.object({
  id: z.string().uuid().optional(),
  user: userProfileSchema,
  specialization:  specializationSchema.nullable().optional(),
  license_number: z.string().nullable().optional(),
  reservation_open : z.boolean().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const doctorListSchema = z.array(doctorSchema);

export type Doctor = z.infer<typeof doctorSchema>;


export const createUpdateDoctorSchema = z.object({
  specialization: z.string().optional(),
  license_number: z.string().optional(),
});

export type CreateUpdateDoctor = z.infer<typeof createUpdateDoctorSchema>;