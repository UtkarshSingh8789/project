import { asyncHandler } from "../utilities/asyncHandler.js";
import { ApiError } from "../utilities/ApiError.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { Job } from "../models/job.model.js";
// post by admin
const createdJob=asyncHandler(async(req,res)=>{
    const {title,description,requirements,salary,location,jobType,experience,position,companyId}=req.body;
    if(!(title || description || requirements || salary || location || jobType || experience || position ||companyId)){
        throw new ApiError(404,"Something is Missing")
    }
    const userId=req.user?._id
    const job=await Job.create({
        title,
        description,
        requirements: requirements.split(","),
        salary:Number(salary),
        location,
        jobType,
        experienceLevel:experience,
        position,
        company:companyId,
        created_by:userId
    })
    const createdjob=await Job.findById(job._id);
    if(!createdJob){
        throw new ApiError(500,"Something went wrong while creating company")
    }
    return res.
    status(201).
    json(new ApiResponse(202,{createdjob},"job created successfully"))
})
// get job student ke liye;
const getAllJobs=asyncHandler(async(req,res)=>{
    
})
export{
    createdJob
}