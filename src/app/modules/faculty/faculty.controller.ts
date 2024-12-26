import { Request, Response } from 'express'
import catchAsync from '../../utils/catchAsync'
import { FacultyServices } from './faculty.service'
import sendResponse from '../../utils/sendResponse'

const createFaculty = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyServices.createFacultyIntoDB(req.body)

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Faculty is created successfully',
    data: result,
  })
})

const getAllFaculty = catchAsync(async (req: Request, res: Response) => {
  const result = await FacultyServices.getAllFacultyFromDB()

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculties are retrieved successfully',
    data: result,
  })
})

const getSingleFaculty = catchAsync(async (req: Request, res: Response) => {
  const { facultyId } = req.params
  const result = await FacultyServices.getSingleFacultyFromDB(facultyId)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty is retrieved successfully',
    data: result,
  })
})

const updateFaculty = catchAsync(async (req: Request, res: Response) => {
    const { facultyId } = req.params
    const result = await FacultyServices.updateFacultyIntoDB(facultyId, req.body);
    
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Faculty is updated successfully',
        data: result,
    })
})

export const FacultyController = {
    createFaculty,
    getAllFaculty,
    getSingleFaculty,
    updateFaculty,
}
