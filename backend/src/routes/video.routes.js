import express from "express";
import multer from "multer";
import auth from "../middlewares/auth.js";
import Video from "../models/video.model.js";
import User from "../models/user.model.js";

const router = express.Router();

// 🔹 MULTER STORAGE
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/videos");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// 🔹 PUBLIC FEED
router.get("/", async (req, res) => {
  const videos = await Video.find();
  res.json(videos);
});

// 🔹 UPLOAD VIDEO FROM PC
router.post("/", auth, upload.single("video"), async (req, res) => {

  const { title, description } = req.body;

  const video = await Video.create({
    title,
    description,
    filepath: req.file.path,
    filename: req.file.filename,
    uploadedBy: req.userId
  });

  res.json(video);
});

// 🔹 WATCH WITH CREDITS
router.post("/watch/:id", auth, async (req, res) => {

  const user = await User.findById(req.userId);
  const video = await Video.findById(req.params.id);

  if (user.credits < video.cost) {
    return res.status(400).json({ message: "Not enough credits" });
  }

  user.credits -= video.cost;
  await user.save();

  res.json({
    path: video.filepath   // send local path
  });
});

export default router;
