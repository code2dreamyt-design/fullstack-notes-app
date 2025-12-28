import {Resend} from "resend";
import { mailFrom, mailPass, resendApiKey } from "../config/env.js";
import { backendURL } from "../config/env.js";

const resend = new Resend(resendApiKey);
const sendEmail = async ({to,subject,html})=>{
  try {
    console.log("email fun hit")
    const result = await resend.emails.send({
    from:mailFrom,
    to,
    subject,
    html
  });
  if(result.error) throw new Error(result.error.message);
  } catch (error) {
    console.log(error.message)
  }
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
export default sendEmail;
