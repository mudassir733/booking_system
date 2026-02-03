import { Response } from 'express';

/**
 * Custom API Response Interface
 */
export interface ApiResponseData<T = any> {
    success: boolean;
    statusCode: number;
    message?: string;
    data?: T;
    error?: string;
}

/**
 * Send a success response
 * @param res 
 * @param statusCode 
 * @param data 
 * @param message 
 */
export const sendSuccessResponse = <T = any>(
    res: Response,
    statusCode: number,
    data: T,
    message?: string
): Response => {
    const response: ApiResponseData<T> = {
        success: true,
        statusCode,
        data,
        ...(message && { message }),
    };

    return res.status(statusCode).json(response);
};

/**
 * Send an error response
 * @param res 
 * @param statusCode 
 * @param error
 * @param message 
 */
export const sendErrorResponse = (
    res: Response,
    statusCode: number,
    error: string,
    message?: string
): Response => {
    const response: ApiResponseData = {
        success: false,
        statusCode,
        error,
        ...(message && { message }),
    };

    return res.status(statusCode).json(response);
};
