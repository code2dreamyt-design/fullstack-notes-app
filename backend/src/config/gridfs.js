import multer from "multer";
import { GridFSBucket } from "mongodb";
import mongoose from "mongoose";

let bucket;

export const initGridFS = async ()=>{
    bucket = new GridFSBucket(mongoose.connection.db,{
        bucketName:"uploads"
    });
}

export const getBucket = ()=>bucket;