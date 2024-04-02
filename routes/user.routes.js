import Router from 'express'
import { register,login,logout,getProfile } from '../Controllers/user.controller.js';
const userRouter=Router();

userRouter.post('/register',register);
userRouter.post('/login',login);
userRouter.get('/logout',logout);
userRouter.get('/me',getProfile);

export default userRouter