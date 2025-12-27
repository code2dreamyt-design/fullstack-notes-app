import nodemailer from "nodemailer";
import { mailFrom, mailPass } from "../config/env.js";
import { backendURL } from "../config/env.js";

const sendVerificationMail = async (email,token)=>{
  const link = `${backendURL}/verifyemail/${token}`;

  const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:mailFrom,
        pass:mailPass
    }
  });
  transporter.sendMail({
    from:mailFrom,
    to:email,
    subject:"Email Verification",
    html:`
    <h1>
    Click the link below to verify email
    </h1>
    <p>
    <a href=${link}>${link}</a>
    </p>
   `
  })
};

export const sendOtpEmail = async(email,otp)=>{
  const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
      user:mailFrom,
      pass:mailPass
    }
  });
  transporter.sendMail({
    from:mailFrom,
    to:email,
    subject:"OTP to reset password",
    html:`
    <p> OTP to reset your password is ${otp}</p>
    `
  })
}
export default sendVerificationMail;
