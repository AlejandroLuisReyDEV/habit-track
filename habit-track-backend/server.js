import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Habit from './models/Habit.js';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

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
// --- ENDPOINTS DE AUTENTICACIÓN (LOGIN/REGISTRO) ---
// ==========================================

// Función auxiliar para generar el Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' }); // El token dura 30 días
};

// 1. POST: Registrar un nuevo usuario
app.post('/api/register', async (req, res) => {
  try {
    await connectDB();
    const { username, email, password } = req.body;

    // Comprobar si el correo ya existe en la base de datos
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Este email ya está registrado" });
    }

    // Crear el usuario (el User.js se encarga de encriptar la contraseña)
    const user = await User.create({ username, email, password });

    // Si se crea bien, devolvemos los datos y su Token de acceso
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: "Datos de usuario inválidos" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
});

// 2. POST: Iniciar sesión (Login)
app.post('/api/login', async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;

    // Buscar al usuario por su email
    const user = await User.findOne({ email });

    // Si existe y la contraseña coincide (usando la función que creaste en User.js)
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: "Email o contraseña incorrectos" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error en el servidor", error: error.message });
  }
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