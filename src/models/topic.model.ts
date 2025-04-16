import { model, Schema } from "mongoose";

export interface TopicType {
    name: string;
    about: string;
    topic: string;
    quize: {
        quistion: string;
        answer: string;
    };
};

const TopicSchema = new Schema<TopicType>(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        about: {
            type: String,
            required: true
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
    },{
        timestamps:true
    }
)

export const Topic = model("topic",TopicSchema);