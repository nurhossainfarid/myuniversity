/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose'
import config from '../../config'
import { TAcademicSemester } from '../academicSemester/semester.interface'
import { SemesterModel } from '../academicSemester/semester.model'
import { TStudent } from '../student/student.interface'
import { StudentModel } from '../student/student.model'
import { TUser } from './user.interface'
import { UserModel } from './user.model'
import { generateStudentId } from './user.utils'
import AppError from '../../errors/AppError'
import status from 'http-status'

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  const userData: Partial<TUser> = {}

  userData.password = password || (config.default_pass as string)

  // set student role
  userData.role = 'student'

  // semester find by id
  const admissionSemester = await SemesterModel.findById(
    payload.admissionSemester,
  )

  const session = await mongoose.startSession()

  try {
    // start transaction session
    session.startTransaction()

    // set user id
    userData.id = await generateStudentId(
      admissionSemester as TAcademicSemester,
    )

    // create user
    const newUser = await UserModel.create([userData], { session })

    if (!newUser.length) {
      throw new AppError(status.BAD_REQUEST, 'Failed to create user');
    }

    payload.id = newUser[0].id
    payload.user = newUser[0]._id

    const newStudent = await StudentModel.create([payload], { session })

    if (!newStudent.length) {
      throw new AppError(status.BAD_REQUEST, 'Failed to create Student');
    }

    await session.commitTransaction();
    await session.endSession();

    return newStudent
  } catch (error: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(status.BAD_REQUEST, error.message);
  }
};

export const UserServices = {
  createStudentIntoDB,
}
