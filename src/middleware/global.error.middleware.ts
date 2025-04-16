import { Request, Response, NextFunction,} from "express"
import { StatusCode } from "../utils/StatusCode";

interface ErrorResponse extends Error{ 
    statusCode: number, 
    status?: string,
    path?: string,
    stack?: string
}

export function GlobalError (
    error: ErrorResponse, 
    req:Request, 
    res:Response, 
    next:NextFunction
){
    error.statusCode = error.statusCode || StatusCode.unexpected;
    error.status = error.status || "error"
    res
    .status(error.statusCode)
    .json(
        {
            seccess: false,
            message: error.message || "Something went wrong",
            errorMessage: [{
                path: error.path? [error.path] : [],
                message: error.message
            }],
            stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
        }
    )
}