import jwt from "jsonwebtoken";

const generateTokenAndSetCookie=(userId,res)=>{
    const token=jwt.sign({userId}, process.env.JWT_KEY,{
        expiresIn:'15d'
    }); 
    res.cookie("jwt", token , {maxAge:30*24*60*60*1000,httpOnly: true}); // httpOnly is to prevent client side scripting  
}
export default generateTokenAndSetCookie;