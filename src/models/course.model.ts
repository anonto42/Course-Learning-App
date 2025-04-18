import { model, Schema, Types } from "mongoose";

export interface CourseType {
    title: string;
    description: string;
    createdBy: { type: Types.ObjectId, path: string };
    lessons: Types.ObjectId[];
    enrolled: Types.ObjectId[];
    totalViews: Types.ObjectId[];
    likes: Types.ObjectId[];
    feedbacks: Types.ObjectId[];
}

const CoursetSchema = new Schema<CourseType>(
    {
        title:{
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        createdBy: {
            type: Types.ObjectId,
            path: "users"
        },
        enrolled:[
            {
                type: Types.ObjectId,
                path: "users"
            }
        ],
        totalViews: [{
            type: Types.ObjectId,
            path: "users"
        }],
        likes: [
            {
                type: Types.ObjectId,
                path: "users"
            }
        ],
        feedbacks: [
            {
                type: Types.ObjectId,
                path: "feedbacks"
            }
        ],
        lessons: [
            {
                type: Types.ObjectId,
                path: "lesson"
            }
        ],
    },{
        timestamps:true
    }
)

export const Course = model("course",CoursetSchema);