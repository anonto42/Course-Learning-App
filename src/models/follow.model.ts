import { model, Schema, Types } from "mongoose";

export interface FollowType {
    user: { type: Types.ObjectId, path: string};
    to: { type: Types.ObjectId, path: string};
}

const FollowSchema = new Schema<FollowType>(
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
                path: "user"
            }
        ],
    },{
        timestamps:true
    }
)

export const Follow = model("follow",FollowSchema);