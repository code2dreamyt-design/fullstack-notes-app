import express from "express";
import logoutController from "../controller/logout.controller.js";

const logoutRoute = express.Router();

logoutRoute.get("/",logoutController);

export default logoutRoute;