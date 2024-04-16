import Course from "../models/course.model.js";
import AppError from "../utils/error.utils.js";

const getAllCourses=async(req,res,next)=>{
    try {
        const courses=await Course.find({}).select('-lectures');

    if(!courses){
        return next(new AppError(500,"Failed to fetch courses"));
    }

    return res.status(200).json({
        success:true,
        message:"Course fetched successfully",
        courses
    });
    } catch (error) {
        return next(new AppError(500,"Something went wrong , please try again"));
    }

}

const getLecturesById=async(req,res,next)=>{
    try {
        const {id}=req.params;

    if(!id){
        return next(new AppError(400,"Course id not found "));
    }

    const lectures=await Course.findById(id,{lectures});

    if(!lectures){
        return next(new AppError(500,"Failed to fetch the lectures"));
    }

    return res.status(200).json({
        success:true,
        message:"Lectures fetched successfully",
        lectures
    });
    } catch (error) {
        return next(new AppError(500,"Something went wrong , please try again"));
    }

}

export {getAllCourses,getLecturesById}