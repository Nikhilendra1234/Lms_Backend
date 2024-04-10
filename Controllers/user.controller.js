
import User from "../models/user.model.js";
import AppError from "../utils/error.utils.js";
import cloudinary from 'cloudinary';
import fs from 'fs/promises'
import sendEmail from "../utils/sendEmail.js";
import crypto from 'crypto';

const cookieOption={
    maxAge:7*24*60*60*1000,
    httpOnly:true,
    secure:true
}
const register=async(req,res,next)=>{
    const{fullName,email,password}=req.body;
    console.log(email,fullName,password);
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

const forgotPassword=async(req,res,next)=>{
    const{email}=req.body;
    if(!email){
        return next(new AppError('Email is required',400));
    }

    const user=User.findOne({email});

    if(!user){
        return next(new AppError("User does not exist",400));
    }

    const resetToken=await user.getPasswordResetToken();

    await user.save();

    const resetPasswordUrl=`${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const subject='Reset password';
    const message=`you can reset your pasword by clicking <a href=${resetPasswordUrl} target='blank'>Reset your password </a>\nif the link does not work copy ${resetPasswordUrl} and paste in new tab.\n if not requested you can ignore. `
    try {
        await sendEmail(email,subject,message);

        return res.status(200).json({
            success:true,
            message:`Reset password token has been sent to ${email} successfully`
        })
    } catch (error) {
        user.forgotPasswordToken=undefined;
        user.forgotPasswordExpiry=undefined;

        await user.save();

        return next(new AppError(error.message,500));
    }

}

const resetPassword=async(req,res,next)=>{
    const {resetToken}=req.params;

    const password=req.body;

    const forgotPasswordToken=crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

    const user=await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry:{$gt:Date.now()}
    });

    if(!user){
        return next(new AppError("Token is invalid or expired , please try again",400));
    }

    user.password=password;
    user.forgotPasswordExpiry=undefined;
    user.forgotPasswordToken=undefined;

    await user.save();

    return res.status(200).json({
        success:true,
        message:'password changed successfully'
    });
}

const changePassword=async(req,res,next)=>{
    const{oldPassword,newPassword}=req.body;

    if(!oldPassword || !newPassword){
        return next(new AppError('Every field is required',400));
    }

    const userId=req.user;
    const user=await User.findById({userId}).select('+password');

    if(!user){
        return next(new AppError('User does not exist',400));
    }

    const isPasswordValid=User.comparePassword(oldPassword);

    if(!isPasswordValid){
        return next(new AppError("password is invalid, Try Again"),400);
    }

    user.password=newPassword;
    await user.save();

    user.password=undefined;

    return res.status(200).json({
        success:true,
        message:"password changed succesfully"
    });

}

const updateProfile=async(req,res,next)=>{
    const {id}=req.user;
    const {fullName}=req.body;

    const user=await User.findById({id});
    if(!user){
        return next(new AppError("user doies not exist",400));
    }
    if(res.fullName){
        user.fullname=fullName;    
    }

    if(req.file){
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
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

    return res.status(200).json({
        success:true,
        message:"profile uploaded successfully"
    })

}
export{register,login,logout,getProfile,forgotPassword,resetPassword,changePassword,updateProfile}