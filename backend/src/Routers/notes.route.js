import express from "express";
import { User } from "../model/userSchemas.js";
import { Note } from "../model/notes.schema.js";
import { validateToken } from "../middlewares/validateToken.js";
import { getNotesController,updateNote,setNotesController,deleteNotesController, addToFav } from "../controller/notes.controller.js";



export const notesRoute = express.Router();

notesRoute.get("/",validateToken,getNotesController); 
notesRoute.post("/",validateToken,setNotesController);
notesRoute.delete("/:id",validateToken,deleteNotesController); 
notesRoute.put("/:id",validateToken,updateNote); 
notesRoute.patch("/:id",validateToken,addToFav);




// notesRoute.get("/",validateToken,async (req,res)=>{
//     const {search,fav,limit,page,sort} = req.query;

//     let filter = {userId:req.user._id};

//     if(search){
//         filter.$or = [
//           {title:{$regex:search,$options:"i"}},
//           {content:{$regex:search,$options:"i"}}
//         ]
//     }

//     if(fav) filter.isFav = fav === "true";

//     let sortOpt = {createdAt:-1};
//     if(sort==="latest") sortOpt = {createdAt:-1};
//     if(sort==="oldest") sortOpt = {createdAt:1};
//     if(sort==="title") sortOpt = {title:1};

//     let limitVal = Math.min(Math.max(parseInt(limit) || 10,1),30);


//     let pg = Math.max(parseInt(page)||1,1);
//     const totalDoc= await Note.countDocuments(filter);
//     const totalPages =Math.ceil(totalDoc/limitVal);

//     if(totalDoc===0) {
//         return res.status(404).json({msg:"Not found"});
//     }
//     else if(totalPages<pg){
//         pg=totalPages;
//     }
//     let skip;
//     skip=(pg-1) * limitVal;
    
//     const notes = await Note.find(filter).sort(sortOpt).skip(skip).limit(limitVal);
//     return res.status(200).json({
//         notes,
//         totaNotes :totalDoc,
//         totalPages:totalPages,
//         currentPage:pg
//     });
// });
// notesRoute.post("/",validateToken,async (req,res)=>{
//     const {title,content} = req.body;
//     const userId = req.user._id;
//     if(!title || !content) return res.status(400).json({msg:"title and content requires"});
//     try {
//         await Note.create({
//             title,
//             content,
//             userId
//         });
//         return res.status(200).json({msg:"note added"})
//     } catch (error) {
//         return res.status(500).json({msg:"failed to add note"});
//     }
// });
// notesRoute.put("/:id",validateToken,async (req,res)=>{
//     const {title,content} = req.body;
//     const {id} = req.params;
//     const userId = req.user._id;
//     if(!title || !content) return res.status(400).json({msg:"title and content requires"});
//     const note = await Note.findOne({_id:id,userId});
//     if(!note) return res.status(404).json({msg:"note not found"}); 
//     try {
//         await Note.findOneAndUpdate(
//             {_id:id,userId},
//             {title,
//             content},
//             {new:true,runValidators:true}
//         );
//         return res.status(200).json({msg:"note updated"})
//     } catch (error) {
//         return res.status(500).json({msg:"failed to edit note"});
//     }
// });

// notesRoute.patch("/:id/fav",validateToken,async (req,res)=>{
//     const {id} = req.params;
//     const userId = req.user._id;
//     const note = await Note.findOne({_id:id,userId});
//     if(!note) return res.status(404).json({msg:"note not found"}); 
//     try {
//         note.isFav=!note.isFav;
//         await note.save();
//         return res.status(200).json({msg:note.isFav ? "Note added to Favorite":"Note removed from Favorite"});
//     } catch (error) {
//         return res.status(500).json({msg:"failed to add note to Favorite"});
//     }
// });

// notesRoute.delete("/:id",validateToken,async (req,res)=>{
//     const {id} = req.params;
//     const userId = req.user._id;
//     const note = await Note.findOne({_id:id,userId});
//     if(!note) return res.status(404).json({msg:"note not found"}); 
//     try {
//         await Note.deleteOne({_id:id,userId})
//         return res.status(200).json({msg:"deleted"});
//     } catch (error) {
//         return res.status(500).json({msg:"failed to delete note"});
//     }
// });

// notesRoute.post("/field",uploads.fields([{name:"post1",maxCount:1},{name:"post2",maxCount:2}]),validateToken,(req,res)=>{

//   const {post1,post2} = req.files;
//   try {
//     console.log(post1[0].path);
//     console.log(post2.map(file=>file.path));
//     return res.status(200).json("files uploaded");
//   } catch (error) {
//    return
//     res.status(500).json("server error")
//   }
// });

