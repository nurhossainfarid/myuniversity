import { z } from 'zod'

const userValidationSchema = z.object({
  password: z
    .string({
      invalid_type_error: 'Password must be a string',
    })
    .min(8, 'Password must be at least 8 characters long')
    .max(20, 'Password must be at least 20 characters long')
    .optional(),
})

export default userValidationSchema
