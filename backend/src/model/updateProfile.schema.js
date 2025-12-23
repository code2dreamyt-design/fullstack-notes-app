import mongoose from "mongoose";

const updateProfileCred = new mongoose.Schema({
    email:{type:String,unique:true,required:true},
    otp:{type:String},
    otpExp:{type:Date},
    otpChance:{
        chance:{type:Number,default:0,min:0},
        time:{type:Date}
    },
    userId:{type:mongoose.Schema.Types.ObjectId,required:true}
});
export const ProfileOtp = mongoose.model("ProfileOtp",updateProfileCred);