import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,

  filepath: String,    
  filename: String,

  cost: { type: Number, default: 5 },

  uploadedby: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  createdat: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Video", videoSchema);
