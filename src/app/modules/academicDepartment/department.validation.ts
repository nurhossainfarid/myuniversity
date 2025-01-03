import { z } from 'zod'

export const createDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
        invalid_type_error: 'Department name must be a string',
        required_error: 'Department name must be provided',
    }),
  }),
})

export const updateDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
        invalid_type_error: 'Department name must be a string',
        required_error: 'Faculty must be provided',
    }),
  }),
})