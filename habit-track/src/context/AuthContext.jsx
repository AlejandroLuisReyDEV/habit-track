import { createContext, useState, useEffect, useContext } from 'react';

// 1. Creamos el contexto (el espacio de memoria global)
const AuthContext = createContext();

// 2. Creamos el "Proveedor" que envolverá a toda tu aplicación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // EFECTO: Al abrir la web, comprobamos si el usuario ya se había logueado antes
  useEffect(() => {
    const savedUser = localStorage.getItem('ht_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // Si hay datos, lo marcamos como logueado
    }
    setLoading(false); // Ya hemos terminado de comprobar
  }, []);

  // FUNCIÓN: Iniciar sesión (guarda el usuario y el token en LocalStorage para no perderlos si cierra la pestaña)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('ht_user', JSON.stringify(userData));
  };

  // FUNCIÓN: Cerrar sesión (borra los datos de la memoria)
  const logout = () => {
    setUser(null);
    localStorage.removeItem('ht_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Mini-función (Hook) para que usar el usuario en otros archivos sea súper fácil
export const useAuth = () => {
  return useContext(AuthContext);
};