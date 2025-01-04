import mongoose from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import { CourseSearchableFields } from './course.constant'
import { TCourse, TCourseFaculty } from './course.interface'
import { CourseFacultyModel, CourseModel } from './course.model'
import AppError from '../../errors/AppError'
import httpStatus from 'http-status'

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await CourseModel.create(payload)
  return result
}

const getCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(CourseModel.find(), query)
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .pagination()
    .fields()

  const result = await courseQuery.modelQuery
  return result
}

const getSingleCourseFromDB = async (id: string) => {
  const result = await CourseModel.findById(id).populate(
    'preRequisiteCourses.course',
  )
  return result
}

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload

  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    // step 1: update basic info
    const updatedBasicCourseInfo = await CourseModel.findByIdAndUpdate(
      id,
      courseRemainingData,
      {
        new: true,
        runValidators: true,
        session,
      },
    )

    if (!updatedBasicCourseInfo) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!')
    }

    if (preRequisiteCourses && preRequisiteCourses.length) {
      const deletedPreRequisites = preRequisiteCourses
        .filter(el => el.course && el.isDeleted)
        .map(el => el.course)

      const deletedPreRequisiteCourses = await CourseModel.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: {
              course: { $in: deletedPreRequisites },
            },
          },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          session,
        },
      )

      if (!deletedPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!')
      }

      // filter out the new course fields
      const newPreRequisites = preRequisiteCourses.filter(
        el => el.course && !el.isDeleted,
      )

      const newPreRequisiteCourses = await CourseModel.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      )

      if (!newPreRequisiteCourses) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!')
      }
    }

    await session.commitTransaction()
    await session.endSession()

    const result = await CourseModel.findById(id).populate(
      'preRequisiteCourses.course',
    )

    return result
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to update course!')
  }
}

const deleteCourseFromDB = async (id: string) => {
  const result = await CourseModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  )
  return result
}

const assignFacultiesInCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: {
        faculties: {
          $each: payload,
        },
      },
    },
    {
      new: true,
      upsert: true,
    },
  )

  return result
}

const removeFacultiesFromCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFacultyModel.findByIdAndUpdate(
    id,
    {
      $pull: {
        faculties: {
          $in: payload,
        },
      },
    },
    {
      new: true,
    },
  )

  return result
}

export const CourseServices = {
  createCourseIntoDB,
  getCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
  assignFacultiesInCourseIntoDB,
  removeFacultiesFromCourseIntoDB,
}
