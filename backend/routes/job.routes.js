import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { createdJob, getAdminJobs, getAllJobs, getJobById } from "../controllers/job.controller.js"
const jobrouter=Router()
jobrouter.route("/post").post(verifyJWT,createdJob)
jobrouter.route("/get").get(verifyJWT,getAllJobs)
jobrouter.route("/get/:id").get(verifyJWT,getJobById)
jobrouter.route("/getadminjobs").get(verifyJWT,getAdminJobs)
export default jobrouter