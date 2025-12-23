import { User } from "../model/userSchemas.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { sendOtpEmail } from "../utils/sendEmail.utils.js";
import { createPasswordResetToken } from "../utils/tokenGenrator.js";

// ==============================
// SEND OTP CONTROLLER
// ==============================
export const sendOTP = async (req, res) => {

/* ------------------------------
     1. Extract input + setup
  ------------------------------ */
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ msg: "Enter a valid email" });
  }

  // Use a single timestamp for the entire request lifecycle
  const now = new Date();

  // Progressive cooldown phases (in seconds)
  const phases = [60, 120, 600, 43200, 86400];

  try {

    /* ------------------------------
       2. Fetch user
    ------------------------------ */
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not Found" });
    }

     if(user.otpChance.chance>=5 && user.otpChance.time<now){
            
            user.otp=undefined;
            user.otpExp=undefined;
            user.otpChance.time=undefined;
            user.otpChance.chance=0;
            await user.save();
        }   //Reset limits 

        

  
    /* ------------------------------
       3. FIRST-TIME OTP GENERATION
       (No otpExp means no OTP exists)
    ------------------------------ */
    if (!user.otpExp) {

      const otp = crypto.randomInt(100000, 999999).toString();
      const hashotp = crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");

      // Persist OTP data
      user.otp = hashotp;
      user.otpExp = new Date(now.getTime() + 5 * 60 * 1000); // 1 min validity
      user.otpChance.time = new Date(now.getTime() + 60 * 1000); // initial cooldown
      user.otpChance.chance = 0;

      await user.save();

      // Send OTP email AFTER DB success
      await sendOtpEmail(email, otp);

      // Issue reset token
      const resetToken = createPasswordResetToken({
        email: user.email,
        _id: user._id
      });

      res.cookie("resetToken", resetToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
      });

      return res.status(200).json({
        msg: "OTP has been sent. Check email"
      });
    }

    /* ------------------------------
       4. COOLDOWN ACTIVE CHECK
    ------------------------------ */
    if (user.otpChance?.time && user.otpChance.time > now) {

      const resetToken = createPasswordResetToken({
        email: user.email,
        _id: user._id
      });

      res.cookie("resetToken", resetToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
      });

      return res.status(429).json({
        reason: "COOLDOWN_ACTIVE",
        msg: "Try again after cooldown"
      });
    }

    /* ------------------------------
       5. VALID OTP STILL EXISTS
    ------------------------------ */
    if (user.otpExp > now) {

      const resetToken = createPasswordResetToken({
        email: user.email,
        _id: user._id
      });

      res.cookie("resetToken", resetToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
      });

      return res.status(409).json({
        reason: "VALID_OTP_EXISTS",
        msg: "Check mail for the existing OTP"
      });
    }

    /* ------------------------------
       6. DAILY REQUEST LIMIT
    ------------------------------ */
    if (user.otpChance?.chance > 5) {
      return res.status(429).json({
        reason: "REQ_LIMIT_OVER",
        msg: "You can't request a new OTP today"
      });
    }

    /* ------------------------------
       7. RE-GENERATE OTP (RESEND)
    ------------------------------ */
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashotp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    const newCooldown = phases[user.otpChance.chance] * 1000;

    const updateResult = await User.updateOne(
      {
        _id: user._id,
        otpExp: { $lt: now },
        "otpChance.time": { $lte: now }
      },
      {
        $set: {
          otp: hashotp,
          otpExp: new Date(now.getTime() + 5 * 60 * 1000),
          "otpChance.time": new Date(now.getTime() + newCooldown)
          
        },
        $inc:{
            "otpChance.chance": 1
        }
      }
    );

    /* ------------------------------
       8. HANDLE RACE CONDITIONS
    ------------------------------ */
    if (updateResult.matchedCount === 0) {

      const latestUser = await User.findById(user._id);

      if (latestUser.otpChance?.time > now) {
        return res.status(429).json({
          reason: "COOLDOWN_ACTIVE",
          msg: "Try again after cooldown"
        });
      }

      if (latestUser.otpExp > now) {
        return res.status(409).json({
          reason: "VALID_OTP_EXISTS",
          msg: "Check mail for the existing OTP"
        });
      }

      if (latestUser.otpChance?.chance > 5) {
        return res.status(429).json({
          reason: "REQ_LIMIT_OVER",
          msg: "You can't request a new OTP today"
        });
      }

      return res.status(500).json({ msg: "Server error" });
    }

    /* ------------------------------
       9. SEND OTP EMAIL + RESPONSE
    ------------------------------ */
    await sendOtpEmail(user.email, otp);

    const resetToken = createPasswordResetToken({
      email: user.email,
      _id: user._id
    });

    res.cookie("resetToken", resetToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    return res.status(200).json({
      msg: "OTP has been sent. Check email"
    });

  } catch (error) {
    return res.status(500).json({
      msg: "Server error! Try again"
    });
  }
};


