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
        if (!user.password) {
            return res.status(400).json({message:"Invalid password"});
        }

        // Support older accounts that may have stored plain passwords.
        // If it's not a bcrypt hash, fall back to direct compare and auto-upgrade.
        const stored = user.password;
        const isBcryptHash = typeof stored === "string" && stored.startsWith("$2");

        const ismatch = isBcryptHash
            ? await bcrypt.compare(password, stored)
            : password === stored;

        if(!ismatch){
            return res.status(400).json({message:"Invalid password"});
        }

        // Auto-upgrade plain-text stored passwords to bcrypt on successful login.
        if (!isBcryptHash) {
            user.password = password; // triggers pre-save hashing in user model
            await user.save();
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
                email:user.email,
                credits: user.credits
            }
        })
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"Server Error"});
    }

};
