import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../utils/Response";
import { User, UserInterface } from "../models/user.model";
import { StatusCode } from "../utils/StatusCode";
import { JWT_DECODE } from "../utils/Jwt";

export interface WithUserRequest extends Request { 
    user?: UserInterface 
}

export const getToken = async (req: WithUserRequest, res: Response, next: NextFunction): Promise<void> => {
    try {

        const cookie = req.cookies.CLA;
        if (!cookie) {
            const error = new Error();
            next(
                ResponseHandler.error(
                    res,
                    "You are not authorize access this route!",
                    [
                        {
                            path:[
                                "JWT",
                                "Cookie"
                            ],
                            message:"invalie cookie!"
                        }
                    ],
                    StatusCode.unexpected,
                    error.stack
                )
            )
        }

        const value = JWT_DECODE(cookie)
        if (!value) {
            const error = new Error();
            next(
                ResponseHandler.error(
                    res,
                    "Token can't verify!",
                    [
                        {
                            path:[
                                "JWT",
                                "Verify"
                            ],
                            message:"Problem on the token"
                        }
                    ],
                    StatusCode.unexpected,
                    error.stack
                )
            )
        }

        const user = await User.findById(value.id);
        if (!user) {
            const error = new Error();
            next(
                ResponseHandler.error(
                    res,
                    "You don't have any account!",
                    [
                        {
                            path:[
                                "Account",
                                "Verify Account Exist or Not"
                            ],
                            message:"Accout not exist!"
                        }
                    ],
                    StatusCode.notFound,
                    error.stack
                )
            )
        }

        req.user = user!;
        next();

    } catch (error) {
        if (error instanceof Error) {
            console.log(error)
            next(
                ResponseHandler.error(
                    res,
                    "Problem on the auth midleware",
                    [
                        {
                            path:[
                                "JWT",
                                "Cookie"
                            ],
                            message:"Facing problem to geting the cookie"
                        }
                    ],
                    StatusCode.unexpected,
                    error.stack
                )
            )
        }
    }
} 

export const isTeacher = async (req: WithUserRequest, res: Response, next: NextFunction) => {
    const isValid = req.user?.role === "teacher";
    if ( !isValid ) {
        const error = new Error();
        next(ResponseHandler.error(
            res,
            "You are not a teacher to access this route!",
            [
                {
                    path: [
                        "Teacher",
                        "Messing"
                    ],
                    message: "not a teacher"
                }
            ],
            StatusCode.noContent,
            error.stack
        ))
    }
    next()
}