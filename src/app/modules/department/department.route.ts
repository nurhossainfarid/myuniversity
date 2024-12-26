import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { DepartmentController } from './department.controller';
import { createDepartmentValidationSchema, updateDepartmentValidationSchema } from './department.validation';


const router = express.Router();

router.post('/create-department',validateRequest(createDepartmentValidationSchema), DepartmentController.createDepartment);
router.get('/', DepartmentController.getAllDepartment);
router.get('/:departmentId', DepartmentController.getSingleDepartment);
router.patch('/:departmentId',validateRequest(updateDepartmentValidationSchema), DepartmentController.updateDepartment);


export const DepartmentRoutes = router;