import jwt from "jsonwebtoken";
import { emailKey } from "../config/env.js";
import { User } from "../model/userSchemas.js";

const verifyEmailToken = async (req,res,next)=>{
    console.log("yes i came here 1");
    const emailVerificationToken  = req.cookies.emailVerificationToken;
    if(!emailVerificationToken) return res.status(403).json({msg:"token not found"});
     let payload;
    try {
       payload = jwt.verify(emailVerificationToken,emailKey);
       
    } catch (error) {
        return res.status(500).json({msg:"Server error"});
    }
    const user = await User.findById(payload._id);
    if(!user) return res.status(404).json({msg:"user not found"});
    req.user = payload;
    next();
}
export default verifyEmailToken;