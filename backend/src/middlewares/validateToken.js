import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../model/userSchemas.js";
import { createAccessToken, createRefreshToken } from "../utils/tokenGenrator.js";
import { refreshKey, secKey } from "../config/env.js";
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
        res.cookie("token",newToken,{
            httpOnly:true,
            secure:false,
            sameSite:"lax"
        });
        res.cookie(
            "refreshToken",newRefreshToken,
            {httpOnly:true,
                secure:false,
                sameSite:"lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
        req.user = {email:user.email,_id:user._id};

        next();

    } catch (error) {
        return res.status(500).json({msg:"server error"})
//     } 
    }
}

// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import { User } from "../model/userSchemas.js";
// import { createAccessToken, createRefreshToken } from "../utils/tokenGenrator.js";

// dotenv.config();

// const refreshKey = process.env.JWT_REFRESH;
// const accessKey = process.env.JWT_ACCESS;

// export const validateToken = async (req,res,next)=>{
//     console.log("entered")
//     const token = req.cookies.token;
//     const refreshToken = req.cookies.refreshToken;

//     if(!token||!refreshToken) return res.status(401).json({msg:"Token not found try again"});

//     try {
//         const accesPayload = jwt.verify(token,accessKey);
//         req.user = accesPayload;
//         return next();
//     } catch (error) {
//         console.log("Token is expired checking for renewal");
//     }
//     let payload;

//     try {
//         payload = jwt.verify(refreshToken,refreshKey)
        
//     } catch (error) {
//         return res.status(403).json({msg:"Token expired login again"});
//     }

//     const user= await User.findOne({_id:payload._id,"tokens.token":refreshToken});
//     if(!user) return res.status(404).json({msg:"user not found "});

//     const newToken = createAccessToken({email:user.email,_id:user._id});
//     const newRefreshToken = createRefreshToken({email:user.email,_id:user._id});

//     try {
//         await User.updateOne(
//             {_id:payload._id},
//             {$pull:{tokens:{token:refreshToken}}},
//             {runValidators:true}
//         );

//          await User.updateOne(
//             {_id:payload._id},
//             {$push:{tokens:{token:newRefreshToken}}},
//             {runValidators:true}
//         );

//         res.cookie("token",newToken,{httpOnly:true,secure:false,sameSite:"lax"}); 
//         res.cookie("refreshToken",newRefreshToken,{httpOnly:true,secure:false,sameSite:"lax"}); 

//         req.user={_id:user._id,email:user.email}
//         return next();
//     } catch (error) {
//         return res.status(500).json({msg:"server error"})
//     } 
    
// }