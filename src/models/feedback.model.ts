import { model, Schema, Types } from "mongoose";

export interface FeedbackType {
    userID: { type : Types.ObjectId , path: string };
    course: { type : Types.ObjectId , path: string };
    feedback: String;
}

const FeedbackSchema = new Schema<FeedbackType>(
    {
        userID:{
            type: Types.ObjectId,
            path: "users"
        },
        feedback: String,
        course:{
            type: Types.ObjectId,
            path: "courses"
        },
    },{
        timestamps:true
    }
)

export const Feedback = model("feedback",FeedbackSchema);