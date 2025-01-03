import { model, Schema } from 'mongoose'
import { TDepartment } from './department.interface'
import AppError from '../../errors/AppError'

const departmentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      required: [true, 'Faculty is required'],
    },
  },
  {
    timestamps: true,
  },
)

departmentSchema.pre('save', async function (next) {
  const isDepartmentExists = await DepartmentModel.findOne({
    name: this.name,
  })
  if (isDepartmentExists) {
    throw new AppError(404,'This department is already exist')
  }

  next()
})

departmentSchema.pre('findOneAndUpdate', async function(next) {
  const query = this.getQuery();
  const isDepartmentExist = await DepartmentModel.findOne(query);

  if (!isDepartmentExist) {
    throw new AppError(404,'This department does not exist!')
  }

  next()
})

export const DepartmentModel = model<TDepartment>('Department', departmentSchema)
