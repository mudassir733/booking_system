// Used for operational errors that can be handled gracefully
export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(statusCode: number, message: string, isOperational = true) {
        super(message);

        this.statusCode = statusCode;
        this.isOperational = isOperational;

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        Error.captureStackTrace(this, this.constructor);
    }
}


// Common API Error factory methods

export class ApiErrorFactory {
    static badRequest(message: string): ApiError {
        return new ApiError(400, message);
    }

    static unauthorized(message: string = 'Unauthorized'): ApiError {
        return new ApiError(401, message);
    }

    static forbidden(message: string = 'Forbidden'): ApiError {
        return new ApiError(403, message);
    }

    static notFound(message: string = 'Resource not found'): ApiError {
        return new ApiError(404, message);
    }

    static conflict(message: string): ApiError {
        return new ApiError(409, message);
    }

    static internalError(message: string = 'Internal server error'): ApiError {
        return new ApiError(500, message, false);
    }

    static validationError(message: string): ApiError {
        return new ApiError(422, message);
    }
}
