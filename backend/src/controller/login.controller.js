import { User } from "../model/userSchemas.js";
import { createAccessToken, createRefreshToken } from "../utils/tokenGenrator.js";

export const login = async (req,res)=>{
    //console.log("1")
    const {email} = req.body;
    const user = await User.findOne({email});
    try {
        const token = createAccessToken({email:user.email,_id:user._id});
        const refreshToken = createRefreshToken({email:user.email,_id:user._id});
        await User.updateOne(
            {_id:user._id},
            {$set:{token:refreshToken}},
            {runValidators:true}
        );
        res.cookie("token",token,{httpOnly:true,secure:false,sameSite:"lax"});
        res.cookie("refreshToken",refreshToken,
            {httpOnly:true,
                secure:false,
                sameSite:"lax",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
        return res.status(200).json({msg:"Login successs"});
    } catch (error) {
        return res.status(500).json({msg:"server error"});
    }
}