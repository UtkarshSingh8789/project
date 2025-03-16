import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"// ishko agr use nhi krenge toh humlog jb frontend side se koi bhi data send krenge toh browser ki jo cookie hoti hai usme token store nhi hoga, store hoga parse nhi hoga
const app=express();
// middle wares:
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json(
    {
        limit:"16kb"
    }
))
app.use(express.urlencoded({
    extended:true,
    limit:"16kb"
}))
app.use(cookieParser());
import router from "./routes/user.routes.js";
import companyrouter from "./routes/company.routes.js";
app.use("/api/v1/users",router)
app.use("/api/v1/company",companyrouter)
export {app};