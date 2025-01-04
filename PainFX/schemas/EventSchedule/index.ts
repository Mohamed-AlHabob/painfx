// src/schemas/eventSchedule.ts

import { z } from 'zod';
import { doctorSchema } from '../Doctor';
import { clinicSchema } from '../Clinic';


export const eventScheduleSchema = z.object({
  id: z.string().uuid(),
  clinic: clinicSchema,
  doctor: doctorSchema.optional(),
  eventName: z.string().min(1, 'Event name is required'),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  description: z.string().optional(),
});

export const eventScheduleListSchema = z.array(eventScheduleSchema);

export type EventSchedule = z.infer<typeof eventScheduleSchema>;


export const createUpdateEventScheduleSchema = z.object({
  clinicId: z.string().uuid(),
  doctorId: z.string().uuid().optional(),
  eventName: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  description: z.string().optional(),
});
export type CreateUpdateEventSchedule = z.infer<typeof createUpdateEventScheduleSchema>;