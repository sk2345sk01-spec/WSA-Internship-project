import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import {router} from "./routes/userRoutes.js";
import {propertyRouter} from "./routes/propertyRouter.js"
import {bookingRouter} from "./routes/bookingRouter.js"


import connectDB from "./utils/db.js";

dotenv.config();


const app = express();


app.use(express.json({limit:"100mb"}))
app.use(express.urlencoded({limit:"100mb",extended:true}))

app.use(cookieParser());

const PORT = process.env.PORT;

// test route
app.get("/", (req, res)=>{
  res.send("HomelyHub backend is running");
})

app.use("/api/v1/rent/user",router)
app.use("/api/v1/rent/listing",propertyRouter) 
app.use("/api/v1/rent/user/booking",bookingRouter) 

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})