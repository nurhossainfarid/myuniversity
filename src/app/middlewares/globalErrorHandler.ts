/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { TErrorSource } from '../interface/errors'
import { ZodError, ZodIssue } from 'zod'
import handleZodError from '../errors/handleZodError'
import handleValidationError from '../errors/handleValidationError'
import handleCastError from '../errors/handleCastError'
import handleDuplicateError from '../errors/handleDuplicateError'
import AppError from '../errors/AppError'

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next): any => {
  let statusCode = 500
  let message = 'Something went wrong!'
  let errorSource: TErrorSource = [
    {
      path: '',
      message: 'Something went wrong!',
    },
  ]


  // check error from zod
  if (err instanceof ZodError) {
    const simplifyError = handleZodError(err);
    statusCode = simplifyError.statusCode
    message = simplifyError.message
    errorSource = simplifyError.errorSource
  } else if (err?.name === "ValidationError") {
    const simplifyError = handleValidationError(err);
    statusCode = simplifyError.statusCode
    message = simplifyError.message
    errorSource = simplifyError.errorSource
  } else if (err?.name === "CastError") {
    const simplifyError = handleCastError(err);
    statusCode = simplifyError.statusCode
    message = simplifyError.message
    errorSource = simplifyError.errorSource
  } else if (err?.code === 11000) {
    const simplifyError = handleDuplicateError(err);
    statusCode = simplifyError.statusCode
    message = simplifyError.message
    errorSource = simplifyError.errorSource
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode
    message = err?.message
    errorSource = [{
      path: '',
      message: err.message,
    }]
  } else if (err instanceof Error) {
    message = err?.message
    errorSource = [{
      path: '',
      message: err.message,
    }]
  }

  return res.status(500).json({
    success: false,
    message,
    errorSource,
    stack: process.env.NODE_ENV === 'development' ? err.stack : null,
  })
}

export default globalErrorHandler
