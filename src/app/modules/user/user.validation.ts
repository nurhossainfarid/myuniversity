import { z } from 'zod'

const userValidationSchema = z.object({
  id: z
    .string({
      required_error: 'User ID is required',
    })
    .nonempty('User ID cannot be empty'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(8, 'Password must be at least 8 characters long'),
  needsPasswordChange: z.boolean().optional().default(false),
  role: z.enum(['student', 'faculty', 'admin'], {
    errorMap: () => ({
      message: "Role must be one of 'student', 'faculty', or 'admin'",
    }),
  }),
  status: z
    .enum(['in-progress', 'blocked'], {
      errorMap: () => ({
        message: "Status must be either 'in-progress' or 'blocked'",
      }),
    })
    .default('in-progress'),
  isDeleted: z.boolean().optional().default(false),
})

export default userValidationSchema
