import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';

dotenv.config();
const app=express();
app.use(express.json());
app.use(cors({
    origin:process.env.FRONTEND-URL,
    Credential:true
}));
app.use(cookieParser());

app.use("/ping",(req,res)=>{
    res.send("hello ping");    
})

app.all('*',(req,res)=>{
    res.send("404 , Page not Found...")
})

export default app