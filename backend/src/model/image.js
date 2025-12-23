import mongoose from "mongoose";

const imageSchema = mongoose.Schema({
    image:{
        url:{type:String,required:true},
        publicId:{type:String,required:true}
    }
});

export const Image = mongoose.model("Image",imageSchema);

