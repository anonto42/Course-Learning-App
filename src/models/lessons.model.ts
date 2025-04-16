import { model, Schema, Types } from "mongoose";

export interface LessonsType {
    title: string;
    blocks: Types.ObjectId[];
}

const LessonSchema = new Schema<LessonsType>(
    {
        title:{
            type: String,
            required: true,
            trim: true
        },
        blocks:[{
            type: Types.ObjectId,
            path: "topics"
        }],
    },{
        timestamps:true
    }
)

export const lesson = model("lesson",LessonSchema);