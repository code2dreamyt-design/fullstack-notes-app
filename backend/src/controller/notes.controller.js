import { Note } from "../model/notes.schema.js";

export const getNotesController = async(req,res)=>{
    const {search,fav,sort,page,limit} = req.query;
    let filter = {userId:req.user._id};

    if(search){
        filter.$or = [
            {title:{$regex:search,$options:"i"}},
            {content:{$regex:search,$options:"i"}}
        ]
    }
    if(fav) filter.isFav=fav==="true";

    let sortOpt = {createdAt:-1};
    if(sort==="latest") sortOpt={createdAt:-1};
    if(sort==="oldest") sortOpt={createdAt:1};
    if(sort==="title") sortOpt={title:1};

    let limitVal = Math.min(Math.max(parseInt(limit)||10,1),30);
    let pg = Math.max(parseInt(page)||1,1);

    const totalDoc = await Note.countDocuments({userId:req.user._id});
    const totalPages = Math.ceil(totalDoc/limitVal);
    console.log(totalDoc)
    if(totalDoc === 0){ 
        return res.status(404).json({msg:"Notes Empty"});
    }
    else if(totalPages<pg){
        pg=totalPages;
    }
    
    let skip = (pg-1) * limitVal;
    const notes = await Note.find(filter).sort(sortOpt).skip(skip).limit(limitVal);

    return res.status(200).json(notes);
;}


export const setNotesController = async(req,res)=>{
    
    const {title,content} =  req.body;
    
    if(!title || !content) return res.status(400).json({msg:"Title and content required"}); 
     try {
        const note = await Note.create(
            {
            title,
            content,
            userId:req.user._id
            }
        );
        return res.status(200).json(note)
     } catch (error) {
        return res.status(500).json({
            msg:"failed to add note"
        }) 
     } 
    //console.log("abc");
    res.json({msg:"set"});
}

export const deleteNotesController = async (req,res)=>{
    const {id}= req.params;
    const notes = await Note.findOne({_id:id});
    if(!notes) return res.status(404).json({msg:"note not found"});
    try {
        await Note.deleteOne({_id:id});
        return res.status(200).json({msg:"Delete Sucess"});
    } catch (error) {
        return res.status(500).json({msg:"Can not delete"});
    }
    
}
export const updateNote = async (req,res)=>{
    const {title,content} = req.body;
    const {id} = req.params;
    if(!title||!content) return res.status(400).json({msg:"title and content required"});
    const note = await Note.find({_id:id});
    if(!note) return res.status(500).json({msg:"note not found"});
    try {
        await Note.updateOne(
            {_id:id},
            {title,content},
            {new:true,runValidators:true}
        );
        return res.status(200).json({msg:"updated"});
    } catch (error) {
        return res.status(500).json({msg:"not updated"});
    }
}

export const addToFav = async (req,res)=>{
    const {id}= req.params;
    const note = await Note.findOne({_id:id});
    if(!note) return res.status(404).json({msg:"note not found"});
    note.isFav = !note.isFav;
    await note.save();
    return res.status(200).json({msg:"added to fav"})
}