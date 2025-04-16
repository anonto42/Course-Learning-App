import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../utils/Response";
import { User } from "../models/user.model";
import Bcryptjs from "../utils/Bcryptjs";
import { StatusCode } from "../utils/StatusCode";
import { JWT_SIGN, SignType } from "../utils/Jwt";
import { CookieOptions } from "../utils/Cookie";
import { WithUserRequest } from "../middleware/auth.middleware";
import { Course } from "../models/course.model";
import { Feedback } from "../models/feedback.model";
import { Lesson } from "../models/lessons.model";
import { Types } from "mongoose";

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
            id: isUserExist?._id as string,
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

export async function LikeCourse(req: WithUserRequest, res: Response, next: NextFunction) {
    try {

        const user = req.user
        const { course } = req.body;
        if ( !course.trim() ) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "You Must provide Course Title to like this Course!",
                [
                    {
                        path: [
                            "Title",
                            "Messing"
                        ],
                        message: "Messing filds to like"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        }

        const courseDocument = await Course.findOne({title: course.trim()})
        if (!courseDocument) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "Course not founded!",
                [
                    {
                        path: [
                            "Find Course",
                            "Messing"
                        ],
                        message: "Course not founded!"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        }

        const isAlreadyLiked = courseDocument!.enrolled.includes(user?._id as Types.ObjectId);
        if (isAlreadyLiked) {
            ResponseHandler.success(
                res,
                "You are already liked in this course.",
                StatusCode.success,
                courseDocument!
            );
        }

        courseDocument?.likes.push( user?._id as Types.ObjectId );

        await courseDocument?.save();

        ResponseHandler.success(
            res,
            "Liked the course SuccessFully",
            StatusCode.success,
            courseDocument!
        )

    } catch (error : unknown) {
        if( error instanceof Error){
            console.log(error.stack)
            next(ResponseHandler.error(
                res,
                "Error on the create Like",
                [
                    {
                        path: [
                            "Like",
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

export async function GiveFeedBackCourse(req: WithUserRequest, res: Response, next: NextFunction) {
    try {

        const user = req.user
        const { course, feedbackMessage } = req.body;
        if ( !course.trim() ) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "You Must provide course title to commit a feedback!",
                [
                    {
                        path: [
                            "Feedback",
                            "Send"
                        ],
                        message: "Messing filds to send feedback"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        }

        const courseDocument = await Course.findOne({title: course.trim()})
        if (!courseDocument) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "Course not founded!",
                [
                    {
                        path: [
                            "Find Course",
                            "Messing"
                        ],
                        message: "Course not founded!"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        }

        const FeedbackCreate = await Feedback.create(
            {
                course:courseDocument?._id,
                userID:user?._id,
                feedback:feedbackMessage
            }
        )
        if (!FeedbackCreate) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "Feedback not created!",
                [
                    {
                        path: [
                            "Feedback",
                            "Creation"
                        ],
                        message: "Feedback not created!"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        }

        ResponseHandler.success(
            res,
            "Created a feedback for the course SuccessFully",
            StatusCode.success,
            FeedbackCreate
        )

    } catch (error : unknown) {
        if( error instanceof Error){
            console.log(error.stack)
            next(ResponseHandler.error(
                res,
                "Error on the create feedback",
                [
                    {
                        path: [
                            "Feedback",
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

export async function FollowCourseCreator(req: WithUserRequest, res: Response, next: NextFunction) {
    try {

        const user = req.user
        const { course } = req.body;
        if ( !course.trim() ) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "You Must provide course title to commit a feedback!",
                [
                    {
                        path: [
                            "Feedback",
                            "Send"
                        ],
                        message: "Messing filds to send feedback"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        }

        const courseDocument = await Course.findOne({title: course.trim()})
        if (!courseDocument) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "Course not founded!",
                [
                    {
                        path: [
                            "Find Course",
                            "Messing"
                        ],
                        message: "Course not founded!"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        }

        const userDocument = await User.findOne({_id: courseDocument?.createdBy})
        if (!userDocument) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "Course creator not founded!",
                [
                    {
                        path: [
                            "Find Teacher",
                            "Messing"
                        ],
                        message: "Teacher not founded!"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        }
        
        await userDocument?.followedBy.push( user?._id as Types.ObjectId );

        await userDocument?.save();

        ResponseHandler.success(
            res,
            `Your successfully following ${userDocument?.name}`,
            StatusCode.success,
            userDocument!
        )

    } catch (error : unknown) {
        if( error instanceof Error){
            console.log(error.stack)
            next(ResponseHandler.error(
                res,
                "Error on the create follow!",
                [
                    {
                        path: [
                            "Follow",
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

export async function AnswerAQuize(req: WithUserRequest, res: Response, next: NextFunction) {
    try {
        const user = req.user
        const { course, lessonTitle, answer, nameOfBlock } = req.body;
        if ( !course.trim() || !lessonTitle.trim() || !answer.trim() || !nameOfBlock.trim() ) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "You Must provide Full information!",
                [
                    {
                        path: [
                            "Quize Creation",
                            "Send"
                        ],
                        message: "Messing filds to send feedback"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        };

        const courseDocument = await Course.findOne({title: course.trim()});
        if (!courseDocument) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "Course not founded!",
                [
                    {
                        path: [
                            "Find Course",
                            "Messing"
                        ],
                        message: "Course not founded!"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        };

        const lessonDocument = await Lesson.findOne({title: lessonTitle.trim()});
        if (!lessonDocument) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "Lesson did'n exist!",
                [
                    {
                        path: [
                            "Find lesson",
                            "Course"
                        ],
                        message: "Lesson not founded!"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        };

        const block = lessonDocument?.blocks.filter( block => block.name === nameOfBlock.trim() )[0];
        const Answer = block?.quize?.answer;
        if ( Answer?.trim() === answer.trim() ) {
            await User.updateOne({totalAnswerd: Number(user?.totalAnswerd) + 1 })
            ResponseHandler.success(
                res,
                `Your answer was recorded!`,
                StatusCode.success,
                { answerWas: Answer }
            )
        } else {
            ResponseHandler.success(
                res,
                `Your answer was wrong!`,
                StatusCode.noContent,
                {}
            )
        };

    } catch (error : unknown) {
        if( error instanceof Error){
            console.log(error.stack)
            next(ResponseHandler.error(
                res,
                "Error on the Answer!",
                [
                    {
                        path: [
                            "Answer",
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

export async function EnrollCourse(req: WithUserRequest, res: Response, next: NextFunction) {
    try {
        const user = req.user
        const { course } = req.body;
        if ( !course.trim() ) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "You Must provide course name!",
                [
                    {
                        path: [
                            "course Creation",
                            "enroll"
                        ],
                        message: "Messing course title!"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        };

        const courseDocument = await Course.findOne({title: course.trim()});
        if (!courseDocument) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "Course not founded!",
                [
                    {
                        path: [
                            "Find Course",
                            "Messing"
                        ],
                        message: "Course not founded!"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        };

        const userDocument = await User.findOne({_id: user?._id});
        if (!userDocument) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "Course not founded!",
                [
                    {
                        path: [
                            "Find Course",
                            "Messing"
                        ],
                        message: "Course not founded!"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        };

        const isAlreadyEnrolled = courseDocument!.enrolled.includes(user?._id as Types.ObjectId);
        if (isAlreadyEnrolled) {
            ResponseHandler.success(
                res,
                "You are already enrolled in this course.",
                StatusCode.success,
                courseDocument!
            );
        }

        courseDocument!.enrolled.push(user?._id as Types.ObjectId);
        userDocument!.enrolled.push(courseDocument?._id as Types.ObjectId);

        await courseDocument!.save();
        await userDocument!.save();
        
        ResponseHandler.success(
            res,
            `Your have enrolled to the course!`,
            StatusCode.success,
            userDocument!
        )

    } catch (error : unknown) {
        if( error instanceof Error){
            console.log(error.stack)
            next(ResponseHandler.error(
                res,
                "Error on the Answer!",
                [
                    {
                        path: [
                            "Answer",
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