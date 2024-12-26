import express from 'express';
import { SemesterController } from './semester.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createSemesterValidationSchema, updateSemesterValidationSchema } from './semester.validation';



const router = express.Router();

router.post('/create-semester',validateRequest(createSemesterValidationSchema), SemesterController.createSemester);
router.get('/', SemesterController.getAllSemester);
router.get('/:semesterId', SemesterController.getSingleSemester);
router.patch('/:semesterId',validateRequest(updateSemesterValidationSchema), SemesterController.updateSemester);


export const SemesterRoutes = router;