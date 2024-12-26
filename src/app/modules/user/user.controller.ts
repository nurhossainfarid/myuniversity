import { NextFunction, Request, Response } from "express"
import { UserServices } from "./user.service"
import sendResponse from "../../utils/sendResponse"

const createStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {password, student: studentData} = req.body

    // const zodParsedData = studentValidationSchema.parse(studentData)

    // // const {error, value} = studentValidationSchema.validate(studentData);
    // const result = await StudentServices.createStudentIntoDB(zodParsedData)

    const result = await UserServices.createStudentIntoDB(password, studentData)

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Student is created successfully',
      data: result,
    })
  } catch (error) {
    if (error) {
      next(error)
    }
  }
}

export const UserController = {
    createStudent
}
