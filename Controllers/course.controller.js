import Course from "../models/course.model.js";
import AppError from "../utils/error.utils.js";
import cloudinary from 'cloudinary';

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

const createCourse=async(req,res,next)=>{
    try {
        const{title,description,category,createdBy}=req.body;

    if(!title || !description || !category || !createdBy){
        return next(new AppError("All fields are required",400));
    }

    const course=await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail:{
            public_id:"Dummu",
            secure_url:"Dummy"
        }
    });

    if(!course){
        return next(new AppError("Course could not created",500));
    }

    if(req.file){
        try {
            const result=await cloudinary.v2.uploader.upload(req.file.path,{
                folder:"Backend"
            });
    
            if(result){
                course.thumbnail.public_id=result.public_id;
                course.thumbnail.secure_url=result.secure_url;
            }
            fs.rm('/uploads',req.file.filename);
        } catch (error) {
            return next(new AppError(error.message,500));
        }
        
    }

    await course.save();

     res.status(200).json({
        success:true,
        message:"Course Created Successfully",
        course
    })
    } catch (error) {
        return next(new AppError(error.message,500));
    }
}




const updateCourse=async(req,res,next)=>{
    try {
        const{id}=req.params;

        const course=await Course.findByIdAndUpdate(id,
            {
                $set:req.body
            },
            {
                runValidators:true
            }
        );

        if(!course){
            return next("Course doesnot exist ",400);
        }

        res.status(200).json({
            success:true,
            message:"Course updated successfully",
            course
        });
    } catch (error) {
        return next(new AppError(error.message,500));
    }
}

const removeCourse=async(req,res,next)=>{
    try {
        const {id}=req.params;

    if(!id){
        return next(new AppError("Course id is required",400));
    }

    const course=await Course.findByIdAndDelete(id);

    if(!course){
        return next(new AppError("Couorse doesn not exist",400));
    }
    res.status(200).json({
        success:true,
        message:"Course deleted successfully",
        Course
    });

    } catch (error) {
        return next(new AppError(error.message,500));
    }
}

const addLecturesToCourse=async(req,res,next)=>{
    try {
        const {id}=req.params;

    const {title,description}=req.body;

    if(!id || !title || !description){
        return next(new AppError("All fields are required",400));
    }

    const course=await Course.findById(id);

    if(!course){
        return next(new AppError("Course does not exist",400));
    }

    const lectureData={
        title,
        description,
        lecture:{}
    }
    if(req.file){
        try {
            const result=await cloudinary.v2.uploader.upload(req.file.path,{
                folder:"Backend"
            });
    
            if(result){
                lectureData.lecture.public_id=result.public_id;
                lectureData.lecture.secure_url=result.secure_url;
            }
            fs.rm('/uploads',req.file.filename);
        } catch (error) {
            return next(new AppError(error.message,500));
        }
    }

    course.lectures.push(lectureData);
    course.noOfLectures=lectures.length;

    await Course.save();

    res.status(200).json({
        success:true,
        message:"Lecture Added successfully",
        course
    });
    
    } catch (error) {
        return next(new AppError(error.message,500));
    }

}

export {getAllCourses,
    getLecturesById,
    createCourse,
    updateCourse,
    removeCourse,
    addLecturesToCourse 
}