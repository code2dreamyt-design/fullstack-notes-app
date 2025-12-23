import express from "express";
import { validateToken } from "../middlewares/validateToken.js";
import userController from "../controller/userDetail.controller.js";

const userDetailsRoute = express.Router();

userDetailsRoute.get('/',validateToken,userController);

export default userDetailsRoute