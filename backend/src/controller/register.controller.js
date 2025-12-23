import { User } from "../model/userSchemas.js";
import bcrypt from "bcrypt"
import { createEmailVerificationToken} from "../utils/tokenGenrator.js";
import crypto from "crypto";
import sendVerificationMail from "../utils/sendEmail.utils.js";

const  register = async (req,res)=>{
    const {email,password}= req.body;

    const isExist = await User.findOne({email});
    if(isExist) return res.status(409).json({msg:"Email is taken by another account"});

    const hashPass = await bcrypt.hash(password,10);
    const verificationToken = crypto.randomBytes(32).toString("hex");
    try {
      const user = await  User.create({
            email,
            password:hashPass,
            verificationToken,
            verficationExpiry:Date.now() + 5*60*1000
        });
  sendVerificationMail(email,verificationToken);
        const emailVerificationToken = createEmailVerificationToken({email:user.email,_id:user._id});
        res.cookie("emailVerificationToken",emailVerificationToken,{httpOnly:true,secure:false,sameSite:"lax"});
        //token need to be created for detail add

        return res.status(200).json({msg:"Verify your email"})
    } catch (error) {
        return res.status(500).json({msg:"Server error"})
    }
} 
            // const verificationToken =  crypto.randomBytes(32).toString("hex");
            // verificationToken,
            // verficationExpiry:Date.now()*15*60*1000

// export const emailver = async (req,res)=>{
//     const {email,password} = req.body;
//      const isExist = await User.findOne({email});
//      if(isExist) return  res.status(409).json({msg:"user exist"});
//      const hashPass = await bcrypt.hash(password,10);
//      const verificationToken = crypto.randomBytes(32).toString("hex");
//     // const hasedToken = await bcrypt.hash(verificationToken,10);
//      try {
//         const user = await User.create(
//             {
//                 email,
//                 password:hashPass,
//                 verificationToken,
//                 verficationExpiry:Date.now()+15*60*1000
//             }
//         );
//         sendVerificationMail(email,verificationToken);
//         return res.status(200).json(user)
//      } catch (error) {
//         return res.status(500).send("error")
//      }
// }
export default register