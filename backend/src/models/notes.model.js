import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({

  title: String,

  filepath: String,

  filename: String,

  cost: { type: Number, default: 3 },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

});

export default mongoose.model("Notes", notesSchema);
