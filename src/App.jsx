import { useState, useEffect } from 'react';

const THEME_COLORS = {
  blue: { active: 'bg-blue-500', darkBg: 'bg-blue-500/10 border-blue-500/20', lightBg: 'bg-blue-500/10 border-blue-500/30' },
  red: { active: 'bg-red-500', darkBg: 'bg-red-500/10 border-red-500/20', lightBg: 'bg-red-500/10 border-red-500/30' },
  green: { active: 'bg-green-500', darkBg: 'bg-green-500/10 border-green-500/20', lightBg: 'bg-green-500/10 border-green-500/30' },
  yellow: { active: 'bg-yellow-400', darkBg: 'bg-yellow-400/10 border-yellow-400/20', lightBg: 'bg-yellow-400/10 border-yellow-400/30' },
  purple: { active: 'bg-purple-500', darkBg: 'bg-purple-500/10 border-purple-500/20', lightBg: 'bg-purple-500/10 border-purple-500/30' },
  pink: { active: 'bg-pink-500', darkBg: 'bg-pink-500/10 border-pink-500/20', lightBg: 'bg-pink-500/10 border-pink-500/30' },
  orange: { active: 'bg-orange-500', darkBg: 'bg-orange-500/10 border-orange-500/20', lightBg: 'bg-orange-500/10 border-orange-500/30' },
  slate: { active: 'bg-slate-400', darkBg: 'bg-slate-400/10 border-slate-400/20', lightBg: 'bg-slate-400/10 border-slate-400/30' }
};

