import cloudinary from "../config/cloudinary.js"
import stream from "stream"
const uploadToCloudinary = async (bufferFile)=>{
    return new Promise((resolve,reject)=>{
        const uploader = cloudinary.uploader.upload_stream({
            resource_type:"image",
        },(err,result)=>{
            if(err) reject(err);
            else resolve(result);
        });
        const readable = new stream.PassThrough();
        readable.end(bufferFile);
        readable.pipe(uploader);
    });
}
export default uploadToCloudinary;