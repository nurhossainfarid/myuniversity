import { z } from 'zod'

const PreRequisiteCoursesValidationSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(),
})

const CreateCourseValidationSchema = z.object({
  body: z.object({
    title: z.string(),
    prefix: z.string(),
    code: z.number(),
    credits: z.number(),
    isDeleted: z.boolean().optional(),
    preRequisiteCourses: z
      .array(PreRequisiteCoursesValidationSchema)
      .optional(),
  }),
})

const UpdateCourseValidationSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    prefix: z.string().optional(),
    code: z.number().optional(),
    credits: z.number().optional(),
    isDeleted: z.boolean().optional(),
    preRequisiteCourses: z
      .array(PreRequisiteCoursesValidationSchema)
      .optional(),
  }),
})

const courseFacultiesValidationSchema = z.object({
  body: z.object({
    course: z.string(),
    faculties: z.array(z.string()),
  })
})


export const CourseValidation = {
  CreateCourseValidationSchema,
  UpdateCourseValidationSchema,
  courseFacultiesValidationSchema,
}