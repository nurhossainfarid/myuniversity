import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyController } from './faculty.controller';
import { createFacultyValidationSchema, updateFacultyValidationSchema } from './faculty.validation';


const router = express.Router();

router.post('/create-faculty',validateRequest(createFacultyValidationSchema), FacultyController.createFaculty);
router.get('/', FacultyController.getAllFaculty);
router.get('/:facultyId', FacultyController.getSingleFaculty);
router.patch('/:facultyId',validateRequest(updateFacultyValidationSchema), FacultyController.updateFaculty);


export const FacultyRoutes = router;