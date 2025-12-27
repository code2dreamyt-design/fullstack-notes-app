import express from "express";
import bcrypt from "bcrypt"
import { User } from "../model/userSchemas.js";
import crypto from "crypto";
import verifyEmailToken from "../middlewares/emailVerification.middleware.js";
import sendVerificationMail from "../utils/sendEmail.utils.js";
import { createRegisterToken } from "../utils/tokenGenrator.js";
import { clientURL } from "../config/env.js";

const emailVerifyRoute = express.Router();
    console.log("verify route hit")
emailVerifyRoute.get("/:token",async (req , res )=>{
 const {token} = req.params;

 if(!token) return res.status(400).json({msg:"token is not provided"});
 const user = await User.findOne(
    {
        verificationToken:token,
        verficationExpiry:{$gt:Date.now()}
    }
 );
 if(!user) return res.status(400).json({msg:"token expired"});
 user.isVerified = true;
 user.verificationToken=undefined;
 user.verficationExpiry=undefined;
 await user.save();
 console.log("verify route exit with status ok");
 return res.status(200).send(`<a href=${`${clientURL}/login`}>Go to Login Page</a>`)
});
emailVerifyRoute.get("/auth/emailstatus",verifyEmailToken,async (req,res)=>{
        
        const user = await User.findById(req.user._id);
        if(user.isVerified===true){ 
            console.log("here is problrm")
            res.clearCookie("emailVerificationToken",{httpOnly:true,secure:false,sameSite:"lax"});
            const registerToken = createRegisterToken({email:user.email,_id:user._id});
            res.cookie("registerToken",registerToken,{httpOnly:true,secure:false,sameSite:true});
            return res.status(200).json({isVerified:user.isVerified});
        }
        else {return res.status(500).json({msg:"Email verification error"});}
});
emailVerifyRoute.get("/auth/resend",verifyEmailToken,async (req,res)=>{
    console.log("resend hit")
    const user = await User.findOne(
    {_id:req.user._id,verficationExpiry:{$gt:Date.now()}},
    );
    if(!user.verificationToken){
        return res.status(400).json({starus:false});
    }
    try {
        const verificationToken = crypto.randomBytes(32).toString("hex");
        await User.updateOne(
            {_id:req.user._id},
            {$set:{
                verificationToken,
                verficationExpiry:Date.now()+5*60*1000
            }}
        );
        sendVerificationMail(user.email,verificationToken);
    } catch (error) {
        return res.status(500).json({msg:"Server Error"});
    }
    
})
export default emailVerifyRoute