import QueryBuilder from '../../builder/QueryBuilder'
import { CourseSearchableFields } from './course.constant'
import { TCourse } from './course.interface'
import { CourseModel } from './course.model'

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
  const { preRequestiesCourses, ...courseRemainingData } = payload

  const result = await CourseModel.findByIdAndUpdate(id, courseRemainingData, {
    new: true,
    runValidators: true,
  })

  return result
}

const deleteCourseFromDB = async (id: string) => {
  const result = await CourseModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  )
  return result
}

export const CourseServices = {
  createCourseIntoDB,
  getCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
}
