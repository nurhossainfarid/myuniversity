import express from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createStudentValidation } from '../student/student.validation';
import { createFacultyValidationSchema } from '../FacultyMember/FacultyMember.validation';

const router = express.Router();

router.post('/create-student', validateRequest(createStudentValidation), UserController.createStudent)
router.post('/create-faculty', validateRequest(createFacultyValidationSchema), UserController.createStudent)

export const UserRoutes = router;