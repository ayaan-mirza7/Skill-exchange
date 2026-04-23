import express from "express";
import multer from "multer";
import auth from "../middlewares/auth.js";
import Notes from "../models/notes.model.js";
import User from "../models/user.model.js";
import NoteAccess from "../models/noteAccess.model.js";
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

  const { title, cost } = req.body;
  const parsedCost = Number(cost);
  const safeCost = Number.isFinite(parsedCost) && parsedCost > 0 ? Math.floor(parsedCost) : 3;

  const note = await Notes.create({
    title,
    cost: safeCost,
    // Store a URL-friendly path (Windows paths break browser URLs)
    filepath: `uploads/notes/${req.file.filename}`,
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
  try {
    const user = await User.findById(req.userId);
    const note = await Notes.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const notePath = (note.filepath || "").replaceAll("\\", "/");
    const absolutePath = path.resolve(notePath);

    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ message: "File missing on server" });
    }

    const cost = Number(note.cost ?? 3);
    const isOwner = note.uploadedBy?.toString?.() === req.userId;

    // If it's your own upload, don't deduct credits.
    if (isOwner) {
      const type = mime.lookup(note.filename) || "application/octet-stream";
      res.setHeader("Content-Type", type);
      res.setHeader("X-Remaining-Credits", user.credits);
      return res.download(absolutePath, note.filename);
    }

    // If already unlocked before, don't deduct again.
    const already = await NoteAccess.findOne({
      userId: req.userId,
      noteId: note._id,
    });

    if (!already) {
      if (user.credits < cost) {
        return res.status(400).json({ message: "Not enough credits" });
      }

      user.credits -= cost;
      await user.save();

      // If two requests race, a duplicate key error can happen; that's fine.
      try {
        await NoteAccess.create({ userId: req.userId, noteId: note._id });
      } catch (e) {
        // ignore duplicate unlock
      }
    }

    await User.findByIdAndUpdate(req.userId, { $addToSet: { purchasedDocs: note._id } });

    const type = mime.lookup(note.filename) || "application/octet-stream";
    res.setHeader("Content-Type", type);
    res.setHeader("X-Remaining-Credits", user.credits);

    return res.download(absolutePath, note.filename);
  } catch (err) {
    console.error("Notes download error:", err);
    return res.status(500).json({ message: "Download failed" });
  }
});

export default router;
