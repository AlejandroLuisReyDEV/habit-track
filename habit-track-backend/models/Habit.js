import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Esto lo usaremos para Firebase Auth
  name: { type: String, required: true },
  description: String,
  icon: String,
  colorKey: String,
  createdAt: { type: Date, default: Date.now },
  history: {
    type: Map,
    of: Boolean,
    default: {},
  },
});

export default mongoose.model("Habit", habitSchema);
