import { Response, NextFunction } from "express";
import ResponseHandler from "../utils/Response";
import { StatusCode } from "../utils/StatusCode";
import { WithUserRequest } from "../middleware/auth.middleware";
import { User } from "../models/user.model";
import { Course } from "../models/course.model";
import { Lesson } from "../models/lessons.model";
import { Types } from "mongoose";

export async function MakeUserToTecher(req: WithUserRequest, res: Response, next: NextFunction) {
    try {

        const user = req.user;

        const oparation = await User.updateOne(
            { _id: user?._id! },
            { role: "teacher" }
        )
        if ( !oparation ) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "Somting was problem on updating as a teacher!",
                [
                    {
                        path: [
                            "Update",
                            "role"
                        ],
                        message: "problem on update!"
                    }
                ],
                StatusCode.unexpected,
                error.stack
            ))
        }

        ResponseHandler.success(
            res,
            "Now you ara a teacher",
            StatusCode.success,
            oparation
        )

    } catch (error : unknown) {
        if( error instanceof Error){
            console.log(error.stack)
            next(ResponseHandler.error(
                res,
                "Error on the Server",
                [
                    {
                        path: [
                            "Techer"
                        ],
                        message: "This erro on the convert to techer!"
                    }
                ],
                StatusCode.unexpected,
                error.stack
            ))
        }
    }
}

export async function CreateCorse(req: WithUserRequest, res: Response, next: NextFunction) {
    try {
        const user = req.user;

        const { title, description } = req.body;
        if ( !title.trim() || !description.trim() ) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "Title and Description is requird to create a course!",
                [
                    {
                        path: [
                            "Create",
                            "Messing"
                        ],
                        message: "Messing Titie or discription!"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        }

        const oparation = await Course.create(
            {
                title: title.trim(),
                description: description.trim(),
                createdBy: user?._id
            }
        )
        if ( !oparation ) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "Can't create the Course!",
                [
                    {
                        path: [
                            "Create"
                        ],
                        message: "problem on the creating course!"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        }

        ResponseHandler.success(
            res,
            "Successfylly created the course",
            StatusCode.success,
            oparation
        )

    } catch (error : unknown) {
        if( error instanceof Error){
            console.log(error.stack)
            next(ResponseHandler.error(
                res,
                "Error on the Server",
                [
                    {
                        path: [
                            "Techer"
                        ],
                        message: "This error on the convert to techer!"
                    }
                ],
                StatusCode.unexpected,
                error.stack
            ))
        }
    }
}

export async function GetCourses(req: WithUserRequest, res: Response, next: NextFunction) {
    try {
        const user = req.user;
        const { name } = req.query;
        let data;

            const CourseDocument = await Course.findOne({ title: name });
            if ( user?._id?.toString() !== CourseDocument?.createdBy?.toString() ) {
                CourseDocument?.totalViews?.push( user!._id as Types.ObjectId );
                await CourseDocument?.save();
            }

        if(name){
            data = await Course.aggregate([
                {
                    $match: { title: name }
                },
                {
                    $lookup: {
                        from: "lessons",
                        localField: "_id",
                        foreignField: "courseID",
                        as: "lessons"
                    }
                },
                {
                    $lookup: {
                        from: "feedbacks",
                        localField: "_id",
                        foreignField: "course",
                        as: "feedbacks"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "createdBy",
                        foreignField: "_id",
                        as: "creator"
                    }
                },
                {
                    $unwind: {
                        path: "$creator",
                        preserveNullAndEmptyArrays: true
                    }
                }
            ])

            if ( !data ) {
                const error = new Error();
                next(ResponseHandler.error(
                    res,
                    `No corse exist named: ${name}`,
                    [
                        {
                            path: [
                                "Get",
                                "Messing"
                            ],
                            message: "Messing course title!"
                        }
                    ],
                    StatusCode.noContent,
                    error.stack
                ))
            }
        }else{
            data = await Course.aggregate(
                [
                    {
                        $match:{
                            createdBy: user?._id
                        }
                    },
                    {
                        $lookup: {
                            from: "lessons",
                            localField: "_id",
                            foreignField: "courseID",
                            as: "lessons"
                        }
                    },
                    {
                        $lookup: {
                            from: "feedbacks",
                            localField: "_id",
                            foreignField: "course",
                            as: "feedbacks"
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "createdBy",
                            foreignField: "_id",
                            as: "creator"
                        }
                    },
                    {
                        $unwind: {
                            path: "$creator",
                            preserveNullAndEmptyArrays: true
                        }
                    }
                ]
            );
        }

        console.log(data);

        ResponseHandler.success(
            res,
            "Successfylly get all courses",
            StatusCode.success,
            data!
        )

    } catch (error : unknown) {
        if( error instanceof Error){
            console.log(error.stack)
            next(ResponseHandler.error(
                res,
                "Error on the Server",
                [
                    {
                        path: [
                            "Techer"
                        ],
                        message: "This error on the course related!"
                    }
                ],
                StatusCode.unexpected,
                error.stack
            ))
        }
    }
}

export async function AddCourseContent(req: WithUserRequest, res: Response, next: NextFunction) {
    try {
        const { lessons, title } = req.body;
        const course = await Course.findOne({title});
        if ( !course ) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "Invalid course title!",
                [
                    {
                        path: [
                            "Get"
                        ],
                        message: "problem on get the corse!"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        }
        const lesson = await Lesson.create(
            {
                title : lessons.title,
                courseID: course?._id,
                blocks: lessons.blocks
            }
        )
        if ( lesson ) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "Can't add the lesson",
                [
                    {
                        path: [
                            "Create"
                        ],
                        message: "problem on the creating lesson!"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        }

        ResponseHandler.success(
            res,
            "Successfylly created the lesson",
            StatusCode.success,
            lesson
        )

    } catch (error : unknown) {
        if( error instanceof Error){
            console.log(error.stack)
            next(ResponseHandler.error(
                res,
                "Error on the Server",
                [
                    {
                        path: [
                            "Techer"
                        ],
                        message: "This error on the convert to techer!"
                    }
                ],
                StatusCode.unexpected,
                error.stack
            ))
        }
    }
}

export async function DeleteCource (req: WithUserRequest, res: Response, next: NextFunction){
    try {
        const { title } = req.body;
        const course = await Course.findOneAndDelete({title});
        if ( !course ) {
            const error = new Error();
            next(ResponseHandler.error(
                res,
                "Invalid course title!",
                [
                    {
                        path: [
                            "Get"
                        ],
                        message: "problem on get the corse!"
                    }
                ],
                StatusCode.noContent,
                error.stack
            ))
        }

        ResponseHandler.success(
            res,
            "Successfylly delete the course!",
            StatusCode.success,
            course!
        )

    } catch (error : unknown) {
        if( error instanceof Error){
            console.log(error.stack)
            next(ResponseHandler.error(
                res,
                "Error on the Server",
                [
                    {
                        path: [
                            "Techer"
                        ],
                        message: "This error on the convert to techer!"
                    }
                ],
                StatusCode.unexpected,
                error.stack
            ))
        }
    }
}