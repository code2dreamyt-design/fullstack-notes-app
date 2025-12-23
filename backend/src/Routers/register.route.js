import express from "express";
import { authReg } from "../middlewares/validateReg.js";
import register from "../controller/register.controller.js";

export const registerRoute = express.Router();


registerRoute.post("/",authReg,register);

// registerRoute.post("/userdetails",uploads.single("photo"),checkDetail,userdetails,async (req,res)=>{
//     const user = await User.findOne({_id:req.user._id});
//     try { 
//         await User.findByIdAndUpdate(
//           {_id:req.user._id},
//           {isValid:true,
//           photo:req.file.filename},
//           {new:true,runValidators:true}
//         );
//         console.log(req.file);
//         res.clearCookie('registerToken',{httpOnly:true,secure:false,sameSite:"lax"})
//          return  res.status(200).json({msg:"ok"})

//     } catch (error) {
//         return res.status(500).json("error")
//     }
// });


// registerRoute.post("/photo",uploads.single("photo"),validateToken,async (req,res)=>{

//   if(!req.file) return res.status(400).json({msg:"upload a file first"});
//   const user = await User.findById(req.user._id);

//   if(!user) return res.status(404).json({msg:"user not found"});

//   const bucket = getBucket();

//   const uploadStream = bucket.openUploadStream(req.file.originalname,{
//     contentType:req.file.mimetype
//   });
//   uploadStream.end(req.file.buffer);

//   uploadStream.on("finish",async ()=>{
//     await User.updateOne(
//       {_id:user._id},
//       {photo:uploadStream.id},
//       {runValidators:true}
//     );

//     return res.status(201).json({
//       msg:"uploaded"
//     });
//   });

//   uploadStream.on("error",(err)=>{
//     console.log(err);
//     return res.status(500).json({MSG:"upload failed"})
//   });
// });

// //gridfs bucket try
// registerRoute.get("/photo/:id",validateToken,async (req,res)=>{
//   const user = await User.findById(req.params.id);
//   if(!user||!user.photo) return res.status(404).json({msg:"user not found"});
//   const bucket = getBucket();
//   const downloadStream = bucket.openDownloadStream(user.photo);
//   res.set("Content-Type","image/jpeg");
//   downloadStream.pipe(res);
//   downloadStream.on("error",(err)=>{
//     console.log(err);
//      return res.status(500).json({MSG:"download failed"});
//   });
// });

// registerRoute.post("/cld",uploads.single("pic"),async (req,res)=>{
//   if(!req.file) return res.status(404).json({msg:"pic not found"});
//   const result =await uploadTocloudinary(req.file.buffer);
//   await Image.create({
//     image:{
//     url:result.secure_url,
//     publicId:result.public_id
//     }
//   })
//   console.log(result);
//   return res.status(200).json({msg:"done"});
// });

// registerRoute.post("/files",uploads.fields([{name:"avatar",maxCount:1},{name:"docs",maxCount:3}]),async (req,res)=>{
//   try {
//     let response={};
//     if(req.files.avatar && req.files.avatar[0]){
//       const uploadAvt = await uploadTocloudinary(req.files.avatar[0].buffer);
//       response.avatar = {
//         url:uploadAvt.secure_url,
//         publicId:uploadAvt.public_id
//       }
//     } 

//     if(req.files.docs && req.files.docs.length>0){
//       let uploadedDocs = [];
//       for(let file of req.files.docs){
//         const uploadDOc = await uploadTocloudinary(file.buffer);
//         uploadedDocs.push({
//           url:uploadDOc.secure_url,
//           publicId:uploadDOc.public_id
//         });
//       }
//       response.docs = uploadedDocs;
//     }
//     if(Object.keys(response).length===0){
//       return res.status(400).json({mag:"bad request"})
//     }
//     return res.status(200).json({
//       msg:"done",
//       response,
//     });
//   } catch (error) {
//     console.log(error)
//   res.status(500).json({msg:"failed"})
//   }
// });

// registerRoute.delete("/deleteImg/:id",async (req,res)=>{
//   try {
//       const img = await Image.findById(req.params.id);
  
//   if(!img) return res.status(404).json({msg:"image not found"});

//   const response = await deleteFromCLoudinary(img.image.publicId);

//   await Image.findByIdAndDelete(req.params.id);

//   return res.status(200).json({msg:"deleted"});
//   } catch (error) {
//     console.log(error)
//     return res.status(500).json({msg:"failed"});
//   }

// })





