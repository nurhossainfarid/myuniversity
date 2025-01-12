import express from 'express'
import { UserController } from './user.controller'
import validateRequest from '../../middlewares/validateRequest'
import { createStudentValidation } from '../student/student.validation'
import { createFacultyValidationSchema } from '../FacultyMember/FacultyMember.validation'
import auth from '../../middlewares/auth'
import { USER_ROLE } from './user.constant'
import { createAdminValidationSchema } from '../admin/admin.validation'

const router = express.Router()

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  validateRequest(createStudentValidation),
  UserController.createStudent,
)
router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  validateRequest(createFacultyValidationSchema),
  UserController.createFaculty,
)

router.post(
  '/create-admin',
  validateRequest(createAdminValidationSchema),
  UserController.createAdmin,
)

export const UserRoutes = router
