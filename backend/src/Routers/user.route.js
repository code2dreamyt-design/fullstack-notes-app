import express from 'express';
import { validateToken } from '../middlewares/validateToken.js';
import { User } from '../model/userSchemas.js';
import path from "path"

export const userRoute = express.Router();

userRoute.get("/profile/:id", async (req,res)=>{
    const {id} = req.params;
    const user = await User.findById(id);
    
    if(!user || !user.photo) {
        return res.status(404).json({ msg: "User or photo not found" });
    }

    const filePath = path.join("uploads", user.photo);
    return res.sendFile(filePath, { root: "." });
});
