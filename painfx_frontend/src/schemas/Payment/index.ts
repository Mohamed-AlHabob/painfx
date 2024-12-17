// src/schemas/payment.ts

import { z } from 'zod';
export const categorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export const categoryListSchema = z.array(categorySchema);

export type Category = z.infer<typeof categorySchema>;



export const createUpdateCategorySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});
export type createUpdateCategory = z.infer<typeof createUpdateCategorySchema>;

export const paymentMethodSchema = z.object({
  id: z.number(),
  method_name: z.string().min(1, "Method name is required").max(255),
});

export const createUpdatePaymentMethodSchema = z.object({
  method_name: z.string().min(1, "Method name is required").max(255),
});


export const paymentSchema = z.object({
  id: z.number(),
  user: z.number(), // Assuming user ID is provided
  amount: z.number().positive("Amount must be a positive value"),
  method: z.number(), // Assuming method ID is provided
  payment_status: z.string(), // Could add enum validation if payment statuses are predefined
  subscription: z.number().optional(), // Optional association with a subscription
  reservation: z.number().optional(), // Optional association with a reservation
  created_at: z.string(), // ISO date string
});

export const createUpdatePaymentSchema = z.object({
  user: z.number(),
  amount: z.number().positive("Amount must be a positive value"),
  method: z.number(),
  payment_status: z.string(),
  subscription: z.number().optional(),
  reservation: z.number().optional(),
});



export const subscriptionSchema = z.object({
  id: z.number(),
  user: z.number(),
  category: z.number(),
  status: z.string(),
  payment: z.number().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const createUpdateSubscriptionSchema = z.object({
  user: z.number(),
  category: z.number(),
  status: z.string(),
  payment: z.number().optional(),
});
