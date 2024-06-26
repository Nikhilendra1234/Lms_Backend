import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRouter from './routes/user.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';
import courseRouter from './routes/course.route.js'
dotenv.config();

const app=express();

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    Credential:true
}));

app.use(cookieParser());

app.use(morgan("dev"));

//defining routes for the user related apis.
app.route('/api/v1/user',userRouter);
app.route('/api/v1/courses',courseRouter)

app.use("/ping",(req,res)=>{
    res.send("hello ping");    
})

app.all('*',(req,res)=>{
    res.send("404 , Page not Found...")
})

app.use(errorMiddleware);
export default app