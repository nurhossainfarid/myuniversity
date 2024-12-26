import { TAcademicSemesterNameCodeMapper, TMonths, TSemesterCode, TSemesterName } from './semester.interface'

export const semesterName: TSemesterName[] = ['Spring', 'Summer', 'Fall']
export const semesterCode: TSemesterCode[] = ['01', '02', '03']
export const months: TMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const academicSemesterNameCodeMapper: TAcademicSemesterNameCodeMapper = {
  Spring: '01',
  Summer: '02',
  Fall: '03'
}
