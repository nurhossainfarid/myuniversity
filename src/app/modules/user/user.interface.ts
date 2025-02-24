import { Model } from 'mongoose'
import { USER_ROLE } from './user.constant'

export type TUser = {
  id: string
  email: string
  password: string
  needsPasswordChange: boolean
  passwordChangedAt: Date
  role: 'student' | 'faculty' | 'admin'
  status: 'in-progress' | 'blocked'
  isDeleted: boolean
}

export interface UserVerifyModel extends Model<TUser> {
  // instance method for checking if the user is exist
  isUserExistsById(id: string): Promise<TUser>

  //   instance method for checking if password are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>

  isJWTIssuedBeforePasswordChange(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
  ): boolean
}

export type TUserRole = keyof typeof USER_ROLE;
