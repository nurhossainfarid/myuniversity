import { Request, Response } from 'express'
import { SemesterServices } from './semester.service'
import sendResponse from '../../utils/sendResponse'
import catchAsync from '../../utils/catchAsync'

const createSemester = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SemesterServices.createSemesterIntoDB(
      req.body,
    )

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Academic Semester is created successfully',
      data: result,
    })
  },
);

const getAllSemester = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SemesterServices.getAllSemesterFromDB();

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Semester are retrieved successfully',
      data: result,
    })
  },
);

const getSingleSemester = catchAsync(
  async (req: Request, res: Response) => {
    const { semesterId } = req.params;
    const result = await SemesterServices.getSingleSemesterFromDB(
      semesterId
    )

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Semester is retrieved successfully',
      data: result,
    })
  },
)
const updateSemester = catchAsync(
  async (req: Request, res: Response) => {
    const { semesterId } = req.params;

    const result = await SemesterServices.updateSemesterIntoDB(semesterId, req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: 'Semester is updated successfully',
      data: result,
    })
  },
)

export const SemesterController = {
  createSemester,
  getAllSemester,
  getSingleSemester,
  updateSemester,
}
