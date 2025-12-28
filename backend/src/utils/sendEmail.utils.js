import {Resend} from "resend";
import { mailFrom,resendApiKey } from "../config/env.js";

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
  console.log("Result crossed");
  if(result.data?.id) return true;
  if(result.error) throw new Error(result.error.message);
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export default sendEmail;
