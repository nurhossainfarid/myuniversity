import express from 'express'
import validateRequest from '../../middlewares/validateRequest'
import { CourseController } from './course.controller'
import { CourseValidation } from './course.validation'

const router = express.Router()

router.post(
  '/create-course',
  validateRequest(CourseValidation.CreateCourseValidationSchema),
  CourseController.createCourse,
)

router.get('/:id', CourseController.getSingleCourse)

router.patch(
  '/:id',
  validateRequest(CourseValidation.UpdateCourseValidationSchema),
  CourseController.updateCourse,
);

router.delete('/:id', CourseController.deleteCourse)

router.get('/', CourseController.getAllCourses)

router.put(
  '/:courseId/assign-faculties',
  validateRequest(CourseValidation.courseFacultiesValidationSchema),
  CourseController.assignFacultiesInCourse,
)

router.delete(
  '/:courseId/remove-faculties',
  validateRequest(CourseValidation.courseFacultiesValidationSchema),
  CourseController.removeFacultiesFromCourse,
)

export const CourseRoutes = router
