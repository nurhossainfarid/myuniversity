import AppError from '../../errors/AppError'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { UserModel } from '../user/user.model'
import { TLoginUser } from './auth.interface'
import httpStatus from 'http-status'
import { createToken } from './auth.utils'
import config from '../../config'
import { JwtPayload } from 'jsonwebtoken'

const loginUser = async (payload: TLoginUser) => {
  const user = await UserModel.isUserExistsById(payload.id)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!')
  }

  // check the user already deleted
  const isDeleted = user?.isDeleted

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is already deleted!')
  }

  // check the user already blocked
  const userStatus = user?.status
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!')
  }

  // checking if the password is correct
  const isPasswordMatch = await UserModel.isPasswordMatched(
    payload?.password,
    user?.password,
  )

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password do not matched!')
  }

  // create token and sent to the client
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  )

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  )

  return {
    accessToken,
    refreshToken,
    needsPasswordChange: user?.needsPasswordChange,
  }
}

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  // checking if the user is exist
  const user = await UserModel.isUserExistsById(userData.userId)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!')
  }

  // check the user already deleted
  const isDeleted = user?.isDeleted

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is already deleted!')
  }

  // check the user already blocked
  const userStatus = user?.status

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!')
  }

  // checking if the password is correct
  const isPasswordMatch = await UserModel.isPasswordMatched(
    payload.oldPassword,
    user?.password,
  )

  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Password do not matched!')
  }

  // hash new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  )

  await UserModel.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  )

  return null
}

const refreshToken = async (token: string) => {
  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret as string,
  ) as JwtPayload

  const { userId, iat } = decoded

  // checking if the user is exist
  const user = await UserModel.isUserExistsById(userId)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!')
  }

  // check the user already deleted
  const isDeleted = user?.isDeleted
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is already deleted!')
  }

  // check the user already blocked
  const userStatus = user?.status
  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!')
  }

  const isJWTIssued = UserModel.isJWTIssuedBeforePasswordChange(
    user.passwordChangedAt,
    iat as number,
  )

  if (user.passwordChangedAt && isJWTIssued) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized')
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  }

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  )

  return {
    accessToken,
  }
}

const forgetPassword = async (userId: string) => {
  // checking if the user is exist
  const user = await UserModel.isUserExistsById(userId)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!')
  }

  // check the user already deleted
  const isDeleted = user?.isDeleted

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is already deleted!')
  }

  // check the user already blocked
  const userStatus = user?.status

  if (userStatus === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!')
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  }

  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    '10m',
  )

  const resetUILink = `http://localhost:3000?id=${user.id}&token=${resetToken}`
  console.log(resetUILink)
}

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
}
