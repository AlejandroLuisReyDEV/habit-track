// src/services/api.js
const API_URL = "https://habit-track-backend.vercel.app/api";

export const getHabits = async () => {
  const response = await fetch(`${API_URL}/habits`);
  return response.json();
};

export const createHabit = async (habitData) => {
  const response = await fetch(`${API_URL}/habits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(habitData),
  });
  return response.json();
};

export const updateHabit = async (id, habitData) => {
  const response = await fetch(`${API_URL}/habits/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(habitData),
  });
  return response.json();
};

export const deleteHabit = async (id) => {
  const response = await fetch(`${API_URL}/habits/${id}`, {
    method: "DELETE",
  });
  return response.json();
};