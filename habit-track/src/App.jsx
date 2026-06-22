import { useState, useEffect } from "react";
import { THEME_COLORS, ICON_OPTIONS } from "./constants/theme";
import { ACHIEVEMENTS } from "./constants/achievements";
import { TRANSLATIONS } from "./constants/translations";
import { useAuth } from "./context/AuthContext";
import LoginScreen from "./components/LoginScreen";
import SettingsModal from "./components/modals/SettingsModal";
import AddHabitModal from "./components/modals/AddHabitModal";
import ProfileModal from "./components/modals/ProfileModal";
import HabitDetailsModal from "./components/modals/HabitDetailsModal";
import AchievementsModal from "./components/modals/AchievementsModal";

import { getHabits, createHabit, updateHabit, deleteHabit } from "./services/api";

// --- UTILIDADES DE FECHA ---
// 1. Nos da la fecha local en formato "YYYY-MM-DD"
const formatDate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const getTodayDate = () => formatDate(new Date());

// 2. Nos genera una lista con los últimos 'N' días exactos (para pintar el mapa de calor)
const getLastNDays = (n) => {
  const dates = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(formatDate(d));
  }
  return dates;
};

function App() {

  // --- ESTADOS GLOBALES CON LOCALSTORAGE ---

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("ht_darkMode");
    return saved !== null ? JSON.parse(saved) : true;
  });

  const { user, loading, logout } = useAuth();

  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('ht_language');
    return saved || 'es';
  });

  useEffect(() => {
    localStorage.setItem('ht_language', language);
  }, [language]);

  const t = TRANSLATIONS[language];

  const [view, setView] = useState("week");

  // --- ESTADOS DE MODALES ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);

  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    icon: "🎯",
    colorKey: "blue",
  });

  // --- ESTADO DE HÁBITOS CON LOCALSTORAGE ---
  const [habits, setHabits] = useState([]);
  const [isFetchingHabits, setIsFetchingHabits] = useState(true);
  const [serverError, setServerError] = useState(false);

  // NUEVO: Cargar los hábitos con ESCUDO PROTECTOR Y ESTADO DE CARGA
  useEffect(() => {
    const fetchMyHabits = async () => {
      if (!user) return;

      setIsFetchingHabits(true);
      setServerError(false);

      try {
        const data = await getHabits();
        if (Array.isArray(data)) {
          setHabits(data);
        } else {
          setHabits([]);
        }
      } catch (error) {
        console.error("Error de conexión:", error);

        // Si el servidor nos echa porque la sesión expiró de verdad por seguridad
        if (error.message === "401_UNAUTHORIZED") {
          logout(); // Cerramos la sesión automáticamente
          return;
        }

        // Si falla porque Vercel estaba dormido o no hay internet
        setServerError(true);
      } finally {
        setIsFetchingHabits(false);
      }
    };

    fetchMyHabits();
  }, [user]);

  // --- EFECTOS ---
  useEffect(() => {
    localStorage.setItem("ht_darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // --- FUNCIONES CORE CONECTADAS A LA NUBE ---

  const toggleDay = async (habitId, dateStr) => {
    if (!habitId) return;

    const habitToUpdate = habits.find(h => (h._id || h.id) === habitId);
    if (!habitToUpdate) return;

    // Leemos si el día estaba marcado (si no existe, es false)
    const currentStatus = habitToUpdate.history[dateStr] || false;

    // Clonamos el historial y le invertimos el valor a la fecha concreta
    const newHistory = { ...habitToUpdate.history, [dateStr]: !currentStatus };

    setHabits(habits.map((habit) =>
      ((habit._id || habit.id) === habitId) ? { ...habit, history: newHistory } : habit
    ));

    const dbId = habitToUpdate._id || habitToUpdate.id;
    await updateHabit(dbId, { history: newHistory });
  };

  const handleAddHabit = async () => {
    if (newHabit.name.trim() === "") return;

    const habitPayload = {
      name: newHabit.name,
      description: newHabit.description,
      icon: newHabit.icon,
      colorKey: newHabit.colorKey,
      history: {},
      userId: user?.username
    };

    try {
      const savedHabit = await createHabit(habitPayload);
      setHabits([...habits, savedHabit]);
      setIsAddModalOpen(false);
      setNewHabit({ name: "", description: "", icon: "🎯", colorKey: "blue" });
    } catch (error) {
      console.error("Error guardando hábito:", error);
    }
  };

  const handleUpdateHabit = async () => {
    if (selectedHabit.name.trim() === "") return;
    try {
      const dbId = selectedHabit._id || selectedHabit.id;
      const updatedHabit = await updateHabit(dbId, selectedHabit);
      setHabits(habits.map((h) => ((h._id || h.id) === dbId ? updatedHabit : h)));
      setIsEditMode(false);
    } catch (error) {
      console.error("Error actualizando hábito:", error);
    }
  };

  const handleDeleteHabit = async (id) => {
    if (window.confirm(t.confirmDelete)) {
      try {
        await deleteHabit(id);
        setHabits(habits.filter((h) => (h._id || h.id) !== id));
        setSelectedHabit(null);
      } catch (error) {
        console.error("Error borrando hábito:", error);
      }
    }
  };

  const moveHabitUp = (index, e) => {
    e.stopPropagation();
    if (index === 0) return;
    const newHabits = [...habits];
    [newHabits[index - 1], newHabits[index]] = [newHabits[index], newHabits[index - 1]];
    setHabits(newHabits);
  };

  const moveHabitDown = (index, e) => {
    e.stopPropagation();
    if (index === habits.length - 1) return;
    const newHabits = [...habits];
    [newHabits[index + 1], newHabits[index]] = [newHabits[index], newHabits[index + 1]];
    setHabits(newHabits);
  };

  // --- ESTADÍSTICAS Y LOGROS (ACTUALIZADAS A FECHAS) ---
  const getTotalDays = (history) => Object.values(history).filter(Boolean).length;

  const globalTotalDays = habits.reduce((acc, habit) => acc + getTotalDays(habit.history), 0);

  const getStreak = (history) => {
    let streak = 0;
    let checkDate = new Date();

    while (true) {
      const dateStr = formatDate(checkDate);
      if (history[dateStr]) {
        streak++; // Si el día está marcado, suma racha
        checkDate.setDate(checkDate.getDate() - 1); // Miramos el día anterior
      } else if (streak === 0 && dateStr === getTodayDate()) {
        // Si hoy todavía no lo hemos hecho, le perdonamos y miramos si la racha sigue viva desde ayer
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break; // Racha rota
      }
    }
    return streak;
  };

  const getMaxHabitsInOneDay = () => {
    const dayCounts = {};
    habits.forEach(habit => {
      Object.keys(habit.history).forEach(dateStr => {
        if (habit.history[dateStr]) {
          dayCounts[dateStr] = (dayCounts[dateStr] || 0) + 1;
        }
      });
    });
    const counts = Object.values(dayCounts);
    return counts.length > 0 ? Math.max(...counts) : 0;
  };

  // FUNCIÓN ACTUALIZADA: Evalúa si el logro es global o por hábito
  const getUnlockedAchievements = () => {
    const unlocked = [];
    const maxHabitsInOneDay = getMaxHabitsInOneDay();

    ACHIEVEMENTS.forEach(ach => {
      let count = 0;

      if (ach.type === 'global') {
        // Logros de Productividad Diaria (solo se consiguen 1 vez)
        const globalStats = { maxHabitsInOneDay };
        if (ach.condition(globalStats)) count = 1;
      } else {
        // Logros de Rachas y Acumulados (se consiguen por hábito y se acumulan x2, x3...)
        habits.forEach(habit => {
          const stats = { streak: getStreak(habit.history), totalDays: getTotalDays(habit.history) };
          if (ach.condition(stats)) count++;
        });
      }

      if (count > 0) {
        unlocked.push({ ...ach, count });
      }
    });
    return unlocked;
  };

  const unlockedAchievements = getUnlockedAchievements();
  const displayAchievements = unlockedAchievements.slice(0, 3);
  const hasMoreAchievements = unlockedAchievements.length > 3;

  // --- RENDERIZADO DEL MAPA DE CALOR (DINÁMICO POR FECHA Y CORREGIDO VISUALMENTE) ---
  const renderHeatmap = (habit) => {
    const activeColor = THEME_COLORS[habit.colorKey]?.active || "bg-blue-500";
    const emptyColor = isDarkMode ? "bg-gray-500/20" : "bg-gray-400/30";
    const safeId = habit._id || habit.id;

    // ESCUDO: Si por algún casual la base de datos no manda el historial, usamos un objeto vacío
    const historyObj = habit.history || {};

    if (view === "week") {
      const dates = getLastNDays(7);
      return (
        <div className="flex justify-between gap-2 mt-4">
          {dates.map((dateStr) => (
            <button
              key={dateStr}
              title={dateStr}
              onClick={(e) => { e.stopPropagation(); toggleDay(safeId, dateStr); }}
              className={`w-full h-10 rounded-md transition-all ${historyObj[dateStr] ? activeColor : emptyColor} hover:opacity-80`}
            />
          ))}
        </div>
      );
    } else if (view === "month") {
      const dates = getLastNDays(30);
      return (
        <div className="grid grid-cols-6 gap-2 mt-4">
          {dates.map((dateStr) => (
            <button
              key={dateStr}
              title={dateStr}
              onClick={(e) => { e.stopPropagation(); toggleDay(safeId, dateStr); }}
              className={`w-full aspect-square rounded-md transition-all ${historyObj[dateStr] ? activeColor : emptyColor} hover:opacity-80`}
            />
          ))}
        </div>
      );
    } else if (view === "year") {
      const dates = getLastNDays(365);
      return (
        <div className="grid grid-rows-7 grid-flow-col gap-[3px] mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {dates.map((dateStr) => (
            <button
              key={dateStr}
              title={dateStr}
              onClick={(e) => { e.stopPropagation(); toggleDay(safeId, dateStr); }}
              className={`w-[10px] h-[10px] rounded-[2px] flex-shrink-0 transition-all ${historyObj[dateStr] ? activeColor : emptyColor} hover:opacity-80`}
            />
          ))}
        </div>
      );
    }
  };

  const themeBg = isDarkMode ? "bg-[#0B1120] text-white" : "bg-gray-50 text-gray-900";
  const modalBg = isDarkMode ? "bg-[#1F2937] border-gray-700" : "bg-white border-gray-200";
  const textMuted = isDarkMode ? "text-gray-400" : "text-gray-500";

  // --- EL PORTERO DE DISCOTECA ---
  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-[#0B1120] text-white" : "bg-gray-50 text-black"}`}>
        <div className="text-2xl font-bold animate-pulse">Cargando HabitTrack...</div>
      </div>
    );
  }

  // Si no hay usuario logueado, le devolvemos la pantalla de Login y NO cargamos los hábitos
  if (!user) {
    return <LoginScreen isDarkMode={isDarkMode} />;
  }
  // -------------------------------

  return (
    <div className={`min-h-screen font-sans p-4 md:p-8 relative transition-colors duration-300 ${themeBg}`}>
      <div className="w-full max-w-4xl mx-auto relative min-h-[90vh]">

        {/* CABECERA */}
        <header className="flex justify-between items-center mb-8 pt-4 relative">
          <button onClick={() => setIsSettingsOpen(true)} className={`text-2xl hover:rotate-90 transition-transform ${textMuted} hover:text-current`}>
            ⚙️
          </button>

          <h1 className="text-2xl font-bold tracking-wider absolute left-1/2 -translate-x-1/2 hidden sm:block">
            HabitTrack
          </h1>

          <div className="flex items-center gap-3">
            {/* Botón de Perfil con el nombre real del usuario */}
            <button onClick={() => setIsProfileOpen(true)} className="flex items-center gap-3 hover:bg-gray-500/10 p-2 rounded-xl transition-colors">
              <span className="font-medium hidden sm:block">{user?.username}</span>
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md uppercase">
                {user?.username?.charAt(0)}
              </div>
            </button>

            {/* Botón de Cerrar Sesión */}
            <button onClick={logout} className="text-sm font-bold text-red-500 hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors">
              Salir
            </button>
          </div>
        </header>

        {/* SELECTOR DE VISTAS */}
        <div className="flex justify-center mb-8">
          <div className={`${isDarkMode ? "bg-[#1F2937] border-gray-700" : "bg-white border-gray-200 shadow-sm"} rounded-xl p-1 flex gap-1 border`}>
            {["week", "month", "year"].map((v) => (
              <button key={v} onClick={() => setView(v)} className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${view === v ? (isDarkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black") : `${textMuted} hover:opacity-80`}`}>
                {v === "week" ? t.week : v === "month" ? t.month : t.year}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN: LISTA DE HÁBITOS */}
        <main>
          <div className="flex justify-between items-end mb-4">
            <h2 className={`${textMuted} text-sm font-bold uppercase tracking-wider pl-2`}>
              {t.title}
            </h2>
          </div>

          {/* MENSAJE MOTIVACIONAL, CARGA O LISTA DE HÁBITOS */}
          {isFetchingHabits ? (
            <div className="text-center py-20 px-4">
              <div className="animate-pulse text-5xl mb-6">⏳</div>
              <h2 className="text-2xl font-bold mb-3">Conectando...</h2>
              <p className={`${textMuted}`}>Despertando al servidor y cargando tus hábitos.</p>
            </div>
          ) : serverError ? (
            <div className="text-center py-20 px-4">
              <div className="text-6xl mb-6">😴</div>
              <h2 className="text-2xl font-bold mb-3">El servidor estaba pausado</h2>
              <p className={`${textMuted} max-w-md mx-auto mb-8`}>
                Al llevar horas sin usarse, el servidor ha entrado en ahorro de energía. Haz clic para reconectar.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                Reconectar
              </button>
            </div>
          ) : habits.length === 0 ? (
            <div className="text-center py-20 px-4">
              <div className="text-6xl mb-6">🌱</div>
              <h2 className="text-2xl font-bold mb-3">¡Comienza tu nueva rutina!</h2>
              <p className={`${textMuted} max-w-md mx-auto mb-8`}>
                No tienes ningún hábito registrado. El mejor momento para empezar a construir tu disciplina fue ayer, el segundo mejor momento es hoy.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:scale-105 transition-all"
              >
                Crear mi primer hábito
              </button>
            </div>
          ) : (
            /* LA CUADRÍCULA NORMAL DE HÁBITOS (Lo que ya tenías) */
            <div className={`grid gap-5 ${view === "month" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
              {habits.map((habit, index) => {
                const todayDateStr = getTodayDate();
                const isTodayDone = habit.history[todayDateStr] || false;
                const cardTint = isDarkMode ? THEME_COLORS[habit.colorKey].darkBg : THEME_COLORS[habit.colorKey].lightBg;
                const activeColor = THEME_COLORS[habit.colorKey].active;

                return (
                  <div key={habit.id || habit._id} onClick={() => { setSelectedHabit(habit); setIsEditMode(false); }} className={`${cardTint} border-2 rounded-2xl p-5 flex flex-col shadow-sm transition-all hover:scale-[1.01] cursor-pointer group`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <div className={`${isDarkMode ? "bg-black/20" : "bg-white"} p-3 rounded-xl text-2xl shadow-sm`}>{habit.icon}</div>
                        <div className="flex flex-col">
                          <span className={`font-bold text-xl tracking-wide ${isTodayDone && view !== "month" ? "line-through opacity-60" : ""}`}>{habit.name}</span>
                          <div className="flex items-center gap-3 mt-1">
                            {habit.description && <span className={`text-sm ${textMuted}`}>{habit.description}</span>}
                            {getStreak(habit.history) > 0 && (
                              <span className="text-orange-500 font-bold text-xs bg-orange-500/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                                🔥 {getStreak(habit.history)} {t.days}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          {index > 0 && <button onClick={(e) => moveHabitUp(index, e)} className={`text-xs p-1 rounded hover:bg-gray-500/20 ${textMuted}`}>▲</button>}
                          {index < habits.length - 1 && <button onClick={(e) => moveHabitDown(index, e)} className={`text-xs p-1 rounded hover:bg-gray-500/20 ${textMuted}`}>▼</button>}
                        </div>
                        {view !== "month" && (
                          <button onClick={(e) => { e.stopPropagation(); toggleDay(habit._id || habit.id, todayDateStr); }} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-lg transition-colors ${isTodayDone ? `${activeColor} border-transparent text-white shadow-md` : `${isDarkMode ? "border-gray-600 bg-gray-800/50" : "border-gray-300 bg-white"}`}`}>
                            {isTodayDone ? "✓" : ""}
                          </button>
                        )}
                      </div>
                    </div>
                    {renderHeatmap(habit)}
                  </div>
                );
              })}
            </div>
          )}
        </main>

        <button onClick={() => setIsAddModalOpen(true)} className={`fixed bottom-8 right-8 ${isDarkMode ? "bg-white text-black" : "bg-blue-600 text-white"} rounded-full w-16 h-16 flex items-center justify-center text-4xl shadow-2xl hover:scale-105 transition-all z-10`}>+</button>
      </div>

      {/* --- MODALES --- */}

      {selectedHabit && (
        <HabitDetailsModal
          selectedHabit={selectedHabit}
          setSelectedHabit={setSelectedHabit}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          handleDeleteHabit={handleDeleteHabit}
          handleUpdateHabit={handleUpdateHabit}
          getStreak={getStreak}
          getTotalDays={getTotalDays}
          isDarkMode={isDarkMode}
          t={t}
        />
      )}

      {isAddModalOpen && (
        <AddHabitModal
          newHabit={newHabit}
          setNewHabit={setNewHabit}
          handleAddHabit={handleAddHabit}
          setIsAddModalOpen={setIsAddModalOpen}
          isDarkMode={isDarkMode}
          t={t}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          language={language}
          setLanguage={setLanguage}
          setIsSettingsOpen={setIsSettingsOpen}
          t={t}
        />
      )}

      {/* MODAL DE PERFIL BLINDADO */}

      {isProfileOpen && (
        <ProfileModal
          username={user?.username || "Usuario"}
          globalTotalDays={globalTotalDays || 0}
          unlockedAchievements={unlockedAchievements || []}
          displayAchievements={displayAchievements || []}
          hasMoreAchievements={hasMoreAchievements || false}
          habits={habits || []}
          getTotalDays={getTotalDays}
          setIsProfileOpen={setIsProfileOpen}
          setIsAchievementsModalOpen={setIsAchievementsModalOpen}
          isDarkMode={isDarkMode}
          language={language}
          t={t}
        />
      )}


      {/* MODAL VITRINA DE LOGROS */}

      {isAchievementsModalOpen && (
        <AchievementsModal
          unlockedAchievements={unlockedAchievements}
          setIsAchievementsModalOpen={setIsAchievementsModalOpen}
          isDarkMode={isDarkMode}
          language={language}
          t={t}
        />
      )}

    </div>
  );
}

export default App;