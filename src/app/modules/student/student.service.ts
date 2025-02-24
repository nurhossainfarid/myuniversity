import QueryBuilder from '../../builder/QueryBuilder'
import { StudentModel } from './student.model'

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {

  const studentSearchTerm = [
    'email',
    'name.firstName',
    'name.middleName',
    'name.lastName',
    'presentAddress',
  ]
  // const fieldQuery = await paginationQuery.select(fields)

  const studentQuery = new QueryBuilder(
    StudentModel.find()
      .populate('admissionSemester')
      .populate('academicDepartment'),
    query,
  )
    .search(studentSearchTerm)
    .filter()
    .sort()
    .pagination()
    .fields()

  const result = await studentQuery.modelQuery

  return result
}

const getSingleStudentFromDB = async (id: string) => {
  // const result = await StudentModel.findOne({id});

  const result = await StudentModel.aggregate([{ $match: { id } }])
  return result
}

const deleteStudentFromDB = async (id: string) => {
  const result = await StudentModel.updateOne({ id }, { isDeleted: true })
  return result
}

export const StudentServices = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
}
