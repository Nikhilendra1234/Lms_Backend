import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

dotenv.config();
const app=express();
app.use(express.json());
app.use(cors({
    origin:[process.env.FRONTEND_URL],
    Credential:true
}));
app.use(cookieParser());

app.use(morgan("dev"));

app.use("/ping",(req,res)=>{
    res.send("hello ping");    
})

app.all('*',(req,res)=>{
    res.send("404 , Page not Found...")
})

export default app