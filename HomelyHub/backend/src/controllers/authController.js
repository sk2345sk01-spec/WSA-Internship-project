import {User} from "../models/userModel.js";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import imagekit from "../utils/ImagekitIO.js";
import { sendMail, forgotPasswordMailGenContent } from  "../utils/mail.js";
import { signinToken, createSendToken, defaultAvatarUrl, filterObj } from "../utils/token.js"

//signup
const signup = async(req,res) =>{
    try{

        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
            avatar:{url:req.body.avatar || defaultAvatarUrl(req.body.name)}
        })

        createSendToken(newUser,201, res)

    }catch(error){
        // const duplicateField = Object.keys(error.keyPattern ||{})[0];
        // const message = duplicateField ? `An account with that ${duplicateField} already exists`:error.message;
        res.status(400).json({message: error.message})
    }
}

//login : check email & password;then give token

const login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            throw new Error("please provide email or password")
        }

        const user = await User.findOne({email}).select("+password")

        if(!user || (await user.correctPassword(password,user.password)) === false){
            throw new Error("Incorrect email or password")
        }
        
        createSendToken(user,200,res)

    }catch(error){
        res.status(401).json({status: "fail",message:error.message})
    }
    
}

//protect
const protect = async(req,res,next)=>{
    try {
        let token;                     
        //step 1: finding token
        if(
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ){
            token= req.headers.authorization.split(" ")[1]
        }
        
        else if(req.cookies.jwt && req.cookies.jwt !== "loggedout"){
            token= req.cookies.jwt;
        }

        //step 2: if no token then stop
        if(!token){
            throw new Error("You're not logged in ! , please login to access")
        }

        //step3 :token real or not
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // step4:token is real but does it still exist
        const currentUser = await User.findById(decoded.id);
        if(!currentUser){
            throw new Error("The user belonging to token doesn't exists")
        }

        //step5: 
        if(currentUser.changedPasswordAfter(decoded.iat)){
            throw new Error("User recently changed the password , please login again")
        }

        //step6: all checks passed
        req.user = currentUser;
        next();
    }
    catch(error){
        res.status(401).json({
            status:"Fail",
            message:error.message
        })
    }
}

export {signup,login,protect};