import config from '../config'
import AppError from '../errors/AppError'
import { TUserRole } from '../modules/user/user.interface'
import catchAsync from '../utils/catchAsync'
import httpStatus from 'http-status'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { UserModel } from '../modules/user/user.model'

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!')
    }

    // checking if the token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload

    const { role, userId, iat } = decoded

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

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized')
    }

    req.user = decoded as JwtPayload
    next()
  })
}

export default auth;
