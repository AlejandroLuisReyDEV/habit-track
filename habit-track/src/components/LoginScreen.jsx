import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../services/api';

const LoginScreen = ({ isDarkMode }) => {
  const { login } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let data;
      if (isRegistering) {
        data = await registerUser(formData);
      } else {
        data = await loginUser({ email: formData.email, password: formData.password });
      }
      
      // Si sale bien, guardamos el usuario en el Contexto global
      login(data);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const themeBg = isDarkMode ? "bg-[#0B1120] text-white" : "bg-gray-50 text-gray-900";
  const cardBg = isDarkMode ? "bg-[#1F2937] border-gray-700" : "bg-white border-gray-200";
  const inputBg = isDarkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-gray-50 border-gray-300 text-black";

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${themeBg}`}>
      <div className={`max-w-md w-full p-8 rounded-2xl border shadow-xl ${cardBg}`}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">HabitTrack</h1>
          <p className="text-gray-500">
            {isRegistering ? "Crea tu cuenta para empezar" : "Bienvenido de nuevo"}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required={isRegistering}
                className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${inputBg}`}
                placeholder="Alejandro"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${inputBg}`}
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition-all ${inputBg}`}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-6 disabled:opacity-50"
          >
            {loading ? "Cargando..." : (isRegistering ? "Registrarse" : "Iniciar Sesión")}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-500">
            {isRegistering ? "¿Ya tienes una cuenta? " : "¿No tienes cuenta? "}
          </span>
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError(""); // Limpiamos errores al cambiar de modo
            }}
            className="text-blue-500 hover:text-blue-400 font-bold hover:underline"
          >
            {isRegistering ? "Inicia sesión" : "Regístrate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;