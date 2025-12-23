import express from "express";
import { uploads } from "../utils/storage.js";
import profileAuth from "../middlewares/profile.middleware.js";
import profile from "../controller/profile.controller.js";
const profileRoute = express.Router();

profileRoute.post("/",uploads.single("avatar"),profileAuth,profile);
profileRoute.post("/dob",async (req ,res)=>{
    const {dob}= req.body;
    const v = new Date(dob);
    const h = new Date();
    const age = h.getFullYear()-v.getFullYear()
    res.status(200).json({age,type:typeof(age)})
});
export default profileRoute