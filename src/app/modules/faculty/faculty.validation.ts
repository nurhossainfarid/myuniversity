import { z } from 'zod'

export const createFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({
        invalid_type_error: 'Faculty name must be a string',
    }),
  }),
})

export const updateFacultyValidationSchema = z.object({
  body: z.object({
    name: z.string({
        invalid_type_error: 'Faculty name must be a string',
    }),
  }),
})