//this is the controller used when the otp is sent from the frontend to verify
export const  verifyOTP = async (req,res)=>{
     const {otp} = req.body;
     console.log(otp)
     if(!otp) return res.status(400).json({msg:"OTP was not sent"});
     const user = await User.findOne(
        {
            _id:req.user._id,
            otpExp:{$gt:Date.now()}
        }
    );
    if(!user) return res.status(400).json({msg:"Wrong OTP or Expired"});
     try {
        const hashed = crypto.createHash("sha256").update(otp).digest("hex");
     if(hashed===user.otp) {
        user.otp =undefined;
     user.otpExp=undefined;
    const resetToken = createPasswordResetToken({email:user.email,_id:user._id});
    res.cookie("resetToken",resetToken,{httpOnly:true,secure:false,sameSite:"lax"});
    return res.status(200).json({msg:"OTP Verified"});
     }else{
        return res.status(400).json({msg:"invalid otp"});
     }
     } catch (error) {
         return res.status(500).json({msg:"Verification failed"});
     }
     
}

//this is controller to reset the password after the otp verification 
export const resetPassword = async (req,res)=>{
    const {newPassword,confirmNewPassword} = req.body;
    if(!confirmNewPassword || !newPassword) return res.status(400).json({msg:"hdsbcjhdbjh"});
    if(newPassword !==confirmNewPassword) return res.status(400).json({msg:"PAssword mismatched"});;
    const hasPass = await bcrypt.hash(newPassword,10);
    console.log(hasPass)
    try {
        const user = await User.findOne({_id:req.user._id});
        if(!user) res.status(404).json({msg:"user not found"});
        user.password=hasPass;
        await user.save();
        console.log(user.password);
        res.clearCookie("resetToken",{httpOnly:true,secure:false,sameSite:"lax"})
         return res.status(200).json({msg:`${user.name} your pssword has been changed please login v `});
    } catch (error) {
        return res.status(500).json({msg:"Server error"});
    }
}

//this is to set the resend the otp 

// ==============================
// RESEND OTP CONTROLLER
// ==============================
export const resendOTP = async (req, res) => {

  const now = new Date();

  // Progressive cooldown phases (seconds)
  const phases = [60, 120, 600, 43200, 86400];

  try {

    /* ------------------------------
       1. Fetch authenticated user
    ------------------------------ */
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        msg: "User is not registered"
      });
    }

    /* ------------------------------
       2. Cooldown guard
    ------------------------------ */
    if (user.otpChance?.time && user.otpChance.time > now) {
      return res.status(429).json({
        reason: "COOLDOWN_ACTIVE",
        msg: "Wait till cooldown"
      });
    }

    /* ------------------------------
       3. Resend limit guard
    ------------------------------ */
    if (
      typeof user.otpChance?.chance === "number" &&
      user.otpChance.chance >= 5
    ) {
      return res.status(429).json({
        reason: "CHANCES_OVER",
        msg: "OTP resend limit reached"
      });
    }

    /* ------------------------------
       4. Generate OTP
    ------------------------------ */
    const otp = crypto.randomInt(100000, 999999).toString();
    const hashotp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    /* ------------------------------
       5. Compute cooldown safely
    ------------------------------ */
    const phaseIndex = Math.min(
      user.otpChance.chance,
      phases.length - 1
    );

    const cooldownMs = phases[phaseIndex] * 1000;

    /* ------------------------------
       6. Atomic update (race-safe)
    ------------------------------ */
    const result = await User.updateOne(
      {
        _id: user._id,
        "otpChance.time": { $lte: now }
      },
      {
        $set: {
          otp: hashotp,
          otpExp: new Date(now.getTime() + 5 * 60 * 1000),
          "otpChance.time": new Date(now.getTime() + cooldownMs)
        },
        $inc: {
          "otpChance.chance": 1
        }
      }
    );

    if (result.matchedCount !== 1) {
      return res.status(429).json({
        msg: "OTP already sent recently"
      });
    }

    /* ------------------------------
       7. Send OTP email
    ------------------------------ */
    await sendOtpEmail(user.email, otp);

    /* ------------------------------
       8. Issue reset token
    ------------------------------ */
    const resetToken = createPasswordResetToken({
      email: user.email,
      _id: user._id
    });

    res.cookie("resetToken", resetToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    return res.status(200).json({
      msg: "OTP Sent"
    });

  } catch (error) {
    return res.status(500).json({
      msg: "OTP generation failed"
    });
  }
};


//controller to set the limit of the resend btn and also check the limit of the resend request

export const setTimer =  async (req,res)=>{
    const user = await User.findById(req.user._id);
    const now = new Date();
    if(!user) return res.status(404).json({msg:"User not found"});
    
    const timeLeft = user.otpChance?.time?.getTime()-now.getTime()??0;
    if(timeLeft>0){
        return res.status(429).json({timeLeft:Math.floor(timeLeft/1000)});
    }
    else {
       return res.status(200).json({msg:"Resend otp is available"});
    }
}