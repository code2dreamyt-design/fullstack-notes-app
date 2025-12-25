import bcrypt from "bcrypt";
import { User } from "../model/userSchemas.js";
import crypto from "crypto"
import { createEmailVerificationToken, createRegisterToken } from "../utils/tokenGenrator.js";
import sendVerificationMail from "../utils/sendEmail.utils.js";
import { isProd } from "../config/env.js";
export const authLogin = async (req,res,next)=>{
    console.log("1")
    const {email,password} = req.body;
    if(!email || !password) return res.status(400).json({msg:"enter email and password"});
    const user = await User.findOne({email});
    console.log("1",user)
    if(!user) return res.status(404).json({msg:"user not found"});

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch) return res.status(401).json({msg:"Wrong password check again"});

    if(user.isVerified===false){
        const emailVerificationToken = createEmailVerificationToken({email:user.email,_id:user._id});
        const verificationToken = crypto.randomBytes(32).toString("hex");
        user.verificationToken =  verificationToken;
        user.verficationExpiry  = Date.now()+5*60*1000;
        await user.save();
        console.log(user.email,user.verificationToken)
        const result = await sendVerificationMail(user.email,verificationToken);
        console.log(result)
        res.cookie("emailVerificationToken",emailVerificationToken,{httpOnly:true,
                        secure:isProd,
                       sameSite:isProd?"none":"lax",});
        return res.status(403).json({reason: "EMAIL_NOT_VERIFIED",msg:"Verify your Email Fisrt"});
    }

    if(user.isValid === false){
        const registerToken = createRegisterToken({email:user.email,_id:user._id});
        res.cookie("registerToken",registerToken,{httpOnly:true,secure:isProd,
                       sameSite:isProd?"none":"lax",});
        return res.status(422).json({ reason: "PROFILE_INCOMPLETE",msg:"Complete your profile first"});
    }
    
    
    else{
        return next();
    }
}
