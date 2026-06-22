import React from "react";
import { useAuth } from '../../context/AuthContext';

export default function ProfileModal({
  username, // Esta variable ya te llega desde App.jsx
  globalTotalDays,
  unlockedAchievements,
  displayAchievements,
  hasMoreAchievements,
  habits,
  getTotalDays,
  setIsProfileOpen,
  setIsAchievementsModalOpen,
  isDarkMode,
  language,
  t
}) {
  const modalBg = isDarkMode ? "bg-[#1F2937] border-gray-700" : "bg-white border-gray-200";
  const textMuted = isDarkMode ? "text-gray-400" : "text-gray-500";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${modalBg} border rounded-3xl p-6 w-full max-w-md shadow-2xl`}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {username?.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{username}</h2>
              <p className={textMuted}>{t.member}</p>
            </div>
          </div>
          <button onClick={() => setIsProfileOpen(false)} className="text-gray-400 hover:text-current text-2xl">✕</button>
        </div>

        <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white text-center shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-wider opacity-80 mb-1">{t.impact}</p>
          <p className="text-5xl font-black mb-2">{globalTotalDays}</p>
          <p className="text-sm">{t.impactMsg}</p>
        </div>

        <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 mt-6 ${textMuted}`}>
          {t.achievements}
        </h3>

        {/* CORRECCIÓN: Usamos Grid de 4 columnas en lugar de Flex con Scroll */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {unlockedAchievements.length > 0 ? (
            <>
              {displayAchievements.map(ach => (
                <div key={ach.id} className="relative flex flex-col items-center justify-center bg-black/5 p-2 rounded-xl text-center border border-yellow-500/30">
                  {ach.count > 1 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full z-10 shadow-sm">
                      x{ach.count}
                    </span>
                  )}
                  <span className="text-3xl mb-1">{ach.icon}</span>
                  <span className="text-[9px] font-bold leading-tight">{ach.name[language]}</span>
                </div>
              ))}
              {hasMoreAchievements && (
                <button onClick={() => setIsAchievementsModalOpen(true)} className="flex flex-col justify-center items-center bg-black/5 hover:bg-black/10 transition-colors p-2 rounded-xl text-center border border-gray-500/30">
                  <span className="text-xl mb-1">➕</span>
                  <span className="text-[9px] font-bold leading-tight mt-1">{t.viewMore}</span>
                </button>
              )}
            </>
          ) : (
            <p className={`text-sm ${textMuted} italic col-span-4`}>{t.emptyAch}</p>
          )}
        </div>

        <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 ${textMuted}`}>{t.progress}</h3>
        <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2">
          {habits.map((habit) => (
            <div key={habit.id} className="flex justify-between items-center p-3 rounded-xl bg-black/5 border border-transparent">
              <div className="flex items-center gap-3"><span className="text-xl">{habit.icon}</span><span className="font-medium">{habit.name}</span></div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{getTotalDays(habit.history)}</span>
                <span className={`text-xs ${textMuted}`}>{t.days}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}