import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Habit from './models/Habit.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// --- CONEXIÓN OPTIMIZADA PARA VERCEL (SERVERLESS) ---
let isConnected = false; // Variable para guardar el estado de la conexión

const connectDB = async () => {
  if (isConnected) {
    return; // Si ya está conectado, no hacemos nada
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log('✅ Conexión a MongoDB Atlas establecida');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    throw error;
  }
};

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('¡Servidor Serverless de HabitTrack funcionando! 🚀');
});

// ==========================================
// --- ENDPOINTS DE LA API (CRUD HÁBITOS) ---
// ==========================================

app.get('/api/habits', async (req, res) => {
  try {
    await connectDB(); // <-- CLAVE: Aseguramos la conexión antes de pedir datos
    const habits = await Habit.find();
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo los hábitos", error });
  }
});

app.post('/api/habits', async (req, res) => {
  try {
    await connectDB(); // <-- CLAVE
    const newHabit = new Habit(req.body);
    const savedHabit = await newHabit.save();
    res.status(201).json(savedHabit);
  } catch (error) {
    res.status(400).json({ message: "Error creando el hábito", error });
  }
});

app.put('/api/habits/:id', async (req, res) => {
  try {
    await connectDB(); // <-- CLAVE
    const { id } = req.params;
    const updatedHabit = await Habit.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedHabit);
  } catch (error) {
    res.status(400).json({ message: "Error actualizando el hábito", error });
  }
});

app.delete('/api/habits/:id', async (req, res) => {
  try {
    await connectDB(); // <-- CLAVE
    const { id } = req.params;
    await Habit.findByIdAndDelete(id);
    res.json({ message: "Hábito eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ message: "Error eliminando el hábito", error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});