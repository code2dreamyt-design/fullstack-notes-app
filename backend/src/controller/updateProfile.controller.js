import crypto from "crypto";
import {ProfileOtp} from "../model/updateProfile.schema.js"
import { sendOtpEmail } from "../utils/sendEmail.utils.js";
import { User } from "../model/userSchemas.js";
import deleteFromCLoudinary from "../utils/deleteFromCloud.js";
import uploadToCloudinary from "../utils/upload.js";
export const sendUpdateOtp  = async (req,res)=>{
    const {email} = req.body;
    const now = new Date();
    if(!email) return res.status(400).json({msg:"Enter email"});
    if(email===req.user.email) return res.status(409).json({msg:"Email is already in use"});

    try {
        const isExist = await User.findOne({email});
        if(isExist) return res.status(409).json({msg:"This email is already registered"})

        const otpDoc = await ProfileOtp.findOne(
            {
                email,
                userId:req.user._id
            }
        );
        if(!otpDoc){
        const otp = crypto.randomInt(100000,999999).toString();
        const hasOtp = crypto.createHash("sha256").update(otp).digest("hex");
        const result = await ProfileOtp.create({
            email,
            otp:hasOtp,
            otpExp:new Date(now.getTime()+3*60*1000),
            "otpChance.time":new Date(now.getTime()+1*60*1000),
            userId:req.user._id
        });
        sendOtpEmail(email,otp);
        return res.status(200).json({ msg: "Otp has been sent" });

        console.log(result)    
        }else{
            if(otpDoc.otpExp.getTime()>now.getTime()){
                return res.status(409).json({msg:`Valid Email Exists`});
            }
            if(otpDoc.otpChance.time.getTime()>now.getTime()){
                return res.status(429).json({
                    reason:"COOLDOWN_ACTIVE",
                    msg:`Wait for ${Math.ceil((otpDoc.otpChance.time.getTime()-now.getTime())/1000)}s`});
            }
            if(otpDoc.otpChance.chance>=3){
               return res.status(429).json({
                    reason:"DAILY_LIMIT_REACHED",
                    }); 
            }
            const otp = crypto.randomInt(100000,999999).toString();
            const hashOtp = crypto.createHash("sha256").update(otp).digest("hex");

            const result = await ProfileOtp.updateOne(
                {_id:otpDoc._id,
                    userId:req.user._id,
                    otpExp:{$lt:now},
                    "otpChance.time":{$lt:now}
                },
                {
                    $set:{
                        otp:hashOtp,
                        otpExp:new Date(now.getTime()+3*60*1000),
                        "otpChance.time":new Date(now.getTime()+60*1000),
                    },
                    $inc:{
                        "otpChance.chance":1
                    }
                },
                {new:true}
            );
            if(result.matchedCount!==1){
                return res.status(500).json({msg:"Server error"});
            }
            sendOtpEmail(email,otp);
            return res.status(200).json({msg:"Otp Has been sent"});
        }
        
    } catch (error) {
        return res.status(500).json({msg:"server error"})
    }
}

export const verifyEmailUpdateOtp = async(req,res)=>{

    const {otp} = req.body;
    const now = new Date();
    if(!otp) return res.status(400).json({msg:"Otp not entered"});
    const hashOtp = crypto.createHash("sha256").update(otp).digest("hex");
    try {
        
        const doc = await ProfileOtp.findOne(
            {
                userId:req.user._id,
                otp:hashOtp,
                otpExp:{$gt:now},
                "otpChance.time":{$lt:now},
            }
        );
         if(!doc){
            return res.status(400).json({msg:"Invalid OTP"});
         }

         const updateEmail = await User.updateOne(
            {_id:req.user._id},
            {$set:{
                email:doc.email
            }}
         );

         if(updateEmail.matchedCount!==1){
            
            return res.status(500).json({msg:"Update Failed"});
         }

         await ProfileOtp.findByIdAndDelete(doc._id);
            return res.status(200).json({msg:"Email Updated"});
    } catch (error) {
        console.log(error)
        return res.status(500).json({msg:"Server error"});
    }
}

export const updateAvatar = async(req,res)=>{
if(!req.file) return res.status(400).json({msg:"Upload file first"});
console.log(req.file)
try {
    const user = await User.findById(req.user._id).select("avatar");
    if(!user) return res.status(404).json({msg:"User not found"});
    const oldPublicId = user.avatar?.publicId;

    const result = await uploadToCloudinary(req.file.buffer);
    if(!result) return res.status(500).json({msg:"upload failed"});
    console.log(result);
    user.avatar.url=result.secure_url;
    user.avatar.publicId=result.public_id;
    await user.save()

    const deleted = await deleteFromCLoudinary(oldPublicId);
    console.log(deleted);
    
    return res.status(200).json({msg:"Prpfile Updated"});

} catch (error) {
    console.log(error);
    return res.status(500).json({msg:"Server Error! Try again"})
}   
}
