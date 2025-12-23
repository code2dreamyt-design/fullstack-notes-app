import { User } from "../model/userSchemas.js";
import { createAccessToken, createRefreshToken, createRegisterToken } from "../utils/tokenGenrator.js";
import uploadToCloudinary from "../utils/upload.js"

const profile = async (req, res) => {
    const { name, dob } = req.body;
    const dobDate= new Date(dob);
    const today = new Date();
    const age = today.getFullYear()-dobDate.getFullYear();
    try {
        //console.log("come")
        if (!req.file) {
            return res.status(400).json({ msg: "File is required" });
        }

        const result = await uploadToCloudinary(req.file.buffer);
        const token = createAccessToken(req.user);
        const refreshToken = createRefreshToken(req.user);
        await User.updateOne(
            { _id: req.user._id },
            {
                $set: {
                    name, 
                    dob,
                    age,
                    token:refreshToken,
                    isValid: true,
                    avatar: {
                        url: result.secure_url,
                        publicId: result.public_id
                    }
                }
            },
            { runValidators: true }
        );
        res.cookie("token",token,{httpOnly:true,secure:false,sameSite:"lax"});
        res.cookie("refreshToken",refreshToken,{httpOnly:true,secure:false,sameSite:"lax"});

        res.clearCookie("registerToken",{httpOnly:true,secure:false,sameSite:"lax"});
         
        return res.status(200).json({ msg: "Profile updated successfully" });
    } catch (error) {
        console.error("Profile update error:", error);
       return  res.status(500).json({ msg: "Profile update failed" });
    }
};

export default profile;