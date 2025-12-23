import mongoose from "mongoose";

const docSchema = new mongoose.Schema({
    docUrl:{type:String,required:true},
    publicId:{type:String,required:true,unique:true},
    userId:{type:mongoose.Schema.Types.ObjectId,required:true},
    createdAt:{type:Date,default:Date.now}
});

export const Document = mongoose.model("Document",docSchema);