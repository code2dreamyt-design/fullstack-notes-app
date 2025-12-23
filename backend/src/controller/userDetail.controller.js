import { User } from "../model/userSchemas.js";

const userController = async (req,res)=>{
    const id = req.user._id;
    try {
        const user = await User.findById(id);
        console.log(user);
        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({msg:"user not found"});
    }
}

export default userController