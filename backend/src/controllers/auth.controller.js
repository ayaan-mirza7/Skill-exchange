import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

//Signup controller
export const signup=async(req,res)=>{
    try{
        const{name,email,password}=req.body;
        const userexist=await User.findOne({email});
        if(userexist){
            return res.status(400).json({message:"Email already registered"});
        }
        const user=await User.create({name,email,password});
        return res.status(201).json({
            message:"User registered successfully",
            user:{
                id:user._id,
                name:(await user).name,
                email:(await user).email,
            }
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Server Error"});
    }
}

//Login Controller
export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        const ismatch=await bcrypt.compare(password,user.password);
        if(!ismatch){
            return res.status(400).json({message:"Invalid password"});
        }
        const token=jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        );
        return res.status(200).json({
            message:"Login successful",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Server Error"});
    }

};
