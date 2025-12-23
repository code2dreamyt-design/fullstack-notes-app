import { User } from "../model/userSchemas.js";

const logoutController = async (req,res)=>{
    const token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;
    if(!token||!refreshToken) return res.status(200).json({msg:"logged out already"});
    const user = await User.findOne({token:refreshToken});
    if(user){
            await User.updateOne(
                {_id:user._id},
                {$set:{
                    token:''
                }}
            );
            res.clearCookie("token",{httpOnly:true,secure:false,sameSite:"lax"});
            res.clearCookie("refreshToken",{httpOnly:true,secure:false,sameSite:"lax",
            maxAge: 7 * 24 * 60 * 60 * 1000});
            return res.status(200).json({msg:"logout done"});
}
}
export default logoutController;