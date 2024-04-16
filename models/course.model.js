import {model,Schema} from 'mongoose'

const courseSchema=new Schema({
    title:{
        type:String,
        required:[true,"Title is required"],
        minLength:[8,"Title must be 8 character"],
        maxLength:[20,"Title should not greater than 20 character"],
    },
    description:{
        type:String,
        required:[true,"Description is required"],
        minLength:[20,"Description must be 8 character"],
        maxLength:[200,"Description should not greater than 200 character"],
    },
    category:{
        type:String,
        required:[true,"Category is required "],
    },
    thumbnail:{
        public_id:{
            type:String
        },
        secure_url:{
            type:String
        }
    },
    lectures:{
        title:String,
        description:String,
        public_id:{
            type:String
        },
        secure_url:{
            type:String
        }
    },
    noOfLectures:Number,
    createdBy:String
},{
    timestamps:true
});

const Course=model("Course",courseSchema);

export default Course