import {z} from 'zod'

export const messageSchema = z.object({
    Content: z
    .string()
    .min(1, {message: 'Content must be at least 1 character long.'})
    .max(340, {message: 'Content must be at most 340 characters long.'}),
})