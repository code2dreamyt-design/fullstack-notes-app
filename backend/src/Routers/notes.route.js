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

