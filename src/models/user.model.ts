import { Document, model, Schema, Types } from "mongoose";

export interface UserInterface extends Document{
    name: string;
    email: string;
    password: string;
    follow: Types.ObjectId[];
    followedBy: Types.ObjectId[]; 
    createdCourses: Types.ObjectId[];
    folowCourses: Types.ObjectId[];
    enrolled: {
        type: Types.ObjectId,
        path: string,
        completedLessons: number[],
        answerdQuistion: number
    }[];
    role: string;
}

const userSchema = new Schema<UserInterface>(
    {
        name:{
            type: String,
            required: true,
            trim: true
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true
        },
        follow: [
            {
                type: Types.ObjectId,
                path:"courses"
            }
        ],
        followedBy: [
            {
                type: Types.ObjectId,
                path:"courses"
            }
        ],
        createdCourses: [
            {
                type: Types.ObjectId,
                path:"courses"
            }
        ],
        enrolled: [
            {
                type: Types.ObjectId,
                path:"courses",
            }
        ],
        folowCourses: [
            {
                type: Types.ObjectId,
                path:"courses",
            }
        ],
        role:{
            type: String,
            default: "student",
            enum: ["student","teacher"]
        },

    },{
        timestamps:true
    }
)

export const User = model("user",userSchema);