import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../model/userSchemas.js";
import { createAccessToken, createRefreshToken } from "../utils/tokenGenrator.js";
import { refreshKey, secKey } from "../config/env.js";
import { isProd } from "../config/env.js";
dotenv.config();

export const validateToken = async (req,res,next)=>{
    const token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;
    console.log("1")
    if(!token || !refreshToken) return res.status(401).json({msg:"token not found try again"});
    try {
        console.log("2")
        const accessPayload = jwt.verify(token,secKey);
        req.user = accessPayload;
        return next();
    } catch (error) {
       console.log("Token expired checking for refresh"); 
    }
    let payload;
    try {
        console.log("3");
        payload = jwt.verify(refreshToken,refreshKey);
        //req.user = payload;
    } catch (error) {
        
        return res .status(403).json({msg:"token expirred"})
    }
    const user = await User.findOne({_id:payload._id,token:refreshToken});
    if(!user) return res.status(404).json({msg:"user not found "});
     
    try {
        const newToken = createAccessToken({email:user.email,_id:user._id,});
         const newRefreshToken = createRefreshToken({email:user.email,_id:user._id,});
        await User.updateOne(
            {_id:payload._id},
            {$unset:{token:""}},
            {runValidators:true}
        );
        await User.updateOne(
            {_id:payload._id},
            {$set:{token:newRefreshToken}},
            {runValidators:true}
        );
        res.cookie("token",newToken,{httpOnly:true,
                        secure:isProd,
                        sameSite:isProd?"none":"lax",
                        maxAge:15*60*1000});
        res.cookie("refreshToken",newRefreshToken,
                    {httpOnly:true,
                        secure:isProd,
                        sameSite:isProd?"none":"lax",
                        maxAge: 7 * 24 * 60 * 60 * 1000
                    });
        req.user = {email:user.email,_id:user._id};

        next();

    } catch (error) {
        return res.status(500).json({msg:"server error"})
//     } 
    }
}
