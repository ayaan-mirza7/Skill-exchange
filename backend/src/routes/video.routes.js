import express from "express";
import multer from "multer";
import auth from "../middlewares/auth.js";
import Video from "../models/video.model.js";
import User from "../models/user.model.js";
import Access from "../models/access.model.js";

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

//  PUBLIC FEED
router.get("/", async (req, res) => {
  const videos = await Video.find();
  res.json(videos);
});

// GET SINGLE VIDEO DETAILS (safe payload)
router.get("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate(
      "uploadedBy",
      "name email",
    );
    if (!video) return res.status(404).json({ message: "Video not found" });

    const { filepath, ...safe } = video.toObject();
    res.json(safe);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

//  UPLOAD VIDEO FROM PC
router.post("/", auth, upload.single("video"), async (req, res) => {

  const { title, description, cost } = req.body;
  const parsedCost = Number(cost);
  const safeCost = Number.isFinite(parsedCost) && parsedCost > 0 ? Math.floor(parsedCost) : 5;

  const video = await Video.create({
    title,
    description,
    cost: safeCost,
    // Store a URL-friendly path (Windows paths break browser URLs)
    filepath: `uploads/videos/${req.file.filename}`,
    filename: req.file.filename,
    uploadedBy: req.userId
  });

  
  const user = await User.findByIdAndUpdate(
  req.userId,
  { $inc: { credits: 30 } },
  { new: true }
);

res.json({
  credits: user.credits,
  message: "Video uploaded!"
});
});


//  WATCH WITH CREDITS
router.post("/watch/:id", auth, async (req, res) => {

  const user = await User.findById(req.userId);
  const video = await Video.findById(req.params.id);
  if (!video) return res.status(404).json({ message: "Video not found" });

  const videoPath = (video.filepath || "").replaceAll("\\", "/");

  // If it's your own upload, don't deduct credits.
  if (
    video.uploadedBy?.toString?.() === req.userId ||
    video.uploadedby?.toString?.() === req.userId
  ) {
    return res.json({ path: videoPath, credits: user.credits });
  }

  //  CHECK IF ALREADY PURCHASED
  const already = await Access.findOne({
    userId: req.userId,
    videoId: video._id
  });

  if (already) {
    await User.findByIdAndUpdate(req.userId, { $addToSet: { purchasedSkills: video._id } });
    // allow without deduction
    return res.json({
      path: videoPath,
      credits: user.credits
    });
  }

  //  FIRST TIME → deduct
  if (user.credits < video.cost) {
    return res.status(400).json({ message: "Not enough credits" });
  }

  user.credits -= video.cost;
  await user.save();
  await User.findByIdAndUpdate(req.userId, { $addToSet: { purchasedSkills: video._id } });

  //SAVE ACCESS RECORD
  await Access.create({
    userId: req.userId,
    videoId: video._id
  });

  res.json({
    path: videoPath,
    credits: user.credits
  });
});

export default router;
