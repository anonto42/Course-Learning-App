import { model, Schema, Types } from "mongoose";

export interface LikeType {
    user: { type: Types.ObjectId, path: string};
    to: { type: Types.ObjectId, path: string};
}

const LikeSchema = new Schema<LikeType>(
    {
        user:[
            {
                type: Types.ObjectId,
                path: "users"
            }
        ],
        to: [
            {
                type: Types.ObjectId,
                path: "courses"
            }
        ],
    },{
        timestamps:true
    }
)

export const Likes = model("like",LikeSchema);