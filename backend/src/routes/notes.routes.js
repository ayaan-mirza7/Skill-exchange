import express from "express";
import multer from "multer";
import auth from "../middlewares/auth.js";
import Notes from "../models/notes.model.js";
import User from "../models/user.model.js";
import fs from "fs";
import path from "path";
import mime from "mime-types";   // 🔥 install this


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


router.post("/", auth, upload.single("notes"), async (req, res) => {

  const { title } = req.body;

  const note = await Notes.create({
    title,
    filepath: req.file.path,
    filename: req.file.filename,
    uploadedBy: req.userId
  });

  
  const user = await User.findByIdAndUpdate(
  req.userId,
  { $inc: { credits: 20 } },
  { new: true }
);

res.json({
  message: "Notes uploaded – gained 20 credits",
  credits: user.credits,
  note
});

});


router.get("/", async (req,res)=>{
  const notes = await Notes.find();
  res.json(notes);
});
router.post("/download/:id", auth, async (req, res) => {

  const user = await User.findById(req.userId);
  const note = await Notes.findById(req.params.id);

  if (user.credits < note.cost) {
    return res.status(400).json({ message: "Not enough credits" });
  }

  
  user.credits -= note.cost;
  await user.save();

  const absolutePath = path.resolve(note.filepath);

  
  const type = mime.lookup(note.filename) || "application/octet-stream";

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${note.filename}"`
  );

  res.setHeader("Content-Type", type);

  // 🔥 PURE BINARY STREAM
  const stream = fs.createReadStream(absolutePath);
  stream.pipe(res);
});

export default router;
