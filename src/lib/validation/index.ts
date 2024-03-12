

import { z } from "zod";

export const signUpValidation = z.object({
    name: z.string().min(2, {message:'Too short'}),
    username: z.string().min(2,{message:'Too short'}),
    password: z.string().min(8, {message:'Password must be at least 8 characters'}),
    email: z.string().email()
  })

  export const signinValidation = z.object({
    
    password: z.string().min(8, {message:'Password must be at least 8 characters'}),
    email: z.string().email()
  })