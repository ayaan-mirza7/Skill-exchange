import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectdb from './src/config/db.js';
import authroutes from './src/routes/auth.routes.js';
import notesroutes from "./src/routes/notes.routes.js";
import userroutes from './src/routes/user.routes.js'
import videoroutes from "./src/routes/video.routes.js";
dotenv.config();
connectdb();
const app=express();
app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    res.send('Skill Exchange API Runnning ..');
});
app.use("/api/videos", videoroutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/notes", notesroutes);
app.use('/api/auth',authroutes);
app.use("/api/user",userroutes);
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`)
) 