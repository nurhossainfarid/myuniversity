import { months, semesterCode, semesterName } from './semester.constant'
import { TAcademicSemester } from './semester.interface'
import { model, Schema } from 'mongoose'

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      required: true,
      enum: semesterName,
    },
    year: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      enum: semesterCode,
    },
    startMonth: {
      type: String,
      required: true,
      enum: months,
    },
    endMonth: {
      type: String,
      required: true,
      enum: months,
    },
  },
  {
    timestamps: true,
  },
)

academicSemesterSchema.pre('save', async function(next) {
  const isSemesterExist = await SemesterModel.findOne({
    name: this.name,
    year: this.year
  })

  if (isSemesterExist) {
    throw new Error('Semester is already exist')
  }

  next();
})

export const SemesterModel = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
)
