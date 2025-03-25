import {asyncHandler} from "../utilities/asyncHandler.js";
import { ApiResponse } from "../utilities/ApiResponse.js";
import { ApiError } from "../utilities/ApiError.js";
import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

const applyJob=asyncHandler(async(req,res)=>{
    // userid chaiye and job id chaiye(jis job pe apply krna hai)
    // phir check krna hoga kya same user, phir se same job id pe toh apply nhi kr rha
    // check krenge kya job id exist krta hai;
    // agr krta hai toh new application create krenge and job ke schema me applications array hai jishme humlog job ka id ko push krenge;
    const userId=req.user?._id;
    const jobId=req.params.id;
    if(!jobId){
        throw new ApiError(404,"Job id is required")
    }
    const existingApplication=await Application.findOne({job:jobId,applicant:userId})
    // const exists = await Application.exists({ job: jobId, applicant: userId })  // alternatives for this
    if(existingApplication){
        throw new ApiError(404,"you have already applied to this job")
    }
    const job=await Job.findById(jobId);
    if(!job){
        throw new ApiError(404,"job not found")
    }
    const newApplication=await Application.create({
        job:jobId,
        applicant:userId
    })
    job.applications.push(newApplication._id)
    await job.save()
    return res.
    status(201).
    json(new ApiResponse(202,{newApplication},"job applied successfully"))
})
const getAppliedJob=asyncHandler(async(req,res)=>{
    const userId=req.user?._id;
    const application=await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
        path:'job',
        options:{sort:{createdAt:-1}},
        populate:{
            path:'company',
            options:{sort:{createdAt:-1}}
        }
    })
    if(!application){
        throw new ApiError(404,"No application");
    }
    return res.
    status(202).
    json(new ApiResponse(202,{application},"successfull"))
})
const getApplicant=asyncHandler(async(req,res)=>{
    const jobId=req.params.id
    const job=await Job.findById(jobId).populate({
        path:'applications',
        options:{sort:{createdAt:-1}},
        populate:{
            path:'applicant'
        }
    })
    if(!job){
        throw new ApiError(404,"job not found")
    }
    return res.
    status(202).
    json(new ApiResponse(202,{job},"successfull"))
})
const updateStatus=asyncHandler(async(req,res)=>{
    const {status} =req.body;
    const applicationId=req.params.id;
    if(!status){
        throw new ApiError(404,"status is required");
    }
    const application=await Application.findOne({id:applicationId})
    if(!application){
        throw new ApiError(404,"application not found");
    }
    application.status=status.toLowerCase()
    await application.save()
    return res.
    status(200).
    json(new ApiResponse(202,{application},"applicatioon status Successfully"))
})
export {applyJob,
    getAppliedJob,
    getApplicant,
    updateStatus
}