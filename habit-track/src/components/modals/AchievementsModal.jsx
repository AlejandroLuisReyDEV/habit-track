import React from "react";

export default function AchievementsModal({
  unlockedAchievements,
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{t.allAchievements}</h2>
          <button onClick={() => setIsAchievementsModalOpen(false)} className="text-gray-400 hover:text-current text-2xl">✕</button>
        </div>
        
        {/* CORRECCIÓN: Añadido p-2 para crear un margen de seguridad interno y que el scroll no recorte */}
        <div className="grid grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto p-2">
          {unlockedAchievements.map(ach => (
            <div key={ach.id} className="relative flex flex-col items-center bg-black/5 p-3 rounded-xl text-center border border-yellow-500/30">
              {ach.count > 1 && (
                <span className="absolute -top-1.5 -right-1.5 bg-blue-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full z-10 shadow-sm">
                  x{ach.count}
                </span>
              )}
              <span className="text-3xl mb-1">{ach.icon}</span>
              <span className="text-[10px] font-bold leading-tight mb-1">{ach.name[language]}</span>
              <span className={`text-[9px] ${textMuted} leading-tight`}>{ach.desc[language]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}