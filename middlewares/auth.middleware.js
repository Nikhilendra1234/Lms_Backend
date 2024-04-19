import AppError from "../utils/error.utils.js";
import jwt from 'jsonwebtoken'

const isLoggedIn=async(req,res)=>{
    const {token}=res.cookies;

    if(!token){
        return next(new AppError("unauthorised user,please login",400));
    }

    const userDetails=await jwt.verify(token,process.env.JWT_SECRET);

     req.user=userDetails;

     next();


}

const authoriseRoles=(...role)=>async(req,res,next)=>{
        const currentRole=req.user.role;

        if(!role.includes(currentRole)){
            return next(new AppError("You don't have permission to access this route",403));
        }

        next();
}


export {isLoggedIn,authoriseRoles}