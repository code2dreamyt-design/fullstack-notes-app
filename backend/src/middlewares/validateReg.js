export const authReg = async (req,res,next)=>{
    const {email,password,confirmPassword} = req.body;
    if(!email || !password || !confirmPassword) return res.status(400).json({msg:"enter all the inputs"});
    if(password!==confirmPassword) return res.status(400).json({msg:"password does not match"});
    next();
}