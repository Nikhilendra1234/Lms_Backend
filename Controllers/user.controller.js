
import User from "../models/user.model.js";
import AppError from "../utils/error.utils.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises'

const cookieOption={
    maxAge:7*24*60*60*1000,
    httpOnly:true,
    secure:true
}
const register=async(req,res,next)=>{
    const{fullName,email,password}=req.body;

    if(!fullName || !email || !password){
        return next(new AppError("All fielda are required",400));
    }

    const userExists=User.findOne({email});
    if(userExists){
        return next(new AppError("User Already exists",400));
    }

    const user= await User.create({
        fullName,
        email,
        password,
        avatar:{
            public_id:email,
            secure_url:"cloudinary://896634264322625:JwMbtQ2YHaNhxK7wdY9CqaR3AeE@djztbl302"
        }
    });
    if(!user){
        return next(new AppError("User registration Failed",400));
    }
    // TODO:file upload
    if(req.file){
        try {
         const result=await cloudinary.v2.uploader.upload(req.file.path,{
             folder:'Backend',
             width:250,
             height:250,
             gravity:'faces',
             crop:'fill'
            });
     
            if(result){
             user.avatar.public_id=result.public_id;
             user.avatar.secure_url=result.secure_url;
            }
            //delete from server
            fs.rm(`uploads/${req.file.filename}`);
        } catch (error) {
         return next(
             new AppError(error || "file not uploaded,please try again",500)
         )
        }
    }

    await user.save();

    user.password=undefined;

    const token= await user.generateToken();

    res.cookie("token",token,cookieOption);

    res.status(201).json({
        success:true,
        message:"user Registered successfully",
        user
    });
}

const login=async(req,res,next)=>{

    try {
        const {email,password}=rew.body;

    if(!email || !password){
        return next(new AppError("All fiels are required",400));
    }

    const user=User.findOne({email}).select('+password');

    if(!user || !user.comparePassword(password)){
        return next(new AppError("Email or Password does not match",400));
    }

    const token=await User.generateToken();
    user.password=undefined;
    res.cookie("token",token,cookieOption);

    res.status(201).json({
        success:true,
        message:"user logged in successfully",
        user
    })
    } catch (error) {
        return next(new AppError(error.message,500));
    }
    

}

const logout=(req,res,next)=>{

        res.cookie("token",null,{
            maxAge:0,
            httpOnly:true,
            secure:true,
        });

        res.status(201).json({
            success:true,
            message:"User logged out successfully",
        });
}

const getProfile=(req,res,next)=>{

    try {
        const userId=req.user.id;
        const user=User.findById({userId});
    
        res.status(201).json({
            success:true,
            message:"user fetched successfully",
            user
        });
    } catch (error) {
        return next(new AppError("Failed to fetch user details",400));
    }


}

export{register,login,logout,getProfile}