import fs from "fs"
import path from "path";




export const authGal = async (req,res,next)=>{
    const {title,description} = req.body;

    if(!title || !description){
        if(req.files && req.files.length>0){
            for(const file of req.files){
                fs.unlinkSync(file.path );
            }
        }
        return res.status(400).json({msg:"add title and descriptioin"});
    }
    if(!req.files || req.files.length===0){
         return res.status(400).json({msg:"add atleast one phtoto"});
    }
    for(let file of req.files){
        if(!file.mimetype.startsWith("image/")){
            fs.unlinkSync(file.path );
            return res.status(400).json({msg:"image only"});
        }
        if(file.size>2*1024*1024){
            fs.unlinkSync(file.path );
            return res.status(400).json({msg:"2 mb max"});
        }
    }
    next();
}