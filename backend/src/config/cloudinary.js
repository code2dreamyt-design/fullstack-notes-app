import { cloudName,apiKey,apiSecret } from "./env.js";
import {v2 as cloudinary} from "cloudinary"
cloudinary.config({
    cloud_name:cloudName,
    api_key:apiKey,
    api_secret:apiSecret
});
export default cloudinary;