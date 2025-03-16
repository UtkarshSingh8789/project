import {Router} from "express"
import {getCompany, registerCompany,getCompanyById,updateCompany } from "../controllers/company.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js"
const companyrouter=Router()
companyrouter.route("/registerCompany").post(verifyJWT,registerCompany);
companyrouter.route("/get").get(
    verifyJWT,
    getCompany
)
companyrouter.route("/get/:id").get(verifyJWT,getCompanyById)
companyrouter.route("/updateCompany/:id").put(verifyJWT,updateCompany)
export default companyrouter