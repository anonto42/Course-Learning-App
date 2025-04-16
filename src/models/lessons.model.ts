import { model, Schema, Types } from "mongoose";


export interface BlocksType {
    name: string;
    topic: string,
    quize:{
        quistion: string,
        answer: string
    }
}

export interface LessonsType {
    title: string;
    blocks: BlocksType[];
    courseID: {
        type: Types.ObjectId
        path: string
    },
}

const LessonSchema = new Schema<LessonsType>(
    {
        title:{
            type: String,
            required: true,
            trim: true
        },
        courseID: {
            type: Types.ObjectId,
            path: "course"
        },
        blocks:[
            {
                name: {
                    type: String,
                    required: true,
                    unique: true,
                    trim: true
                },
                topic: {
                    type: String,
                    required: true
                },
                quize:{
                    quistion:{
                        type: String,
                        required: true
                    },
                    answer:{
                        type: String,
                        requird: true 
                    }
                }
            }
        ],
    },{
        timestamps:true
    }
)

export const Lesson = model("lesson",LessonSchema);