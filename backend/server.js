import express from "express";
import cors from "cors"; //to makae the connection between server and the client working at diff ports
import cookieParser from "cookie-parser"; //express needs parsed data to process this one parses coookies
import dotenv from "dotenv";
import {registerRoute} from "./src/Routers/register.route.js"
import { connectDB } from "./src/config/db.js";
import { loginRoute } from "./src/Routers/login.route.js";
import { notesRoute } from "./src/Routers/notes.route.js";
import { validateToken } from "./src/middlewares/validateToken.js";
import { userRoute } from "./src/Routers/user.route.js";
import logoutRoute from "./src/Routers/logout.route.js";
import profileRoute from "./src/Routers/profile.route.js";
import userDetailsRoute from "./src/Routers/userDetails.route.js";
import emailVerifyRoute from "./src/Routers/emailVerify.route.js";
import passwordReset from "./src/Routers/resetPass.route.js";
import updateProfile from "./src/Routers/updateProfile.routes.js";
import { clientURL } from "./src/config/env.js";

dotenv.config(); 
connectDB(); //make the env available
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
    origin:clientURL,
    credentials:true
}));

app.use(express.json()); //parse the simple json data like plain application/json

app.use(cookieParser());

app.use((req, res, next) => {
  console.log(
    `[REQ] ${req.method} ${req.originalUrl}`,
    "Origin:",
    req.headers.origin || "none"
  );
  next();
});

app.get("/health",async (req,res)=>{
  return res.status(200).json({
    status:"ok",
    uptime:process.uptime(),
    timeStamp:new Date().toISOString()
  });
});
app.use('/register',registerRoute);

app.use('/login',loginRoute);

app.use("/notes",notesRoute);

app.use("/user",userRoute);

app.use("/profile",profileRoute);
app.use("/userDetails",userDetailsRoute);
app.use("/verifyemail",emailVerifyRoute);
app.use("/reset",passwordReset);
app.post("/checkToken",validateToken,async (req,res)=>{
    return res.status(200).json({msg:"good to go"});
});
app.post("/refreshToken",validateToken,(req,res)=>{
     return res.status(200).json({msg:"good to go"})
});

app.use("/updateProfile",updateProfile);

app.use("/logout",logoutRoute)
app.listen(PORT,()=>{
    console.log(`Server is running at port ${PORT}`);
});