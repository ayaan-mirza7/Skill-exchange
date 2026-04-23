import mongoose from "mongoose";

const accessSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  videoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video"
  },

  unlockedAt: {
    type: Date,
    default: Date.now
  }
});

accessSchema.index({ userId: 1, videoId: 1 }, { unique: true });

export default mongoose.model("Access", accessSchema);
