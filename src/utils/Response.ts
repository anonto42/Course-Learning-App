import { Response } from 'express';

interface ErrorMessage {
  path: string[];
  message: string;
}

class ResponseHandler {
    
    static success(
        res: Response,
        message: string,
        statusCode: number = 200,
        data: object = {}
    ): Response {
        return res.status(statusCode).json({
            success: true,
            statusCode,
            message,
            data,
        });
    }

    static error(
        res: Response,
        message: string,
        errorMessages: ErrorMessage[] = [],
        statusCode: number = 400,
        stack: string = ''
    ): Response {
        const errorResponse: any = {
            success: false,
            message,
            errorMessages,
        };

        if (process.env.NODE_ENV === 'development') {
            errorResponse.stack = stack;
        }

        return res.status(statusCode).json(errorResponse);
    }
}

export default ResponseHandler;
