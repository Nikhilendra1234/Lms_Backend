import mongoose  from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
mongoose.set("strictQuery",false);
const  MONGO_URI=process.env.MONGO_URI;
console.log(MONGO_URI);
const connectToDb=async()=>{
    try {
        const{connection}= await mongoose.connect(MONGO_URI);
        if(connection){
            console.log(`connected to the db ${MONGO_URI}`);
        }
        else{
            console.log("connection failed");
            
        }
    } catch (error) {
        console.log(error);
        process.exit();
    }
    
}

export default connectToDb