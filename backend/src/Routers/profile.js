// import express from "express";
// import { uploads } from "../multer/storage.js";
// import { checkDetail, userdetails } from "../middlewares/userDetails.js";
// import { User } from "../model/userSchemas.js";
// import uploadTocloudinary from "../utils/upload.js";
// import {validateToken} from "../middlewares/validateToken.js"
// import { Document } from "../model/documentSchema.js";
// import deleteFromCLoudinary from "../utils/deleteFromCloud.js";
// const profileRoute = express.Router();

// profileRoute.post("/",uploads.single("avatar"),checkDetail,userdetails,async (req,res)=>{
 
//     const user = await User.findById(req.user._id);
//     if(!user) return res.status(404).json({msg:"user not found "});
//     try {
//         const result = await uploadTocloudinary(req.file.buffer);
//         console.log(result);
        
//         await User.updateOne(
//             {_id:user._id},
//             {$set:{
//                 isValid:true,
//                 avatar:{
//                     url:result.secure_url,
//                     publicId:result.public_id
//                 }
//             }}
//         )
        
//         return res.status(200).json({msg:"uploaded"})
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({msg:"upload failed"})
//     }
// });
// profileRoute.post("/docs",uploads.fields([
//     {name:"avatar",maxCount:1},
//     {name:"docs",maxCount:2}
// ]),validateToken,async (req,res)=>{
//     const user = await User.findById(req.user._id);
//     if(!user) return res.status(404).json({msg:"user not found"});
//     try {
//     if(req.files.avatar && req.files.avatar[0]){
//         const uploaded = await uploadTocloudinary(req.files.avatar[0].buffer);
//         await User.updateOne(
//             {_id:user._id},
//             {$set:{
//                 url:uploaded.secure_url,
//                 publicId:uploaded.public_id
//             }}
//         )
//     }
//     if(req.files.docs && req.files.docs.length>0){
//         const buffer = req.files.docs.map((file)=>file.buffer);
//         const uploaded = await Promise.all(
//             buffer.map((buffer)=> uploadTocloudinary(buffer))
//         )
//         let docIn = uploaded.map((file)=>({
//             docUrl: file.secure_url,
//             publicId: file.public_id,
//              userId: req.user._id
//         }))
        
//     }  
//     return res.status(200).json({msg:"finished"})     
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({msg:"server error"})
//     }
// });

// profileRoute.delete("/profile/:id",validateToken,async (req,res)=>{
//     const publicId = req.params.id;
//     const user = await User.findById(req.user._id);
//     if(!user) return res.status(404).json({msg:"user not found"});
//     if(!publicId) return res.status(400).json("public id required")
//     try {
//         const deleted = await deleteFromCLoudinary(publicId);
//         await User.updateOne(
//             {_id:req.user._id},
//             {$unset:{avatar:""}}
//         ); 
//         console.log(deleted)
//         return res.status(200).json({msg:"deleted"})
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json({msg:"server error"})
//     }
// })

// export default profileRoute;