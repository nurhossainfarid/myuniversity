import { StudentModel } from './student.model'

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  const queryObj = { ...query }

  const studentSearchTerm = [
    'email',
    'name.firstName',
    'name.middleName',
    'name.lastName',
    'presentAddress',
  ]
  let searchTerm = ''

  if (query?.searchTerm) {
    searchTerm = query.searchTerm as string
  }

  // search query
  const searchQuery = StudentModel.find({
    $or: studentSearchTerm.map(field => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  })

  // filter query
  const excludedFields = ['searchTerm', 'sort', 'limit', 'page', 'fields']
  excludedFields.forEach(el => delete queryObj[el])

  const filterQuery = searchQuery.find(queryObj)

  // sort query
  let sort = '-createdAt' // SET DEFAULT VALUE

  // IF sort  IS GIVEN SET IT

  if (query.sort) {
    sort = query.sort as string
  }

  const sortQuery = filterQuery.sort(sort)

  // limit
  let limit = 1

  if (query?.limit) {
    limit = query.limit as number
  }

  const limitQuery = sortQuery.limit(limit)

  //   pagination
  let page = 1
  let skip = 0

  if (query?.page) {
    page = query.page as number
    skip = (page - 1) * limit
  }

  const paginationQuery = limitQuery.skip(skip)

  //   field query
  let fields = '-__v'

  if (query?.fields) {
    fields = String(query?.fields as string).split(',').join(' ');
  }

  const fieldQuery = await paginationQuery.select(fields)

  return fieldQuery
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
