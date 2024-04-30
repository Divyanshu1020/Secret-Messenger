import {z} from 'zod'

export const userNameZodValidation = z
    .string()
    .min(3, {message: 'Username must be at least 3 character long.'})
    .max(20, {message: 'Username must be at most 20 characters long.'})
    .regex(/^[a-zA-Z0-9]+$/, {message: 'Username must only contain letters and numbers.'})

export const signUpSchema = z.object({
    userName: userNameZodValidation,
    email: z
    .string()
    .email({message: 'Please enter a valid email.'}),
    password: z
    .string()
    .min(8, {message: 'Password must be at least 8 characters long.'})
    .max(20, {message: 'Password must be at most 20 characters long.'})
})