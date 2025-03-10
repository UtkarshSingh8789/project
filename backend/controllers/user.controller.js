import { asyncHandler } from "../utilities/asyncHandler.js";
import {ApiError} from "../utilities/ApiError.js"
import {ApiResponse} from "../utilities/ApiResponse.js"
import { User } from "../models/user.model.js";
// process involved in regestring user;
const generateAccessTokenAndRefreshToken=async(userId)=>{
    try {
        const user=await User.findById(userId);
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        // dekho accessToken toh humlog user ko dedete hai but refresh token ko humlog ko apne database me rkhna hota hai taaki user se baarr barr login nah krwana pre;
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating access token and refresh token")
    }
}
const registerUser=asyncHandler(async (req,res)=>{
    const {fullName,email,phoneNumber,password,role}=req.body
    if(fullName===""){
        throw new ApiError(400,"fullName is required");
    }
    if(email===""){
        throw new ApiError(400,"email is required")
    }
    if(phoneNumber===""){
        throw new ApiError(400,"phoneNumber is required")
    }
    if(password===""){
        throw new ApiError(400,"password is required")
    }
    if(role===""){
        throw new ApiError(400,"role is required")
    }
    // check krenge ki kya user phle se hi existed hai ya nhi;
    // phone number or email dono se check krlete hai;
    const existedUser=await User.findOne({
        $or: [ 
            { email: email.toLowerCase() },
            { phoneNumber: phoneNumber}
        ]
    });
    if(existedUser){
        throw new ApiError(409,"user with the same phone number and email is already registered");
    }
    const user=User.create({
        fullName,
        email,
        phoneNumber,
        password,
        role
    })// mereko user milgya jo jaake mongodb me create hoga;
    //humlog ko ye bhi check krna hoga kya user create krne me server end se koi dikkat bua hai kya?
    // dekho jb user mongodb pe create hoga toh humlog ko ek unique id dega jo mogodb provide krta hai check krlenge isi id ke dwaraa ki user create hua ya nhi;
    const createdUser=await User.findById(user._id).select(
        // is select ke and we we field likhenge jo use krne hai
        // but yha ulta use krenge jo field htane hai we hum - krke use krenge in string weird syntax;
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while regestring user")
    }
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user created successfully")
    )
})
// login User;
const loginUser=asyncHandler(async(req,re)=>{
    const {email,phoneNumber,password}=req.body
    if(!(email || phoneNumber)){
        throw new ApiError(400,"email or phone number is required")
    }
    const user=await User.findOne({
        $or:[{email},{phoneNumber}]
    })
    if(!user){
        throw new ApiError(404,"user donot exist")
    }
    const isPasswordValid=await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(404,"Password is incorrect")
    }
    const {accessToken,refreshToken}=await generateAccessTokenAndRefreshToken(user._id)
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
    // refreshToken and accessToken humlog humesa cookie ke form me bhjte hai
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(200,{
            user:loggedInUser,
            accessToken,
            refreshToken
            // dekho humlog jb accessToken and refreshToken cookies me bhj diye hai
            // toh phir se user ko isliye send kr rhe taaki ho ske toh khi agr user ko local storage me save krna hai;
            // to kr ske:
        },"User logged in successfully")
    )
})
// logout
const logoutUser=asyncHandler(async(req,res)=>{
    // phle database se accesstoken ko hta dete hai;
    User.findByIdAndUpdate(req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:true
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(200,{},"User logged Out")
    )

})
const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(401,"unauthorized request")
    }
    // agr aagya toh jo database me hai ussse verify krenge;
    try {
        const decodedToken=jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user=await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Invalid refresh Token");
        }
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used");
        }
        const {newAccessToken,newRefreshToken}=await generateAccessAndRefereshTokens(user._id)
        const options={
            httpOnly:true,
            secure:true
        }
        return res
        .status(200)
        .cookie("accessToken",newAccessToken,options)
        .cookie("refreshToken",newRefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,refreshToken:newRefreshToken},
                "AccessToken refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refreshToken")
    }
})
const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword} =req.body
    const user=await User.findById(req.user?._id)
    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(400,"Incorrect password")
    }
    user.password=newPassword
    await user.save({validateBeforeSave:false})
    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password changed SuccessFully"))
})
const getCurrentUser=asyncHandler(async(req,res)=>{
    return res
    .status(200)
    .json(200,req.user,"curent user fectched successfully")
})
export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
}