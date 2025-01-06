import AppError from '../../errors/AppError'
import { DepartmentModel } from '../academicDepartment/department.model'
import { FacultyModel } from '../academicFaculty/faculty.modal'
import { CourseModel } from '../Course/course.model'
import { FacultyMember } from '../FacultyMember/FacultyMember.model'
import { SemesterRegistrationModel } from '../semesterRegistration/semesterRegistration.model'
import { TOfferedCourse } from './offeredCourse.interface'
import httpStatus from 'http-status'
import { OfferedCourseModel } from './offeredCourse.model'
import { hasTimeConflict } from './offeredCourse.utils'
import QueryBuilder from '../../builder/QueryBuilder'

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload

  /**
   * Step 1: check if the semester registration id is exists!
   * Step 2: check if the academic faculty id is exists!
   * Step 3: check if the academic department id is exists!
   * Step 4: check if the course id is exists!
   * Step 5: check if the faculty id is exists!
   * Step 6: check if the department is belong to the  faculty
   * Step 7: check if the same offered course same section in same registered semester exists
   * Step 8: get the schedules of the faculties
   * Step 9: check if the faculty is available at that time. If not then throw error
   * Step 10: create the offered course
   */

  //   Step 1
  const isSemesterRegistrationExists =
    await SemesterRegistrationModel.findById(semesterRegistration)

  if (!isSemesterRegistrationExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Semester registration not found')
  }

  // step 2
  const academicSemester = isSemesterRegistrationExists.academicSemester

  const isAcademicFacultyExists = await FacultyModel.findById(academicFaculty)

  if (!isAcademicFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic faculty not found')
  }

  // step 3
  const isAcademicDepartmentExists =
    await DepartmentModel.findById(academicDepartment)

  if (!isAcademicDepartmentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Academic department not found')
  }

  // step 4
  const isCourseExists = await CourseModel.findById(course)

  if (!isCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Course not found')
  }

  // step 5
  const isFacultyExists = await FacultyMember.findById(faculty)

  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found')
  }

  // step 6
  const isDepartmentBelongToFaculty = await DepartmentModel.findOne({
    _id: academicDepartment,
    academicFaculty,
  })

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Department does not belong to the faculty',
    )
  }

  // step 7
  const isSameOfferedCourseExists = await OfferedCourseModel.findOne({
    semesterRegistration,
    course,
    section,
  })

  if (isSameOfferedCourseExists) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Same offered course with same section already exists',
    )
  }

  // step 8
  const assignedSchedules = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime')

  const newSchedule = {
    days,
    startTime,
    endTime,
  }

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This faculty is not available at that time ! Choose other time or day',
    )
  }

  const result = await OfferedCourseModel.create({
    ...payload,
    academicSemester,
  })

  return result
}

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(OfferedCourseModel.find(), query)
    .filter()
    .sort()
    .pagination()
    .fields()

  const result = await offeredCourseQuery.modelQuery

  return result
}

const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourseModel.findById(id)

  return result
}

const updatedOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  /**
   * Step 1: check if the offered course exists
   * Step 2: check if the faculty exists
   * Step 3: check if the semester registration status is upcoming
   * Step 4: check if the faculty is available at that time. If not then throw error
   * Step 5: update the offered course
   */
  const { faculty, days, startTime, endTime } = payload

  const isOfferedCourseExists = await OfferedCourseModel.findById(id)

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered course not found !')
  }

  const isFacultyExists = await FacultyMember.findById(faculty)

  if (!isFacultyExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Faculty not found !')
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration
  // Checking the status of the semester registration
  const semesterRegistrationStatus =
    await SemesterRegistrationModel.findById(semesterRegistration)

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `You can not update this offered course as it is ${semesterRegistrationStatus?.status}`,
    )
  }

  // Checking the faculty availability
  const assignedSchedules = await OfferedCourseModel.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime')

  const newSchedule = {
    days,
    startTime,
    endTime,
  }

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      httpStatus.CONFLICT,
      'This faculty is not available at that time ! Choose other time or day',
    )
  }

  const result = await OfferedCourseModel.findByIdAndUpdate(id, payload, {
    new: true,
  })

  return result
}

const deleteOfferedCourseFromDB = async (id: string) => {
  /**
   * Step 1: check if the offered course exists
   * Step 2: check if the semester registration status is upcoming
   * Step 3: delete the offered course
   */
  const isOfferedCourseExists = await OfferedCourseModel.findById(id)

  if (!isOfferedCourseExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Offered Course not found')
  }

  const semesterRegistration = isOfferedCourseExists.semesterRegistration

  const semesterRegistrationStatus =
    await SemesterRegistrationModel.findById(semesterRegistration).select('status')

  if (semesterRegistrationStatus?.status !== 'UPCOMING') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Offered course can not update ! because the semester ${semesterRegistrationStatus}`,
    )
  };

  const result = await OfferedCourseModel.findByIdAndDelete(id);

  return result;
};

export const OfferedCourseServices = {
    createOfferedCourseIntoDB,
    getAllOfferedCoursesFromDB,
    getSingleOfferedCourseFromDB,
    updatedOfferedCourseIntoDB,
    deleteOfferedCourseFromDB,
};
