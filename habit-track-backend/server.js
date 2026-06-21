import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Habit from './models/Habit.js'; // Importamos el "plano" de tu base de datos

dotenv.config();

const app = express();

// --- MIDDLEWARES ---
app.use(cors()); // Permite que tu frontend de Vercel se comunique con este backend
app.use(express.json()); // Permite que el servidor entienda los datos en formato JSON

// --- CONEXIÓN A MONGODB ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Ruta de prueba (la que ya has visto funcionando)
app.get('/', (req, res) => {
  res.send('¡Hola Alejandro! El servidor de HabitTrack está funcionando a la perfección 🚀');
});


// ==========================================
// --- ENDPOINTS DE LA API (CRUD HÁBITOS) ---
// ==========================================

// 1. GET: Obtener todos los hábitos
app.get('/api/habits', async (req, res) => {
  try {
    const habits = await Habit.find(); // Busca todos los hábitos en la base de datos
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo los hábitos", error });
  }
});

// 2. POST: Crear un nuevo hábito
app.post('/api/habits', async (req, res) => {
  try {
    const newHabit = new Habit(req.body);
    const savedHabit = await newHabit.save(); // Lo guarda en MongoDB
    res.status(201).json(savedHabit); // Devuelve el hábito creado (con su nuevo _id)
  } catch (error) {
    res.status(400).json({ message: "Error creando el hábito", error });
  }
});

// 3. PUT: Actualizar un hábito existente (marcar un día, cambiar nombre, etc.)
app.put('/api/habits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Encuentra el hábito por su ID y lo actualiza con los datos que envía el frontend
    const updatedHabit = await Habit.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedHabit);
  } catch (error) {
    res.status(400).json({ message: "Error actualizando el hábito", error });
  }
});

// 4. DELETE: Borrar un hábito
app.delete('/api/habits/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Habit.findByIdAndDelete(id); // Lo elimina de MongoDB
    res.json({ message: "Hábito eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ message: "Error eliminando el hábito", error });
  }
});

// --- ARRANQUE DEL SERVIDOR ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
});