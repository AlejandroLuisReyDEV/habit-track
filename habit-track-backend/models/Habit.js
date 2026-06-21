import mongoose from 'mongoose';

const habitSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Esto lo usaremos para Firebase Auth
  name: { type: String, required: true },
  description: String,
  icon: String,
  colorKey: String,
  history: [Boolean], // Tu array de 365 días
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Habit', habitSchema);