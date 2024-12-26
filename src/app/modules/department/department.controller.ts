import { Request, Response } from 'express'
import { DepartmentServices } from './department.service'
import sendResponse from '../../utils/sendResponse'
import catchAsync from '../../utils/catchAsync'

const createDepartment = catchAsync(async (req: Request, res: Response) => {
  const result = await DepartmentServices.createDepartmentIntoDB(req.body)

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Department is created successfully',
    data: result,
  })
})

const getAllDepartment = catchAsync(async (req: Request, res: Response) => {
  const result = await DepartmentServices.getAllDepartmentFromDB()

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Departments are retrieved successfully',
    data: result,
  })
})

const getSingleDepartment = catchAsync(async (req: Request, res: Response) => {
  const { departmentId } = req.params
  const result = await DepartmentServices.getSingleDepartmentFromDB(departmentId)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Department is retrieved successfully',
    data: result,
  })
})

const updateDepartment = catchAsync(async (req: Request, res: Response) => {
  const { departmentId } = req.params
  const result = await DepartmentServices.updateDepartmentIntoDB(
    departmentId,
    req.body,
  )

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Department is updated successfully',
    data: result,
  })
})

export const DepartmentController = {
  createDepartment,
  getAllDepartment,
  getSingleDepartment,
  updateDepartment,
}
