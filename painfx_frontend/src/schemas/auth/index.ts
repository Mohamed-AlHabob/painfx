import { z } from 'zod';

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
    .min(4, { message: "Your password must be atleast 8 characters long" })
    .max(64, {
      message: "Your password can not be longer then 64 characters long",
    })
    .refine(
      (value) => /^[a-zA-Z0-9_.-]*$/.test(value ?? ""),
      "password should contain only alphabets and numbers",
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