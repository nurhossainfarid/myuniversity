import { Request, Response } from 'express'
import { StudentServices } from './student.service'
import studentValidationSchema from './student.validation'
// import studentValidationSchema from './student.joi.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    const studentData = req.body

    const zodParsedData = studentValidationSchema.parse(studentData)

    // const {error, value} = studentValidationSchema.validate(studentData);
    const result = await StudentServices.createStudentIntoDB(zodParsedData)

    res.status(200).json({
      success: true,
      message: 'Student is created successfully',
      data: result,
    })
  } catch (error: any) {
    if (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Something went wrong',
        error: error,
      })
    }
  }
}

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB()

    res.status(200).json({
      success: true,
      message: 'Students are retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    if (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Something went wrong',
        error: error,
      })
    }
  }
}

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const result = await StudentServices.getSingleStudentFromDB(id)

    res.status(200).json({
      success: true,
      message: 'Student is retrieved successfully',
      data: result,
    });
  } catch (error: any) {
    if (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Something went wrong',
        error: error,
      })
    }
  }
}

const deleteStudent = async (req: Request, res: Response) => {
  try {
    const {id} = req.params;
    const result = await StudentServices.deleteStudentFromDB(id)

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: result,
    });
  } catch (error: any) {
    if (error) {
      res.status(500).json({
        success: false,
        message: error.message || 'Something went wrong',
        error: error,
      })
    }
  }
}



export const StudentController = {
  createStudent,
  getAllStudents,
  getSingleStudent,
  deleteStudent
}
