/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { StudentServices } from './student.service'
import sendResponse from '../../utils/sendResponse'
import catchAsync from '../../utils/catchAsync'



const getAllStudents = catchAsync(
  async (req: Request, res: Response) => {
    const result = await StudentServices.getAllStudentsFromDB()

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Students are retrieved successfully',
      data: result,
    })
  },
)

const getSingleStudent = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await StudentServices.getSingleStudentFromDB(id)

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Student is retrieved successfully',
      data: result,
    })
  },
)

const deleteStudent = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await StudentServices.deleteStudentFromDB(id)

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Student deleted successfully',
      data: result,
    })
  },
)

export const StudentController = {
  getAllStudents,
  getSingleStudent,
  deleteStudent,
}
