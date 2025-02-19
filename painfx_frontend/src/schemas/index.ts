import { z } from 'zod';


export const UserProfileSchema = z.object({
  id: z.string().uuid(),
  phone_number: z.string().nullable().optional(),
  gender: z.enum(['male', 'female','non_binary','prefer_not_to_say', 'other']).nullable().optional(),
  bio: z.string().nullable().optional(),
  avatar: z.string().url().nullable().optional(),
  expo_push_token: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  region: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  postal_code: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email('Invalid email address'),
  role: z.string().nullable().optional(),
  first_name: z.string().nullable().optional(),
  last_name: z.string().nullable().optional(),
  username: z.string().nullable().optional(),
  is_active: z.boolean().nullable().optional(),
  last_login: z.string().datetime().nullable().optional(),
  created_at: z.string().datetime().nullable().optional(),
  profile: UserProfileSchema.nullable().optional(),
});

export const userProfileListSchema = z.array(UserProfileSchema);

export const createUpdateUserProfileSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone_number: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .nullable().optional(),
  geolocation:z.string().optional(),
  avatar: z.string().url().optional(),
  address:z.string().optional(),
});

export type UserProfile = z.infer<typeof UserSchema>;
export type CreateUpdateUserProfile = z.infer<typeof createUpdateUserProfileSchema>;


export const CampaignStatusEnum = z.enum(['active', 'paused', 'completed']);

export const advertisingCampaignSchema = z.object({
  id: z.string().uuid(),
  clinic: z.string().nullable().optional(),
  campaign_name: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
  // start_date: z.string().datetime().nullable().optional(),
  // end_date: z.string().datetime().nullable().optional(),
  budget: z.string().nullable().optional(),
  goto: z.string().nullable().optional(),
  status: CampaignStatusEnum.nullable().optional(),
});

export const advertisingCampaignListSchema = z.array(advertisingCampaignSchema);

export type AdvertisingCampaign = z.infer<typeof advertisingCampaignSchema>;


export const SignUpSchema = z.object({
    email: z.string().email("You must provide a valid email"),
    password: z
      .string()
      .min(8, { message: "Your password must be at least 8 characters long" })
      .max(64, {
        message: "Your password cannot be longer than 64 characters",
      })
      .refine(
        (value) => /[a-zA-Z\u0600-\u06FF]/.test(value) && /\d/.test(value),
        "Password must contain at least one letter and one number"
      ),
  });
  
  
  
  export const SignInSchema = z.object({
    email: z.string().email("You must give a valid email"),
    password: z
      .string()
      .min(4, { message: "Your password must be at least 8 characters long" })
      .max(64, {
        message: "Your password cannot be longer than 64 characters",
      })
      .refine(
        (value) => /[a-zA-Z\u0600-\u06FF]/.test(value) && /\d/.test(value),
        "Password must contain at least one letter and one number"
      ),
  })
  
  
  export const RestPasswordSchema = z.object({
    email: z.string().email("You must give a valid email"),
  })
  
  export const RestPassworduseConfirmSchema = z.object({
    new_password: z
    .string()
    .min(4, { message: "Your password must be atleast 8 characters long" })
    .max(64, {
      message: "Your password can not be longer then 64 characters long",
    })
    .refine(
      (value) => /^[a-zA-Z0-9_.-]*$/.test(value ?? ""),
      "password should contain only alphabets and numbers",
    ),
  
    re_new_password: z
    .string()
    .min(4, { message: "Your password must be atleast 8 characters long" })
    .max(64, {
      message: "Your password can not be longer then 64 characters long",
    })
    .refine(
      (value) => /^[a-zA-Z0-9_.-]*$/.test(value ?? ""),
      "password should contain only alphabets and numbers",
    ),
  })
  

  export const SpecializationSchema = z.object({
    id: z.string().uuid(),
    name: z.string().nullable().optional(),
  });
  
  export const DoctorSchema = z.object({
    id: z.string().uuid().optional(),
    user: UserSchema.nullable().optional(),
    specialization: SpecializationSchema.nullable().optional(),
    active: z.boolean().nullable().optional(),
    privacy: z.boolean().nullable().optional(),
    license_number: z.string().nullable().optional(),
    license_expiry_date: z.string().date().nullable().optional(),
    license_image: z.string().nullable().optional(),
    reservation_open: z.boolean().nullable().optional(),
  });
  
  export const doctorListSchema = z.array(DoctorSchema);
  
  export type Doctor = z.infer<typeof DoctorSchema>;
  
  
  export const createUpdateDoctorSchema = z.object({
    specialization: z.string().optional(),
    license_number: z.string().optional(),
  });
  
  export type CreateUpdateDoctor = z.infer<typeof createUpdateDoctorSchema>;
  
export const clinicSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().nullable().optional(),
    address: z.string().optional(),
    specialization: SpecializationSchema.nullable().optional(),
    owner: UserSchema.nullable().optional(),
    doctors: z.array(DoctorSchema).nullable().optional(),
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
    doctor: DoctorSchema,
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

  export const CommentSchema = z.object({
    id: z.string().uuid(),
    user: UserSchema.nullable().optional(),
    post: z.string().uuid().nullable().optional(),
    text: z.string().nullable().optional(),
    parent: z.string().uuid().nullable().optional(),
    replies: z.array(z.lazy(() => CommentSchema as z.ZodType<any>)).nullable().optional(),
    created_at: z.string().nullable().optional(),
  }) as z.ZodType<any>;

