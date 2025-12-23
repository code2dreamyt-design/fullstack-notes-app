import express from "express";
import { validateToken } from "../middlewares/validateToken.js";
import { uploads } from "../utils/storage.js";
import {sendUpdateOtp,verifyEmailUpdateOtp,updateAvatar }from "../controller/updateProfile.controller.js"

const updateProfile = express.Router();

updateProfile.post("/sendOtp",validateToken,sendUpdateOtp);
updateProfile.post("/verifyOtp",validateToken,verifyEmailUpdateOtp);
updateProfile.post("/avatar",uploads.single("avatar"),validateToken,updateAvatar);

export default updateProfile;