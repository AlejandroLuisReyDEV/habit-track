import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Cargar las variables de entorno del archivo .env
dotenv.config();

// Inicializar la aplicación Express
const app = express();

// --- MIDDLEWARES ---
app.use(cors()); 
app.use(express.json()); 

// --- CONEXIÓN A BASE DE DATOS (MONGODB) ---
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 20000,
  heartbeatFrequencyMS: 20000,
})
.then(() => console.log('🔥 Base de datos MongoDB conectada con éxito'))
.catch((err) => console.error('❌ Error:', err.message));

// --- RUTAS DE PRUEBA ---
app.get('/', (req, res) => {
  res.send('¡Hola Alejandro! El servidor de HabitTrack está funcionando a la perfección 🚀');
});

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});