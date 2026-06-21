import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import Habit from './models/Habit.js';
import User from './models/User.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log('✅ Conexión a MongoDB establecida');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    throw error;
  }
};

// --- MIDDLEWARE DE SEGURIDAD (El Portero) ---
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]; // Sacamos el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Lo verificamos
      req.user = await User.findById(decoded.id).select('-password'); // Buscamos al usuario
      return next(); // Le dejamos pasar
    } catch (error) {
      return res.status(401).json({ message: 'No autorizado, token fallido' });
    }
  }
  if (!token) return res.status(401).json({ message: 'No autorizado, no hay token' });
};

// ==========================================
// --- RUTAS DE AUTENTICACIÓN ---
// ==========================================
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

app.post('/api/register', async (req, res) => {
  try {
    await connectDB();
    const { username, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Este email ya está registrado" });
    
    const user = await User.create({ username, email, password });
    if (user) {
      res.status(201).json({ _id: user._id, username: user.username, email: user.email, token: generateToken(user._id) });
    } else {
      res.status(400).json({ message: "Datos inválidos" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body; // 'email' ahora puede ser el nombre o el correo

    // NUEVO: Buscamos por email O por username
    const user = await User.findOne({
      $or: [{ email: email }, { username: email }]
    });

    if (user && (await user.matchPassword(password))) {
      res.json({ _id: user._id, username: user.username, email: user.email, token: generateToken(user._id) });
    } else {
      res.status(401).json({ message: "Usuario/Email o contraseña incorrectos" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
});

// ==========================================
// --- RUTAS DE HÁBITOS (PROTEGIDAS) ---
// ==========================================

// GET: Solo devuelve los hábitos del usuario logueado
app.get('/api/habits', protect, async (req, res) => {
  try {
    await connectDB();
    const habits = await Habit.find({ userId: req.user._id });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo los hábitos", error });
  }
});

// POST: Guarda el hábito asociándolo al ID del usuario
app.post('/api/habits', protect, async (req, res) => {
  try {
    await connectDB();
    const newHabit = new Habit({ ...req.body, userId: req.user._id });
    const savedHabit = await newHabit.save();
    res.status(201).json(savedHabit);
  } catch (error) {
    res.status(400).json({ message: "Error creando el hábito", error });
  }
});

// PUT y DELETE protegidos
app.put('/api/habits/:id', protect, async (req, res) => {
  try {
    await connectDB();
    const updatedHabit = await Habit.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id }, 
      req.body, 
      { new: true }
    );
    res.json(updatedHabit);
  } catch (error) {
    res.status(400).json({ message: "Error actualizando", error });
  }
});

app.delete('/api/habits/:id', protect, async (req, res) => {
  try {
    await connectDB();
    await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: "Hábito eliminado" });
  } catch (error) {
    res.status(400).json({ message: "Error eliminando", error });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Servidor en puerto ${PORT}`));