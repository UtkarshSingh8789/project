import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
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
        skills:[{type:String}],
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
    },
    refreshToken:{
        type:String
    }
},{timestamps:true});
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password=await bcrypt.hash(this.password,10)
    next()
})
userSchema.methods.isPasswordCorrect= async function(password){
    // bcrypt library password hash krti hai toh we check bhi kr skti hai;
    return await bcrypt.compare(password,this.password)  // true or false deta hai
    // .compare do chij lega ek jo user bhj rha in form of string aur ek encrpted jo bcrypt hi incrpt kiya hai 
    // incrpted pass this.password me hoga
    // password=user send password in form of string;
}
userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            //payload;
            _id:this._id, // ye milegi monogo dbse
        },
        // dusra chij ishko access token denge;
        process.env.ACCESS_TOKEN_SECRET,
        // TISRA ISHKO Object lgta hai expiry object ke andr dete hai;
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            //refresh token me information km hota kyuki ye refresh hota hai ishme bs id use kr rhe;
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}
export const User=mongoose.model("User",userSchema)