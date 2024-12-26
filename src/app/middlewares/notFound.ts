/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";

const NotFound = (req: Request, res: Response): any => {
    return res.status(404).json({
        success: false,
        message: 'Route not found',
        error: ''
    })
}

export default NotFound;