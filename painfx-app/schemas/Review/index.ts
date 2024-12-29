// src/schemas/review.ts

import { z } from 'zod';
import { clinicSchema } from '../Clinic';
import { patientSchema } from '../Patient';


export const reviewSchema = z.object({
  id: z.string().uuid(),
  clinic: clinicSchema,
  patient: patientSchema,
  rating: z.number().int().min(1).max(5),
  reviewText: z.string().optional(),
  createdAt: z.string().datetime(),
});

export const reviewListSchema = z.array(reviewSchema);

export type Review = z.infer<typeof reviewSchema>;


export const createUpdateReviewSchema = z.object({
  clinicId: z.string().uuid(),
  patientId: z.string().uuid(),
  rating: z.number().min(1).max(5),
  reviewText: z.string().optional(),
});

export type createUpdateReview = z.infer<typeof createUpdateReviewSchema>;