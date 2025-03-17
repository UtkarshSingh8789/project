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
    // keyword se find krna query lga ke krenge;
    const keyword=req.query.keyword || ""
    const query={
        $or:[
            {title:{$regex:keyword,$options:"i"}},//$options:"i"->capital ho ya small frk nhi prega basically casesensitive
            {description:{$regex:keyword,$options:"i"}},
        ]
    }
    const jobs = await Job.find(query).populate({
        path:"company"
    }).sort({createdAt:-1})// yha kuch imp baad me likhenge
    //.sort({ createdAt: -1 }): Sorts the results in descending order by creation time.
    if(!jobs){
        throw new ApiError(404,"Job not found")
    }
    return res.
    status(202).
    json(new ApiResponse(202,{jobs},"successfull"))
})
const getJobById=asyncHandler(async(req,res)=>{
    const jobId=req.params.id;
    const job=await Job.findById(jobId).populate({
        path:"applications"
    })
    if(!job){
        throw new ApiError(404,"Job not found")
    }
    return res.
    status(202).
    json(new ApiResponse(202,{job},"job found"))
})
const getAdminJobs=asyncHandler(async(req,res)=>{
    const adminId=req.user?._id;
    const jobs=await Job.find({created_by:adminId}).populate({
        path:"company",
        createdAt:-1
    })
    if(!jobs){
        throw new ApiError(404,"jobs not found");
    }
    return res.
    status(202).
    json(new ApiResponse(202,{jobs},"job found"))
})
export{
    createdJob,
    getAllJobs,
    getJobById,
    getAdminJobs
}



/// concept of .populate****  (vvi);
//Let's say we have the following documents in the database:

// Jobs Collection

// {
//     "_id": "job123",
//     "title": "Software Engineer",
//     "company": "company456",
//     "createdAt": "2025-03-17T10:00:00Z"
// }

// Companies Collection

// {
//     "_id": "company456",
//     "name": "TechCorp",
//     "location": "New York"
// }

// Without .populate()

// const jobs = await Job.find(query);
// console.log(jobs);

// output wihtout populat->[
//     {
//         "_id": "job123",
//         "title": "Software Engineer",
//         "company": "company456", // Only ObjectId, no company details
//         "createdAt": "2025-03-17T10:00:00Z"
//     }
// ]

// with populate

// const jobs = await Job.find(query).populate("company");
// console.log(jobs);

// output with populate
// [
//     {
//         "_id": "job123",
//         "title": "Software Engineer",
//         "company": {
//             "_id": "company456",
//             "name": "TechCorp",
//             "location": "New York"
//         },
//         "createdAt": "2025-03-17T10:00:00Z"
//     }
// ]

