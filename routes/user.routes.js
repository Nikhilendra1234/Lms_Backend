import Router from 'express'
import { register,login,logout,getProfile } from '../Controllers/user.controller.js';
import { isLoggedIn } from '../middlewares/auth.middleware.js';
const userRouter=Router();

userRouter.post('/register',register);
userRouter.post('/login',login);
userRouter.get('/logout',logout);
userRouter.get('/me',isLoggedIn,getProfile);

export default userRouter