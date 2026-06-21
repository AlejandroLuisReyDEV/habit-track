const API_URL = "https://habit-track-backend.vercel.app/api";

// Esta función mágica coge el token de tu navegador
const getAuthHeaders = () => {
  const savedUser = localStorage.getItem('ht_user');
  const user = savedUser ? JSON.parse(savedUser) : null;
  return {
    "Content-Type": "application/json",
    "Authorization": user && user.token ? `Bearer ${user.token}` : ""
  };
};

export const getHabits = async () => {
  const response = await fetch(`${API_URL}/habits`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error("Error obteniendo los hábitos del servidor");
  return response.json();
};

export const createHabit = async (habitData) => {
  const response = await fetch(`${API_URL}/habits`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(habitData),
  });
  if (!response.ok) throw new Error("El servidor rechazó la creación del hábito");
  return response.json();
};

export const updateHabit = async (id, habitData) => {
  const response = await fetch(`${API_URL}/habits/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(habitData),
  });
  if (!response.ok) throw new Error("Error actualizando el hábito");
  return response.json();
};

export const deleteHabit = async (id) => {
  const response = await fetch(`${API_URL}/habits/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error("Error eliminando el hábito");
  return response.json();
};

export const loginUser = async (credentials) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al iniciar sesión");
  }
  return response.json();
};

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error al registrarse");
  }
  return response.json();
};