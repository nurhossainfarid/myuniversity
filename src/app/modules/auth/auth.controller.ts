import config from '../../config'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AuthServices } from './auth.service'
import httpStatus from 'http-status'

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body)
  const { refreshToken, accessToken, needsPasswordChange } = result

  res.cookie('refreshToken', refreshToken, {
    secure: config.node_env === 'production',
    httpOnly: true,
  })

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged is successfully!',
    data: { accessToken, needsPasswordChange },
  })
})

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body

  const result = await AuthServices.changePassword(req.user, passwordData)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password is changed successfully!',
    data: result,
  })
})

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies

  const result = await AuthServices.refreshToken(refreshToken)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  })
})

const forgetPassword = catchAsync(async (req, res) => {
  const userId = req.body.id
  const result = await AuthServices.forgetPassword(userId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset link sent successfully!',
    data: result,
  })
})

export const AuthController = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
}
