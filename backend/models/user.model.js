import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    fullName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique: true
    },
    phoneNumber:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        // dekho yha pe option hai mtlb humlog as a job seeker bhi aplly kr skte hai and as a job recruite bhi kr skte hai;
        // jb bhi aisa option ka kaam hota hai toh humlog enum use krlete hai;
        enum:['student','recruiter'],
        required:true
    },
    profile:{
        bio:{type:String},
        skills:{type:String},
        resume:{type:String},
        resumeOriginalName:{type:String},
        company:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Company'
        },
        profilePhoto:{
            type:String,
            default:""
        }
    }
},{timestamps:true});
export const User=mongoose.model("User",userSchema)