// src/schemas/reservation.ts

import { z } from 'zod';
import { patientSchema } from '../Patient';
import { doctorSchema } from '../Doctor';


export const ReservationStatusEnum = z.enum([
  'pending',
  'approved',
  'rejected',
  'cancelled',
]);

export const reservationSchema = z.object({
  id: z.string().uuid().optional(),
  patient: patientSchema.nullable().optional(),
  clinic:z.string().nullable().optional(),
  doctor: z.string().nullable().optional(),
  status: ReservationStatusEnum.optional(),
  reasonForCancellation: z.string().optional(),
  reservation_date: z.string().date().nullable().optional(),
  reservation_time: z.string().nullable().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const reservationListSchema = z.array(reservationSchema);

export type Reservation = z.infer<typeof reservationSchema>;


// src/schemas/reservationDoctor.ts


export const reservationDoctorSchema = z.object({
  id: z.string().uuid(),
  reservation: reservationSchema,
  doctor: doctorSchema,
  assignedAt: z.string().datetime(),
});

export const reservationDoctorListSchema = z.array(reservationDoctorSchema);

export type ReservationDoctor = z.infer<typeof reservationDoctorSchema>;

export const createUpdateReservationSchema = z.object({
  reservation_date: z
    .string()
    .refine(
      (date) => !isNaN(new Date(date).getTime()),
      { message: "Invalid date format. Use YYYY-MM-DD." }
    ),
    reservation_time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {message: "Invalid time format. Use HH:mm."}),
    doctor: z.string().optional(),
    clinic: z.string().optional(),
});

export type createUpdateReservation = z.infer<typeof createUpdateReservationSchema>;