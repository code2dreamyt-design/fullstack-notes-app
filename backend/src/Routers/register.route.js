import express from "express";
import { authReg } from "../middlewares/validateReg.js";
import register from "../controller/register.controller.js";

export const registerRoute = express.Router();


registerRoute.post("/",authReg,register);







