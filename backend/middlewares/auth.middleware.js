import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiError } from "../utilities/ApiError.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
export const verifyJWT=asyncHandler(async()=>{
try {
        const token=req.cookies?.accessToken || req.header
        ("Authorization")?.replace("Bearer ","")
        if(!token){
            throw new ApiError(401,"unauthorized request")
        }
        const decodedToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        const user=await User.findById(decodedToken?._id).select("-password -refreshToken")//._id kyuki jb humlog model bnaye the ushme generateAccessToken bnaye the usme humlog _id hi naam rkhe the and ab user miljayega to user hai humlog ka pura ka pra but kuch fiel hume nhi dena hai ushko select se hta ddenge
        if(!user){
            throw new ApiError(401,"Invalid Access Token")
        }
        req.user=user
        next()
} catch (error) {
    throw new ApiError(401,
        error?.message || "invalid access token"
    )
}

})