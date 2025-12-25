import dotenv from "dotenv";
dotenv.config();

export const registerKey = process.env.JWT_REG;
export const refreshKey = process.env.JWT_REFRESH;
export const secKey = process.env.JWT_ACCESS;
export const URI = process.env.MONGO_URI;
export const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
export const apiKey = process.env.CLOUDINARY_API_KEY;
export const apiSecret = process.env.CLOUDINARY_API_SECRET;
export const mailFrom = process.env.MAIL;
export const mailPass = process.env.MAIL_PASS;
export const emailKey = process.env.JWT_EMAIL;
export const passResetKey = process.env.JWT_RESET;
export const clientURL = process.env.CLIENT_URL;
export const isProd = process.env.NODE_ENV==="production";