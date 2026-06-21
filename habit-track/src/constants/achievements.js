export const ACHIEVEMENTS = [
  // --- SERIE DE RACHAS (Consecutivas) - type: 'habit' ---
  { id: 'streak_3', type: 'habit', name: { es: 'Constancia', en: 'Consistency' }, desc: { es: 'Alcanza una racha de 3 días', en: 'Reach a 3-day streak' }, condition: (stats) => stats.streak >= 3, icon: '🔥' },
  { id: 'streak_7', type: 'habit', name: { es: 'Imparable', en: 'Unstoppable' }, desc: { es: 'Alcanza una racha de 7 días', en: 'Reach a 7-day streak' }, condition: (stats) => stats.streak >= 7, icon: '⚡' },
  { id: 'streak_31', type: 'habit', name: { es: 'Hábito Formado', en: 'Habit Formed' }, desc: { es: 'Alcanza una racha de 31 días', en: 'Reach a 31-day streak' }, condition: (stats) => stats.streak >= 31, icon: '🗓️' },
  { id: 'streak_365', type: 'habit', name: { es: 'Un Año de Hierro', en: 'A Year of Iron' }, desc: { es: 'Alcanza una racha de 365 días', en: 'Reach a 365-day streak' }, condition: (stats) => stats.streak >= 365, icon: '🌎' },
  { id: 'streak_500', type: 'habit', name: { es: 'Medio Milenio', en: 'Half Millennium' }, desc: { es: 'Alcanza una racha de 500 días', en: 'Reach a 500-day streak' }, condition: (stats) => stats.streak >= 500, icon: '🚀' },
  { id: 'streak_666', type: 'habit', name: { es: 'Pacto de Sangre', en: 'Blood Pact' }, desc: { es: 'Alcanza una racha de 666 días', en: 'Reach a 666-day streak' }, condition: (stats) => stats.streak >= 666, icon: '😈' },
  { id: 'streak_777', type: 'habit', name: { es: 'Pero madre mia willy, que haces aqui compañero', en: 'Divine Luck' }, desc: { es: 'Alcanza una racha de 777 días', en: 'Reach a 777-day streak' }, condition: (stats) => stats.streak >= 777, icon: '🎰' },
  { id: 'streak_1000', type: 'habit', name: { es: 'Leyenda Viva', en: 'Living Legend' }, desc: { es: 'Alcanza una racha de 1000 días', en: 'Reach a 1000-day streak' }, condition: (stats) => stats.streak >= 1000, icon: '👑' },

  // --- SERIE DE CONSTANCIA (Acumulados) - type: 'habit' ---
  { id: 'total_30', type: 'habit', name: { es: 'Veterano', en: 'Veteran' }, desc: { es: 'Acumula 30 días en un hábito', en: 'Accumulate 30 days in a habit' }, condition: (stats) => stats.totalDays >= 30, icon: '🥉' },
  { id: 'total_100', type: 'habit', name: { es: 'Centurión', en: 'Centurion' }, desc: { es: 'Acumula 100 días en un hábito', en: 'Accumulate 100 days in a habit' }, condition: (stats) => stats.totalDays >= 100, icon: '🥈' },
  { id: 'total_365', type: 'habit', name: { es: 'Aniversario', en: 'Anniversary' }, desc: { es: 'Acumula 365 días en un hábito', en: 'Accumulate 365 days in a habit' }, condition: (stats) => stats.totalDays >= 365, icon: '🥇' },

  // --- SERIE DE PRODUCTIVIDAD DIARIA (Globales) - type: 'global' ---
  { id: 'prod_3', type: 'global', name: { es: 'Multitarea', en: 'Multitasker' }, desc: { es: 'Completa 3 hábitos en un mismo día', en: 'Complete 3 habits on the same day' }, condition: (stats) => stats.maxHabitsInOneDay >= 3, icon: '🎯' },
  { id: 'prod_5', type: 'global', name: { es: 'Máquina', en: 'Machine' }, desc: { es: 'Completa 5 hábitos en un mismo día', en: 'Complete 5 habits on the same day' }, condition: (stats) => stats.maxHabitsInOneDay >= 5, icon: '🤖' }
];