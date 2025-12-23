import mongoose from "mongoose";
const notesSchema = new mongoose.Schema({
    title:{type:String,required:true},
    content:{type:String,required:true},
    userId:{type:mongoose.Schema.Types.ObjectId,required:true},
    isFav:{type:Boolean,default:false},
    createdAt:{type:Date,default:Date.now}
});

export const Note = mongoose.model("Note",notesSchema);