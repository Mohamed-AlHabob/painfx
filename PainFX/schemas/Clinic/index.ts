// src/schemas/clinic.ts

import { z } from 'zod';
import { userProfileSchema } from '../user-profile';
import { doctorSchema, specializationSchema } from '../Doctor';


export const clinicSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().nullable().optional(),
  address: z.string().optional(),
  specialization: specializationSchema.nullable().optional(),
  owner: userProfileSchema.nullable().optional(),
  doctors: z.array(doctorSchema).nullable().optional(),
  icon: z.string().nullable().optional(),
  active: z.boolean().nullable().optional(),
  reservation_open : z.boolean().nullable().optional(),
  privacy: z.boolean().nullable().optional(),
  description: z.string().nullable().optional(),
  created_at: z.string().datetime().nullable().optional(),
  updated_at: z.string().datetime().nullable().optional(),
});

export const clinicListSchema = z.array(clinicSchema);

export type Clinic = z.infer<typeof clinicSchema>;


export const clinicDoctorSchema = z.object({
  id: z.string().uuid(),
  clinic: clinicSchema,
  doctor: doctorSchema,
  // Include any additional fields if present
});

export const clinicDoctorListSchema = z.array(clinicDoctorSchema);

export type ClinicDoctor = z.infer<typeof clinicDoctorSchema>;


export const createUpdateClinicSchema = z.object({
  name: z.string().min(5, 'Name is required'),
  address: z.string().optional(),
  specialization : z.string().optional(),
  license_number : z.string().optional(),
  license_expiry_date: z.string().optional(),
  description: z.string().optional(),
});

export type CreateUpdateClinic = z.infer<typeof createUpdateClinicSchema>;