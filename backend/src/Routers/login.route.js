import express from "express";
import { login } from "../controller/login.controller.js";
import {authLogin} from "../middlewares/validateLogin.js"
import { validateToken } from "../middlewares/validateToken.js";
import loginStatus from "../controller/loginStatus.controller.js";
export const loginRoute = express.Router();

loginRoute.post("/",authLogin,login);
loginRoute.post("/checkme",validateToken,loginStatus);