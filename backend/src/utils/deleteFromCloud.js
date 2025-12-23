import cloudinary from "cloudinary";

const deleteFromCLoudinary = async (publicId)=>{
    console.log("came in function")
    if(!publicId) throw new Error("PublicId needed");

        const deleted = await cloudinary.uploader.destroy(publicId,{
            resource_type:"image"
        });
        return deleted

}

export default deleteFromCLoudinary;




















// import cloudinary from "../config/cloudinary.js";

// const deleteFromCLoudinary = async (publicId) =>{
//     
//     const deleted = cloudinary.uploader.destroy(publicId,{
//         resource_type:"image"
//     });
//     return deleted
// };

// export default deleteFromCLoudinary;