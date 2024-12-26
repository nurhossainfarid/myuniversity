import { model, Schema } from 'mongoose'
import { TFaculty } from './faculty.interface'

const facultySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Faculty name is required'],
      unique: true,
    },
  },
  {
    timestamps: true,
  },
)

export const FacultyModel = model<TFaculty>('Faculty', facultySchema);
