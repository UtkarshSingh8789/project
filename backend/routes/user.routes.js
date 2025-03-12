import {Router} from "express"
import { loginUser,logoutUser,registerUser, updateAccountdetails } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
const router=Router()
router.route("/register").post((req, res, next) => {
    console.log("POST /api/v1/users/register route hit");
    next();
}, registerUser);
router.route("/login").post(loginUser)
router.route("/logout").post(
    verifyJWT,
    logoutUser
)
router.route("/updateAccount").post(
    verifyJWT,
    updateAccountdetails
)
export default router