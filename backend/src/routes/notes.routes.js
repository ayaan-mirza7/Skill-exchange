import express from "express";
import multer from "multer";
import auth from "../middlewares/auth.js";
import Notes from "../models/notes.model.js";
import User from "../models/user.model.js";

const router = express.Router();


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/notes");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });


router.post("/", auth, upload.single("notes"), async (req,res)=>{

  const { title } = req.body;

  const note = await Notes.create({
    title,
    filepath: req.file.path,
    filename: req.file.filename,
    uploadedBy: req.userId
  });

  res.json(note);
});

router.get("/", async (req,res)=>{
  const notes = await Notes.find();
  res.json(notes);
});

export default router;
