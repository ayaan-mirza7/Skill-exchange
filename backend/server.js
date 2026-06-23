import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectdb from './src/config/db.js';
import authroutes from './src/routes/auth.routes.js';
import notesroutes from "./src/routes/notes.routes.js";
import userroutes from './src/routes/user.routes.js'
import videoroutes from "./src/routes/video.routes.js";
import paymentroutes from "./src/routes/payment.routes.js";
import {
    ensureUploadDir,
    notesUploadDir,
    uploadsRoot,
    videosUploadDir,
} from "./src/utils/uploadPaths.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });
connectdb();
const app=express();
ensureUploadDir(uploadsRoot);
ensureUploadDir(videosUploadDir);
ensureUploadDir(notesUploadDir);
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: allowedOrigins.length ? allowedOrigins : true,
    credentials: true,
}));
app.use(express.json());
app.get('/',(req,res)=>{
    res.send('Skill Exchange API Runnning ..');
});
app.use("/api/videos", videoroutes);
app.use("/uploads", express.static(uploadsRoot));
app.use("/api/notes", notesroutes);
app.use('/api/auth',authroutes);
app.use("/api/user",userroutes);
app.use("/api/payments", paymentroutes);
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`Server running on port ${PORT}`)
) 
