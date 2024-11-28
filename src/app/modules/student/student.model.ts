import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

import {
  TStudentName,
  TGuardian,
  TLocalGuardian,
  TStudent
} from './student.interface'
import config from '../../config';

// student name Schema
const nameSchema = new Schema<TStudentName>({
  firstName: {
    type: String,
    trim: true,
    required: [true, 'First Name is required'],
    maxLength: [20, "First name less than 20 characters"],
  },
  middleName: {
    type: String
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is required'],
    trim: true,
  },
})

// student guardian Schema
const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Father Name is required'],
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father Occupation is required'],
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father contact no is required'],
  },
  motherName: {
    type: String,
    required: [true, 'Mother Name is required'],
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother occupation is required'],
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother contact no is required'],
  },
})

// Local Guardian Schema
const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'Local Guardian Name is required'],
  },
  occupation: {
    type: String,
    required: [true, 'Local Guardian occupation is required'],
  },
  contactNo: {
    type: String,
    required: [true, 'Local Guardian contact no is required'],
  },
  address: {
    type: String,
    required: [true, 'Local Guardian address is required'],
  },
  relationship: {
    type: String,
    required: [true, 'Local Guardian relationship is required'],
  },
})

const studentSchema = new Schema<TStudent>({
  id: {
    type: String,
    required: [true, 'Id is required and unique'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    maxlength: [20, 'Password can not be more than 20 characters'],
  },
  name: {
    type: nameSchema,
    required: [true, 'Name is required'],
  },
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'others'],
      message: '{VALUE} is not valid',
    },
    required: [true, 'gender is required'],
  },
  dateOfBirth: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true
  },
  contactNo: {
    type: String,
    required: [true, 'Contact no is required'],
  },
  emergencyContactNo: {
    type: String,
    required: [true, 'Emergency contact no is required'],
  },
  bloodGroup: {
    type: String,
    enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message: '{VALUE} is not valid'
    }
  },
  presentAddress: {
    type: String,
    required: [true, 'Present address is required'],
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent address is required'],
  },
  guardian: {
    type: guardianSchema, 
    required: [true, "Guardian is required"]
  },
  localGuardian: {
    type: localGuardianSchema,
    required: [true, "Local Guardian is required"]
  },
  profileImg: String,
  isActive: {
    type: String,
    enum: {
        values: ['active', 'blocked'],
        message: '{VALUE} is not valid'
    },
    default: 'active'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  toJSON: {
    virtuals: true
  }
})

// Mongoose virtual
studentSchema.virtual('fullName').get(function() {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`
})

// pre save middleware/hook document middleware
studentSchema.pre('save', async function(next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  // Hashing password and save into DB
  user.password = await bcrypt.hash(user.password, Number(config.bcrypt_salt_rounds));
  next();
})

studentSchema.post('save', function(doc, next) {
  doc.password = '';
  next();
})

// Query Middleware
studentSchema.pre('find', async function(next) {
  this.find({isDeleted: {$ne: true}});
  next();
});
studentSchema.pre('findOne', async function(next) {
  this.find({isDeleted: {$ne: true}});
  next();
})

// [ {$match: { isDeleted : {  $ne: : true}}}   ,{ '$match': { id: '123456' } } ]
studentSchema.pre('aggregate', async function(next) {
  this.pipeline().unshift({$match: {isDeleted: {$ne: true}}});
  next();
})

export const StudentModel = model<TStudent>('Student', studentSchema)
