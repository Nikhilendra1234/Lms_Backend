import { Schema,model } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema=new Schema({
    fullname:{
        type:'String',
        required:[true,"Name is required"],
        minLength:[5,"Name must be 5 characters"],
        maxLength:[50,"Name should not be more than 50 character"],
        trim:true,
        lowercase:true
    },
    email:{
        type:'String',
        required:[true,"Email is required"],
        trim:true,
       unique:true,
       match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"please fill a valid email"]
    },
    password:{
        type:"String",
        required:[true,"Password is required"],
        minLength:[8,"Password must be 8 characters"],
        select:false
    },
    avatar:{
        public_id:{
            type:"String"
        },
        secure_url:{
            type:"String"
        }
    },
    role:{
        type:"String",
        enum:["USER","ADMIN"],
        default:"USER"
    },
    forgotPasswordToken:String,
    forgotPasswordExpiry:Date,
},
{timestamps:true}
);

userSchema.pre("save",async(next)=>{
    if(!this.isModified('password')){
        return next();
    }
    this.password= bcrypt.hash(this.password,10);
    
})

userSchema.methods={
    generateToken:()=>{
        return jwt.sign(
            {id:this._id,email:this.email,subscription:this.subscription,role:this.role},
            process.env.JWT_SECRET,
            {
                expiresIn:process.env.JWT_EXPIRY
            }
        )
    },
    comparePassword:(password)=>{
        return bcrypt.compare(password,this.password);
    }
}

const User=model("User",userSchema);

export default User