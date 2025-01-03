import { Types } from "mongoose"

// name type
export type TStudentName = {
  firstName: string
  middleName: string
  lastName: string
}

// Guardian type
export type TGuardian = {
  fatherName: string
  fatherOccupation: string
  fatherContactNo: string
  motherName: string
  motherOccupation: string
  motherContactNo: string
}

// Local Guardian type
export type TLocalGuardian = {
  name: string
  occupation: string
  contactNo: string
  address: string
  relationship: string
}

export type TStudent = {
  id: string;
  user: Types.ObjectId;
  name: TStudentName;
  gender: 'male' | 'female' | 'others';
  dateOfBirth?: string;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImg?: string;
  admissionSemester: Types.ObjectId;
  academicDepartment: Types.ObjectId;
  isDeleted: boolean,
}
