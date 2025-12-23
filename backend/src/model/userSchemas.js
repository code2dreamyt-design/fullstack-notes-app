import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String},
    age:{type:Number,min:0},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    isValid:{type:Boolean,default:false},
    isVerified:{type:Boolean,default:false},
    verificationToken:{type:String},
    verficationExpiry:{type:Date},
    token:{type:String},
    dob:{type:String},
    avatar:{
        url:{type:String},
        publicId:{type:String},
    },
    otp:{type:String},
    otpExp:{type:Date},
    otpChance:{
        chance:{type:Number,default:0},
        time:{type:Date}
    },
    createdAt:{type:Date,default:Date.now}
});

userSchema.set("toJSON",{
    transform:(doc,ret)=>{
        delete ret.password,
        delete ret.token
        return ret;
    }
});

export const User = mongoose.model("User",userSchema);

