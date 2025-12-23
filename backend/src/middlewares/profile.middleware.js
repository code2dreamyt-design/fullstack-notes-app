import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { registerKey } from "../config/env.js";
import {User} from "../model/userSchemas.js"
dotenv.config();
const profileAuth = async (req,res,next)=>{
     const registerToken = req.cookies.registerToken;
     if(!registerToken) return res.status(401).json({msg:"Login again"});
     let payload;
     try {
        payload = jwt.verify(registerToken,registerKey);
        
     } catch (error) {
        return res.status(403).json({msg:"invalid token"});
     }
     const user = await User.findById(payload._id);
     if(!user) return res.status(404).json({msg:"User not Found"});
     const {name,dob} =req.body;
     if(!name || !dob) return res.status(400).json({msg:"Name and Required"});
     if(!req.file) return res.status(400).json({msg:"Upload Profile Picture frist"});
     req.user = {email:user.email,_id:user._id}
     next(); 
}
export default profileAuth;