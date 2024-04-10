import Router from 'express'
import { register,login,logout,getProfile,forgotPassword,resetPassword, changePassword ,updateProfile} from '../Controllers/user.controller.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';
const userRouter=Router();

userRouter.post('/register',upload.single('avatar'),register);
userRouter.post('/login',login);
userRouter.get('/logout',logout);
userRouter.get('/me',isLoggedIn,getProfile);
userRouter.post('/forgot-password',forgotPassword);
userRouter.post('/reset-password/:resetToken',resetPassword);
userRouter.post('/change-password',isLoggedIn,changePassword);
userRouter.put('/update/:id',isLoggedIn,upload.single('avatar'),updateProfile);
export default userRouter