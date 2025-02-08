import dotenv from "dotenv"
import { app } from "./app.js"
import connectDb from "./db/index.js"
dotenv.config({
    path: './.env'
})
connectDb()
.then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`server is running at port : ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MONGO db connection failed:",err)
})