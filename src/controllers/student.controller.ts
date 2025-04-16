import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../utils/Response";
import { User } from "../models/user.model";
import Bcryptjs from "../utils/Bcryptjs";
import { StatusCode } from "../utils/StatusCode";
import { JWT_SIGN, SignType } from "../utils/Jwt";
import { CookieOptions } from "../utils/Cookie";

export async function Register(req: Request, res: Response, next: NextFunction) {
    try {

        const { name, email, password } = req.body;
        if (!name.trim() || !email.trim() || !password.trim() ) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "You Must provide name, email and password for register!",
                [
                    {
                        path: [
                            "Register",
                            "Messing"
                        ],
                        message: "Messing filds to create account"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        }

        const isUserExist = await User.findOne({email});
        if (isUserExist) {
            ResponseHandler.success(
                res,
                "User allready exist!",
                StatusCode.alreadyExists,
                isUserExist
            )
        }

        const hashPasswor = await Bcryptjs.hash(password.trim());

        const Data = {
            email: email.trim(),
            name: name.trim(),
            password: hashPasswor
        }

        const user = await User.create(Data);
        if (!user) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "User not created",
                [
                    {
                        path: [
                            "Register",
                            "Problem"
                        ],
                        message: "Can't create the user!"
                    }
                ],
                StatusCode.unexpected,
                error.stack
            ))
        }

        ResponseHandler.success(
            res,
            "Data send SuccessFully",
            StatusCode.success,
            user
        )

    } catch (error : unknown) {
        if( error instanceof Error){
            console.log(error.stack)
            next(ResponseHandler.error(
                res,
                "Error on the create user",
                [
                    {
                        path: [
                            "Register",
                            "Somethink unwanted"
                        ],
                        message: "Facing problem!"
                    }
                ],
                StatusCode.unexpected,
                error.stack
            ))
        }
    }
}

export async function Login(req: Request, res: Response, next: NextFunction) {
    try {

        const { email, password } = req.body;
        if ( !email.trim() || !password.trim() ) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "You Must provide email and password for Login your account!",
                [
                    {
                        path: [
                            "Login",
                            "Messing"
                        ],
                        message: "Messing filds to login account"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        }

        const isUserExist = await User.findOne({email});
        if (!isUserExist) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "You account not found!",
                [
                    {
                        path: [
                            "Login",
                            "Messing"
                        ],
                        message: "Account not founded!"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        }

        const isPasswordValid = await Bcryptjs.compare(password, isUserExist?.password as string);
        if (!isPasswordValid) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "You password is invalid!",
                [
                    {
                        path: [
                            "Login",
                            "invalid"
                        ],
                        message: "Password invalid!"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        }

        const dataForIncript: SignType = {
            id: isUserExist?._id.toString()!,
            userType: isUserExist?.role!
        }

        const verifyedToken = JWT_SIGN(dataForIncript);
        if (!verifyedToken) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "Can't sign the token",
                [
                    {
                        path: [
                            "Login",
                            "jwt"
                        ],
                        message: "JWT invalid!"
                    }
                ],
                StatusCode.unexpected,
                error.stack
            ))
        }
        

        res
        .cookie("CLA",verifyedToken,CookieOptions)
        .json(
            {
                message: "Login successfull",
                StatusCode: StatusCode.accepted,
                user: isUserExist!
            }
        )

    } catch (error : unknown) {
        if( error instanceof Error){
            console.log(error.stack)
            next(ResponseHandler.error(
                res,
                "Error on the create user",
                [
                    {
                        path: [
                            "Register",
                            "Somethink unwanted"
                        ],
                        message: "Facing problem!"
                    }
                ],
                StatusCode.unexpected,
                error.stack
            ))
        }
    }
}