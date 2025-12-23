import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { registerKey,refreshKey,secKey,emailKey, passResetKey } from "../config/env.js";
dotenv.config();
export const createRegisterToken = (payload)=>{
    return jwt.sign(payload,registerKey,{expiresIn:"15m"})
}
export const createRefreshToken = (payload)=>{
    return jwt.sign(payload,refreshKey,{expiresIn:"7d"});
}
export const createAccessToken = (payload)=>{
    return jwt.sign(payload,secKey,{expiresIn:"1h"});
}
export const createEmailVerificationToken = (payload)=>{
    return jwt.sign(payload,emailKey,{expiresIn:"15m"});
}
export const createPasswordResetToken = (payload)=>{
    return jwt.sign(payload,passResetKey,{expiresIn:"15m"});
}