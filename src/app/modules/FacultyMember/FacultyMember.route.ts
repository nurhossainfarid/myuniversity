import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { FacultyControllers } from './FacultyMember.controller';
import { updateFacultyValidationSchema } from './FacultyMember.validation';

const router = express.Router();

router.get('/:id', FacultyControllers.getSingleFaculty);

router.patch(
  '/:id',
  validateRequest(updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

router.delete('/:id', FacultyControllers.deleteFaculty);

router.get('/', FacultyControllers.getAllFaculties);

export const FacultyMembersRoutes = router;