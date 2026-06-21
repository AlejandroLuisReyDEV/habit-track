import React from "react";
import { THEME_COLORS, ICON_OPTIONS } from "../../constants/theme";

export default function HabitDetailsModal({
  selectedHabit,
  setSelectedHabit,
  isEditMode,
  setIsEditMode,
  handleDeleteHabit,
  handleUpdateHabit,
  getStreak,
  getTotalDays,
  isDarkMode,
  t
}) {
  const modalBg = isDarkMode ? "bg-[#1F2937] border-gray-700" : "bg-white border-gray-200";
  const textMuted = isDarkMode ? "text-gray-400" : "text-gray-500";
  const activeColorBg = THEME_COLORS[selectedHabit.colorKey].active;
  const activeColorText = activeColorBg.replace("bg-", "text-");

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${isDarkMode ? THEME_COLORS[selectedHabit.colorKey].darkBg : THEME_COLORS[selectedHabit.colorKey].lightBg} ${modalBg} border-2 rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl relative overflow-hidden`}>
        <button onClick={() => setSelectedHabit(null)} className="absolute top-4 right-6 text-gray-400 hover:text-current text-2xl z-10">✕</button>
        {!isEditMode ? (
          <div className="flex flex-col gap-6">
            <div className="text-center mt-4">
              <div className={`w-24 h-24 mx-auto rounded-3xl ${isDarkMode ? "bg-black/20" : "bg-white"} flex items-center justify-center text-5xl shadow-lg mb-4`}>{selectedHabit.icon}</div>
              <h2 className="text-3xl font-black">{selectedHabit.name}</h2>
              {selectedHabit.description && <p className={`mt-2 ${textMuted}`}>{selectedHabit.description}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className={`${isDarkMode ? "bg-black/20" : "bg-white/50"} p-4 rounded-2xl text-center shadow-sm`}>
                <p className={`text-xs font-bold uppercase tracking-wider ${textMuted} mb-1`}>{t.streak}</p>
                <p className={`text-3xl font-black ${activeColorText}`}>{getStreak(selectedHabit.history)} <span className="text-sm">{t.days}</span></p>
              </div>
              <div className={`${isDarkMode ? "bg-black/20" : "bg-white/50"} p-4 rounded-2xl text-center shadow-sm`}>
                <p className={`text-xs font-bold uppercase tracking-wider ${textMuted} mb-1`}>{t.total}</p>
                <p className={`text-3xl font-black ${activeColorText}`}>{getTotalDays(selectedHabit.history)} <span className="text-sm">{t.days}</span></p>
              </div>
            </div>
            <div className="flex justify-between gap-3 mt-6">
              <button onClick={() => handleDeleteHabit(selectedHabit.id)} className="px-4 py-3 rounded-xl font-bold text-red-500 bg-red-500/10 hover:bg-red-500/20 transition-colors">{t.delete}</button>
              <button onClick={() => setIsEditMode(true)} className={`flex-1 py-3 ${activeColorBg} text-white rounded-xl font-bold shadow-lg hover:opacity-90`}>{t.editHabit}</button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold mb-2">{t.editHabit}</h2>
            <div>
              <label className={`text-xs font-bold ${textMuted} uppercase tracking-wider mb-2 block`}>{t.name}</label>
              <input type="text" value={selectedHabit.name} onChange={(e) => setSelectedHabit({ ...selectedHabit, name: e.target.value })} className={`w-full ${isDarkMode ? "bg-black/20 border-gray-600" : "bg-gray-50 border-gray-300"} border-2 rounded-xl p-3 outline-none`} />
            </div>
            <div>
              <label className={`text-xs font-bold ${textMuted} uppercase tracking-wider mb-2 block`}>{t.desc}</label>
              <input type="text" value={selectedHabit.description} onChange={(e) => setSelectedHabit({ ...selectedHabit, description: e.target.value })} className={`w-full ${isDarkMode ? "bg-black/20 border-gray-600" : "bg-gray-50 border-gray-300"} border-2 rounded-xl p-3 outline-none`} />
            </div>
            <div>
              <label className={`text-xs font-bold ${textMuted} uppercase tracking-wider mb-2 block`}>{t.icon}</label>
              <div className="flex gap-2 flex-wrap bg-black/5 p-3 rounded-xl">
                {ICON_OPTIONS.map((icon) => (
                  <button key={icon} onClick={() => setSelectedHabit({ ...selectedHabit, icon })} className={`text-2xl p-2 rounded-xl transition-all ${selectedHabit.icon === icon ? "bg-blue-500/20 scale-110" : "hover:bg-gray-500/20"}`}>{icon}</button>
                ))}
              </div>
            </div>
            <div>
              <label className={`text-xs font-bold ${textMuted} uppercase tracking-wider mb-2 block`}>{t.color}</label>
              <div className="flex gap-3 flex-wrap p-2">
                {Object.keys(THEME_COLORS).map((colorKey) => (
                  <button key={colorKey} onClick={() => setSelectedHabit({ ...selectedHabit, colorKey })} className={`w-10 h-10 rounded-full ${THEME_COLORS[colorKey].active} ${selectedHabit.colorKey === colorKey ? "ring-4 ring-offset-4 ring-blue-500" : "hover:scale-110"} ${isDarkMode ? "ring-offset-[#1F2937]" : "ring-offset-white"} transition-all`} />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-700/50">
              <button onClick={() => setIsEditMode(false)} className={`px-5 py-3 rounded-xl font-bold ${textMuted} hover:bg-gray-500/10`}>{t.cancel}</button>
              <button onClick={handleUpdateHabit} className={`px-6 py-3 ${activeColorBg} text-white rounded-xl font-bold shadow-lg hover:opacity-90`}>{t.saveChanges}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}