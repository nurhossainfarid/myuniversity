import { academicSemesterNameCodeMapper } from './semester.constant'
import { TAcademicSemester } from './semester.interface'
import { SemesterModel } from './semester.model'

const createSemesterIntoDB = async (payload: TAcademicSemester) => {

  if (academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid semester code')
  }

  // const isSemesterExist = await SemesterModel.findOne({name: payload.name, year: payload.year});

  // if (isSemesterExist) {
  //   throw new Error('Semester already exist')
  // }

  const result = await SemesterModel.create(payload)
  return result
}

const getAllSemesterFromDB = async () => {
  const result = await SemesterModel.find({})
  return result
}

const getSingleSemesterFromDB = async (id: string) => {
  const result = await SemesterModel.findById(id)
  return result;
}

const updateSemesterIntoDB = async (id: string, payload: Partial<TAcademicSemester>) => {
  if (payload.name && payload.code && academicSemesterNameCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid semester code')
  }

  const result = await SemesterModel.findOneAndUpdate({_id: id}, payload, {new: true});
  return result;
}

export const SemesterServices = {
  createSemesterIntoDB,
  getAllSemesterFromDB,
  getSingleSemesterFromDB,
  updateSemesterIntoDB,
}
