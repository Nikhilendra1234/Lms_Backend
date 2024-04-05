import Router from 'express'
import { register,login,logout,getProfile } from '../Controllers/user.controller.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.middleware.js';
const userRouter=Router();

userRouter.post('/register',upload.single('avatar'),register);
userRouter.post('/login',login);
userRouter.get('/logout',logout);
userRouter.get('/me',isLoggedIn,getProfile);

export default userRouter