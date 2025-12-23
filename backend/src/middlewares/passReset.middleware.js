import jwt from "jsonwebtoken";
import { passResetKey } from "../config/env.js";

const checkPassResetToken = async (req,res,next)=>{
    const resetToken = req.cookies.resetToken;

    if(!resetToken) return res.status(401).json({msg:"token not found"});
    try {
        const payload = jwt.verify(resetToken,passResetKey);
        req.user = payload;
        next();
    } catch (error) {
        return res.status(500).json({msg:"server error"});
    }
}
export default checkPassResetToken