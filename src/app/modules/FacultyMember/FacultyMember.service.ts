/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status'
import mongoose from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../errors/AppError'
import { FacultyMember } from './FacultyMember.model'
import { FacultySearchableFields } from './FacultyMember.constant'
import { UserModel } from '../user/user.model'
import { TFacultyMember } from './FacultyMember.interface'

const getAllFacultiesFromDB = async (query: Record<string, unknown>) => {
  const facultyQuery = new QueryBuilder(
    FacultyMember.find().populate(
      'academicDepartment',
    ),
    query,
  )
    .search(FacultySearchableFields)
    .filter()
    .sort()
    .pagination()
    .fields()

  const result = await facultyQuery.modelQuery
  return result
}

const getSingleFacultyFromDB = async (id: string) => {
  const result = await FacultyMember.findById(id).populate('academicDepartment')

  return result
}

const updateFacultyIntoDB = async (
  id: string,
  payload: Partial<TFacultyMember>,
) => {
  const { name, ...remainingFacultyData } = payload

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData,
  }

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value
    }
  }

  const result = await FacultyMember.findByIdAndUpdate(
    id,
    modifiedUpdatedData,
    {
      new: true,
      runValidators: true,
    },
  )
  return result
}

const deleteFacultyFromDB = async (id: string) => {
  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const deletedFaculty = await FacultyMember.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    )

    if (!deletedFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete faculty')
    }

    // get user _id from deletedFaculty
    const userId = deletedFaculty.user

    const deletedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    )

    if (!deletedUser) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete user')
    }

    await session.commitTransaction()
    await session.endSession()

    return deletedFaculty
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

export const FacultyServices = {
  getAllFacultiesFromDB,
  getSingleFacultyFromDB,
  updateFacultyIntoDB,
  deleteFacultyFromDB,
}