export const commentListSchema = z.array(CommentSchema);

export type Comment = z.infer<typeof CommentSchema>;

export const createUpdateCommentSchema = z.object({
  content_type: z.string(), // e.g., "post", "comment", "event"
  object_id: z.string().uuid(), // ID of the object being commented on
  text: z.string().min(1, "Comment text is required"),
  parent: z.string().uuid().nullable().optional(), // For nested comments
});

export type CreateUpdateComment = z.infer<typeof createUpdateCommentSchema>;


export const likeSchema = z.object({
  id: z.string().uuid().optional(),
  user: UserSchema.nullable().optional(),
  post: z.string().uuid().nullable().optional(),
  created_at: z.string().datetime().optional(),
});

export const likeListSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(likeSchema),
});



export type Like = z.infer<typeof likeSchema>;

export const createUpdateLikeSchema = z.object({
  post: z.string(),
});

export type CreateUpdateLike = z.infer<typeof createUpdateLikeSchema>;

export const media_attachmentsSchema = z.object({
  id: z.string().uuid(),
  post: z.string().uuid().nullable().optional(),
  media_type: z.enum(['image', 'video']).nullable().optional(),
  file: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  url: z.string().url().nullable().optional(),
  order: z.number().nullable().optional(),
});

export type MediaAttachments = z.infer<typeof media_attachmentsSchema>;

export const TagSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1, "Tag name is required"),
  });
  
  export type Tag = z.infer<typeof TagSchema>;

export const PostSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().nullable().optional(),
  doctor: DoctorSchema.optional(),
  content: z.string().nullable().optional(),
  media_attachments: z.array(media_attachmentsSchema).nullable().optional(),
  comments: z.array(CommentSchema).nullable().optional(),
  tags: z.array(TagSchema).nullable().optional(),
  likes_count: z.number().nullable().optional(),
  comments_count: z.number().nullable().optional(),
  is_liked:z.boolean().nullable().optional(),
  created_at: z.string().datetime().nullable().optional(),
  updated_at: z.string().datetime().nullable().optional(),
});

export const postListSchema = z.array(PostSchema);

export type Post = z.infer<typeof PostSchema>;

export const postListResponseSchema = z.object({
  results: z.array(PostSchema),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
  }).optional(),
});

export const createUpdatePostSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required").max(255, "Title must be 255 characters or less"),
  content: z.string().min(1, "Content is required").max(10000, "Content must be 10000 characters or less"),
  mediaAttachments: z.array(media_attachmentsSchema).optional(), // Optional media attachments
  tags: z.array(TagSchema).optional(), // Optional tags
});

export type CreateUpdatePost = z.infer<typeof createUpdatePostSchema>;

export const UsersAuditSchema = z.object({
  id: z.string().uuid(),
  user: UserSchema,
  changedData: z.record(z.string(), z.any()),
  changedAt: z.string().datetime(),
});

export const usersAuditListSchema = z.array(UsersAuditSchema);

export type UsersAudit = z.infer<typeof UsersAuditSchema>;


export const PatientSchema = z.object({
  user: UserSchema.nullable().optional(),
  medical_history: z.string().nullable().optional(),
});

export const patientListSchema = z.array(PatientSchema);

export type Patient = z.infer<typeof PatientSchema>;


export const createUpdatePatientSchema = z.object({
  medicalHistory: z.string().optional(),
});

export type CreateUpdatePatient = z.infer<typeof createUpdatePatientSchema>;

export const reviewSchema = z.object({
  id: z.string().uuid(),
  clinic: clinicSchema,
  patient: PatientSchema,
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


export const ReservationStatusEnum = z.enum([
  'pending',
  'approved',
  'rejected',
  'cancelled',
]);

export const ReservationSchema = z.object({
  id: z.string().uuid().optional(),
  patient: PatientSchema.nullable().optional(),
  clinic:clinicSchema.nullable().optional(),
  doctor: DoctorSchema.nullable().optional(),
  status: ReservationStatusEnum.optional(),
  reasonForCancellation: z.string().optional(),
  reservation_date: z.string().date().nullable().optional(),
  reservation_time: z.string().nullable().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export const reservationListSchema = z.array(ReservationSchema);

export type Reservation = z.infer<typeof ReservationSchema>;


// src/schemas/reservationDoctor.ts


export const reservationDoctorSchema = z.object({
  id: z.string().uuid(),
  reservation: ReservationSchema,
  doctor: DoctorSchema,
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





export const notificationSchema = z.object({
  id: z.string().uuid(),
  user: UserSchema,
  message: z.string().min(1, 'Message is required'),
  isRead: z.boolean(),
  createdAt: z.string().datetime(),
});

export const notificationListSchema = z.array(notificationSchema);

export type Notification = z.infer<typeof notificationSchema>;


export const eventScheduleSchema = z.object({
  id: z.string().uuid(),
  clinic: clinicSchema,
  doctor: DoctorSchema.optional(),
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