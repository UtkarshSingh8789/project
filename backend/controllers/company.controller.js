import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { Company } from "../models/company.model.js";
const registerCompany=asyncHandler(async(req,res)=>{
    const {companyName}=req.body;
    if(!companyName){
        throw new ApiError(404,"Comapny Name is Required")
    }
    const existedCompany=await Company.findOne({name:companyName})
    if(existedCompany){
        throw new ApiError(404,"you can't register same company")
    }
    const company=await Company.create({
        name:companyName,
        userId:req.user?._id
    })
    const createdCompany=await Company.findById(company._id)
    if(!createdCompany){
        throw new ApiError(500,"something went wrong while regestring company")
    }
    return res.
    status(201).
    json(new ApiResponse(200,{createdCompany},"Company registerd Succesfully"))
})
// ab humlog get company ka controller likhenge yaad rkhna humlog company get user ke id se krenge
// kyuki login user jo company create kiya hoga we hi ishko denge nah ki sara ka sara globe ka company;
const getCompany=asyncHandler(async(req,res)=>{
    const userId=req.user?._id//logged in user id;
    const companies=await Company.find({userId})// company array;
    if(!companies){
        throw new ApiError(400,"No company registerd by you");
    }
    return res.
    status(200).
    json(new ApiResponse(200,{companies},"your registerd company"))
})
const getCompanyById=asyncHandler(async(req,res)=>{
    const companyId=req.params.id
    const company=await Company.findById(companyId)
    if(!company){
        throw new ApiError(404,"company not found");
    }
    return res.
    status(200).
    json(new ApiResponse(200,{company},"found"))
})
const updateCompany=asyncHandler(async(req,res)=>{
    const {name,description,website,location}=req.body;
    const updateData={name,description,website,location}
    const company=await Company.findByIdAndUpdate(req.params.id,updateData,{new: true})
    if(!company){
        throw new ApiError(404,"Something went wrong while updating the information of company")
    }
    return res.
    status(200).
    json(new ApiResponse(200,{company},"company information updated successfully"))
})
export {
    registerCompany,
    getCompany,
    getCompanyById,
    updateCompany,
}