function App() {
  // --- ESTADOS GLOBALES CON LOCALSTORAGE ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('ht_darkMode');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [username, setUsername] = useState(() => {
    const saved = localStorage.getItem('ht_username');
    return saved || 'Alejandro';
  });

  const [view, setView] = useState('week'); 

  // --- ESTADOS DE MODALES ---
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const [newHabit, setNewHabit] = useState({ name: '', description: '', icon: '🎯', colorKey: 'blue' });
  const iconOptions = ['🎯', '🥛', '📖', '🏋️', '💻', '🧘', '🏃', '💰', '🍎', '💤', '💧', '🚭', '🧹', '🎨', '🎸', '🌱'];

  // --- ESTADO DE HÁBITOS CON LOCALSTORAGE ---
  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('ht_habits');
    if (saved) {
      return JSON.parse(saved);
    }
    const generateHistory = () => Array(365).fill(false).map(() => Math.random() > 0.8); 
    return [
      { id: 1, name: 'Creatina', icon: '🥛', colorKey: 'slate', history: generateHistory() },
      { id: 2, name: 'Leer', description: 'Mínimo 10 páginas', icon: '📖', colorKey: 'yellow', history: generateHistory() },
      { id: 3, name: 'GYM', icon: '🏋️', colorKey: 'red', history: generateHistory() },
      { id: 4, name: 'Estudiar', icon: '💻', colorKey: 'blue', history: generateHistory() }
    ];
  });

  // --- EFECTOS ---
  useEffect(() => {
    localStorage.setItem('ht_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('ht_darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('ht_username', username);
  }, [username]);

  // --- FUNCIONES CORE ---
  const toggleDay = (habitId, dayIndex) => {
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const newHistory = [...habit.history];
        newHistory[dayIndex] = !newHistory[dayIndex];
        return { ...habit, history: newHistory };
      }
      return habit;
    }));
  };

  const handleAddHabit = () => {
    if (newHabit.name.trim() === '') return;
    setHabits([...habits, { 
      id: Date.now(), 
      name: newHabit.name, 
      description: newHabit.description,
      icon: newHabit.icon, 
      colorKey: newHabit.colorKey, 
      history: Array(365).fill(false) 
    }]);
    setIsAddModalOpen(false);
    setNewHabit({ name: '', description: '', icon: '🎯', colorKey: 'blue' });
  };

  const handleUpdateHabit = () => {
    if (selectedHabit.name.trim() === '') return;
    setHabits(habits.map(h => h.id === selectedHabit.id ? selectedHabit : h));
    setIsEditMode(false);
  };

  const handleDeleteHabit = (id) => {
    if(window.confirm('¿Seguro que quieres eliminar este hábito y todo su historial?')) {
      setHabits(habits.filter(h => h.id !== id));
      setSelectedHabit(null);
    }
  };

  // --- ESTADÍSTICAS ---
  const getTotalDays = (history) => history.filter(Boolean).length;
  const globalTotalDays = habits.reduce((acc, habit) => acc + getTotalDays(habit.history), 0);
  
  const getStreak = (history) => {
    let streak = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i]) streak++;
      else break; 
    }
    return streak;
  };

  // --- RENDERIZADO DEL MAPA DE CALOR ---
  const renderHeatmap = (habit) => {
    const activeColor = THEME_COLORS[habit.colorKey].active;
    const emptyColor = isDarkMode ? 'bg-gray-500/20' : 'bg-gray-400/30'; 

    if (view === 'week') {
      const weekData = habit.history.slice(-7);
      return (
        <div className="flex justify-between gap-2 mt-4">
          {weekData.map((isDone, i) => {
            const actualIndex = habit.history.length - 7 + i;
            return (
              <button key={i} onClick={(e) => { e.stopPropagation(); toggleDay(habit.id, actualIndex); }} className={`w-full h-10 rounded-md transition-all ${isDone ? activeColor : emptyColor} hover:opacity-80`}/>
            );
          })}
        </div>
      );
    } else if (view === 'month') {
      const monthData = habit.history.slice(-30);
      return (
        <div className="grid grid-cols-6 gap-2 mt-4">
          {monthData.map((isDone, i) => {
             const actualIndex = habit.history.length - 30 + i;
             return (
              <button key={i} onClick={(e) => { e.stopPropagation(); toggleDay(habit.id, actualIndex); }} className={`w-full aspect-square rounded-md transition-all ${isDone ? activeColor : emptyColor} hover:opacity-80`}/>
             );
          })}
        </div>
      );
    } else if (view === 'year') {
      return (
        <div className="grid grid-rows-7 grid-flow-col gap-[3px] mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {habit.history.map((isDone, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); toggleDay(habit.id, i); }} className={`w-[10px] h-[10px] rounded-[2px] flex-shrink-0 transition-all ${isDone ? activeColor : emptyColor} hover:opacity-80`}/>
          ))}
        </div>
      );
    }
  };

  const themeBg = isDarkMode ? 'bg-[#0B1120] text-white' : 'bg-gray-50 text-gray-900';
  const modalBg = isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-white border-gray-200';
  const textMuted = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`min-h-screen font-sans p-4 md:p-8 relative transition-colors duration-300 ${themeBg}`}>
      <div className="w-full max-w-4xl mx-auto relative min-h-[90vh]">
        
        {/* CABECERA */}
        <header className="flex justify-between items-center mb-8 pt-4 relative">
          <button onClick={() => setIsSettingsOpen(true)} className={`text-2xl hover:rotate-90 transition-transform ${textMuted} hover:text-current`}>⚙️</button>
          <h1 className="text-2xl font-bold tracking-wider absolute left-1/2 -translate-x-1/2 hidden sm:block">HabitTrack</h1>
          <button onClick={() => setIsProfileOpen(true)} className="flex items-center gap-3 hover:bg-gray-500/10 p-2 rounded-xl transition-colors">
            <span className="font-medium hidden sm:block">{username}</span>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shadow-md">{username.charAt(0)}</div>
          </button>
        </header>

        {/* SELECTOR DE VISTAS */}
        <div className="flex justify-center mb-8">
          <div className={`${isDarkMode ? 'bg-[#1F2937] border-gray-700' : 'bg-white border-gray-200 shadow-sm'} rounded-xl p-1 flex gap-1 border`}>
            {['week', 'month', 'year'].map((v) => (
              <button key={v} onClick={() => setView(v)} className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${view === v ? (isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-black') : `${textMuted} hover:opacity-80`}`}>
                {v === 'week' ? 'Semana' : v === 'month' ? 'Mes' : 'Año'}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN: LISTA DE HÁBITOS */}
        <main>
          <div className="flex justify-between items-end mb-4">
            <h2 className={`${textMuted} text-sm font-bold uppercase tracking-wider pl-2`}>Tus Hábitos</h2>
          </div>
          <div className={`grid gap-5 ${view === 'month' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
            {habits.map((habit) => {
              const isTodayDone = habit.history[364];
              const cardTint = isDarkMode ? THEME_COLORS[habit.colorKey].darkBg : THEME_COLORS[habit.colorKey].lightBg;
              const activeColor = THEME_COLORS[habit.colorKey].active;

              return (
                <div key={habit.id} onClick={() => { setSelectedHabit(habit); setIsEditMode(false); }} className={`${cardTint} border-2 rounded-2xl p-5 flex flex-col shadow-sm transition-all hover:scale-[1.01] cursor-pointer group`}>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className={`${isDarkMode ? 'bg-black/20' : 'bg-white'} p-3 rounded-xl text-2xl shadow-sm`}>{habit.icon}</div>
                      <div className="flex flex-col">
                        <span className={`font-bold text-xl tracking-wide ${isTodayDone && view !== 'month' ? 'line-through opacity-60' : ''}`}>{habit.name}</span>
                        {habit.description && <span className={`text-sm ${textMuted}`}>{habit.description}</span>}
                      </div>
                    </div>
                    {view !== 'month' && (
                      <button onClick={(e) => { e.stopPropagation(); toggleDay(habit.id, 364); }} className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center text-lg transition-colors ${isTodayDone ? `${activeColor} border-transparent text-white shadow-md` : `${isDarkMode ? 'border-gray-600 bg-gray-800/50' : 'border-gray-300 bg-white'}`}`}>
                        {isTodayDone ? '✓' : ''}
                      </button>
                    )}
                  </div>
                  {renderHeatmap(habit)}
                </div>
              );
            })}
          </div>
        </main>

        <button onClick={() => setIsAddModalOpen(true)} className={`fixed bottom-8 right-8 ${isDarkMode ? 'bg-white text-black' : 'bg-blue-600 text-white'} rounded-full w-16 h-16 flex items-center justify-center text-4xl shadow-2xl hover:scale-105 transition-all z-10`}>+</button>
      </div>

      {/* --- MODALES --- */}

      {selectedHabit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${isDarkMode ? THEME_COLORS[selectedHabit.colorKey].darkBg : THEME_COLORS[selectedHabit.colorKey].lightBg} ${modalBg} border-2 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative overflow-hidden`}>
            <button onClick={() => setSelectedHabit(null)} className="absolute top-4 right-6 text-gray-400 hover:text-current text-2xl z-10">✕</button>
            {!isEditMode ? (
              <div className="flex flex-col gap-6">
                <div className="text-center mt-4">
                  <div className={`w-24 h-24 mx-auto rounded-3xl ${isDarkMode ? 'bg-black/20' : 'bg-white'} flex items-center justify-center text-5xl shadow-lg mb-4`}>{selectedHabit.icon}</div>
                  <h2 className="text-3xl font-black">{selectedHabit.name}</h2>
                  {selectedHabit.description && <p className={`mt-2 ${textMuted}`}>{selectedHabit.description}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className={`${isDarkMode ? 'bg-black/20' : 'bg-white/50'} p-4 rounded-2xl text-center shadow-sm`}>
                    <p className={`text-xs font-bold uppercase tracking-wider ${textMuted} mb-1`}>Racha Actual</p>
                    <p className={`text-3xl font-black ${THEME_COLORS[selectedHabit.colorKey].active.replace('bg-', 'text-')}`}>{getStreak(selectedHabit.history)} <span className="text-sm">días</span></p>
                  </div>
                  <div className={`${isDarkMode ? 'bg-black/20' : 'bg-white/50'} p-4 rounded-2xl text-center shadow-sm`}>
                    <p className={`text-xs font-bold uppercase tracking-wider ${textMuted} mb-1`}>Total Histórico</p>
                    <p className={`text-3xl font-black ${THEME_COLORS[selectedHabit.colorKey].active.replace('bg-', 'text-')}`}>{getTotalDays(selectedHabit.history)} <span className="text-sm">días</span></p>
                  </div>
                </div>
                <div className="flex justify-between gap-3 mt-6">
                  <button onClick={() => handleDeleteHabit(selectedHabit.id)} className="px-4 py-3 rounded-xl font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors">Eliminar</button>
                  <button onClick={() => setIsEditMode(true)} className={`flex-1 py-3 ${THEME_COLORS[selectedHabit.colorKey].active} text-white rounded-xl font-bold shadow-lg hover:opacity-90`}>Editar Hábito</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold mb-2">Editar Hábito</h2>
                <div>
                  <label className={`text-xs font-bold ${textMuted} uppercase tracking-wider mb-2 block`}>Nombre</label>
                  <input type="text" value={selectedHabit.name} onChange={(e) => setSelectedHabit({ ...selectedHabit, name: e.target.value })} className={`w-full ${isDarkMode ? 'bg-black/20 border-gray-600' : 'bg-gray-50 border-gray-300'} border-2 rounded-xl p-3 outline-none`}/>
                </div>
                <div>
                  <label className={`text-xs font-bold ${textMuted} uppercase tracking-wider mb-2 block`}>Descripción</label>
                  <input type="text" value={selectedHabit.description} onChange={(e) => setSelectedHabit({ ...selectedHabit, description: e.target.value })} className={`w-full ${isDarkMode ? 'bg-black/20 border-gray-600' : 'bg-gray-50 border-gray-300'} border-2 rounded-xl p-3 outline-none`}/>
                </div>
                <div>
                  <label className={`text-xs font-bold ${textMuted} uppercase tracking-wider mb-2 block`}>Icono</label>
                  <div className="flex gap-2 flex-wrap bg-black/5 p-3 rounded-xl">
                    {iconOptions.map(icon => (
                      <button key={icon} onClick={() => setSelectedHabit({...selectedHabit, icon})} className={`text-2xl p-2 rounded-xl transition-all ${selectedHabit.icon === icon ? 'bg-blue-500/20 scale-110' : 'hover:bg-gray-500/20'}`}>{icon}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={`text-xs font-bold ${textMuted} uppercase tracking-wider mb-2 block`}>Tema de Color</label>
                  <div className="flex gap-3 flex-wrap p-2">
                    {Object.keys(THEME_COLORS).map(colorKey => (
                      <button key={colorKey} onClick={() => setSelectedHabit({...selectedHabit, colorKey})} className={`w-10 h-10 rounded-full ${THEME_COLORS[colorKey].active} ${selectedHabit.colorKey === colorKey ? 'ring-4 ring-offset-4 ring-blue-500' : 'hover:scale-110'} ${isDarkMode ? 'ring-offset-[#1F2937]' : 'ring-offset-white'} transition-all`}/>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-700/50">
                  <button onClick={() => setIsEditMode(false)} className={`px-5 py-3 rounded-xl font-bold ${textMuted} hover:bg-gray-500/10`}>Cancelar</button>
                  <button onClick={handleUpdateHabit} className={`px-6 py-3 ${THEME_COLORS[selectedHabit.colorKey].active} text-white rounded-xl font-bold shadow-lg hover:opacity-90`}>Guardar Cambios</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${modalBg} border rounded-3xl p-8 w-full max-w-md shadow-2xl`}>
            <h2 className="text-2xl font-bold mb-6">Nuevo Hábito</h2>
            <div className="flex flex-col gap-6">
              <div>
                <label className={`text-xs font-bold ${textMuted} uppercase tracking-wider mb-2 block`}>Nombre</label>
                <input type="text" value={newHabit.name} onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })} className={`w-full ${isDarkMode ? 'bg-black/20 border-gray-600' : 'bg-gray-50 border-gray-300'} border-2 rounded-xl p-3 outline-none focus:border-blue-500`} placeholder="Ej: Caminar 10k pasos"/>
              </div>
              <div>
                <label className={`text-xs font-bold ${textMuted} uppercase tracking-wider mb-2 block`}>Descripción (Opcional)</label>
                <input type="text" value={newHabit.description} onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })} className={`w-full ${isDarkMode ? 'bg-black/20 border-gray-600' : 'bg-gray-50 border-gray-300'} border-2 rounded-xl p-3 outline-none focus:border-blue-500`} placeholder="Ej: Por el parque al salir de trabajar"/>
              </div>
              <div>
                <label className={`text-xs font-bold ${textMuted} uppercase tracking-wider mb-2 block`}>Icono</label>
                <div className="flex gap-2 flex-wrap bg-black/5 p-3 rounded-xl">
                  {iconOptions.map(icon => (
                    <button key={icon} onClick={() => setNewHabit({...newHabit, icon})} className={`text-2xl p-2 rounded-xl transition-all ${newHabit.icon === icon ? 'bg-blue-500/20 scale-110' : 'hover:bg-gray-500/20'}`}>{icon}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className={`text-xs font-bold ${textMuted} uppercase tracking-wider mb-2 block`}>Tema de Color</label>
                <div className="flex gap-3 flex-wrap p-2">
                  {Object.keys(THEME_COLORS).map(colorKey => (
                    <button key={colorKey} onClick={() => setNewHabit({...newHabit, colorKey})} className={`w-10 h-10 rounded-full ${THEME_COLORS[colorKey].active} ${newHabit.colorKey === colorKey ? 'ring-4 ring-offset-4 ring-blue-500' : 'hover:scale-110'} ${isDarkMode ? 'ring-offset-[#1F2937]' : 'ring-offset-white'} transition-all`}/>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-700/50">
                <button onClick={() => setIsAddModalOpen(false)} className={`px-5 py-3 rounded-xl font-bold ${textMuted} hover:bg-gray-500/10`}>Cancelar</button>
                <button onClick={handleAddHabit} className={`px-6 py-3 ${isDarkMode ? 'bg-white text-black' : 'bg-blue-600 text-white'} rounded-xl font-bold shadow-lg hover:opacity-90`}>Guardar Hábito</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${modalBg} border rounded-3xl p-6 w-full max-w-sm shadow-2xl`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Ajustes</h2>
              <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-current text-2xl">✕</button>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center p-4 bg-black/5 rounded-xl">
                <span className="font-medium">Modo Oscuro</span>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-14 h-7 rounded-full relative transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${isDarkMode ? 'left-8' : 'left-1'}`} />
                </button>
              </div>
              <button className="flex justify-between items-center p-4 hover:bg-black/5 rounded-xl transition-colors text-left">
                <span className="font-medium">Exportar datos</span><span className="text-xl">📥</span>
              </button>
              <button className="flex justify-between items-center p-4 hover:bg-black/5 rounded-xl transition-colors text-left">
                <span className="font-medium">Importar datos</span><span className="text-xl">📤</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isProfileOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${modalBg} border rounded-3xl p-6 w-full max-w-md shadow-2xl`}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">{username.charAt(0)}</div>
                <div>
                  <h2 className="text-2xl font-bold">{username}</h2>
                  <p className={textMuted}>Miembro de HabitTrack</p>
                </div>
              </div>
              <button onClick={() => setIsProfileOpen(false)} className="text-gray-400 hover:text-current text-2xl">✕</button>
            </div>
            <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white text-center shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-1">Impacto Global</p>
              <p className="text-5xl font-black mb-2">{globalTotalDays}</p>
              <p className="text-sm">días totales invirtiendo en ti mismo. ¡Sigue así!</p>
            </div>
            <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${textMuted}`}>Progreso por Hábito</h3>
            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2">
              {habits.map(habit => (
                <div key={habit.id} className="flex justify-between items-center p-3 rounded-xl bg-black/5 border border-transparent">
                  <div className="flex items-center gap-3"><span className="text-xl">{habit.icon}</span><span className="font-medium">{habit.name}</span></div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{getTotalDays(habit.history)}</span>
                    <span className={`text-xs ${textMuted}`}>días</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;