import mongoose from "mongoose";

const noteAccessSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  noteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notes",
    required: true,
  },
  unlockedAt: {
    type: Date,
    default: Date.now,
  },
});

noteAccessSchema.index({ userId: 1, noteId: 1 }, { unique: true });

export default mongoose.model("NoteAccess", noteAccessSchema);

