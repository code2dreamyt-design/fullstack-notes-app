import express from "express";
import {resendOTP, resetPassword, sendOTP,setTimer,verifyOTP} from "../controller/resetPassword.controller.js"
import checkPassResetToken from "../middlewares/passReset.middleware.js";
const passwordReset = express.Router();

passwordReset.post("/sendOTP",sendOTP);

passwordReset.post("/verifyotp",checkPassResetToken,verifyOTP);

passwordReset.post("/resetpass",checkPassResetToken,resetPassword);
passwordReset.get("/resendotp",checkPassResetToken,resendOTP);
passwordReset.get("/getTimer",checkPassResetToken,setTimer);
export default passwordReset