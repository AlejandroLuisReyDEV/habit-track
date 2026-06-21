import React from "react";
import { THEME_COLORS, ICON_OPTIONS } from "../../constants/theme";

export default function AddHabitModal({ newHabit, setNewHabit, handleAddHabit, setIsAddModalOpen, isDarkMode, t }) {
  const modalBg = isDarkMode ? "bg-[#1F2937] border-gray-700" : "bg-white border-gray-200";
  const textMuted = isDarkMode ? "text-gray-400" : "text-gray-500";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${modalBg} border rounded-3xl p-8 w-full max-w-md shadow-2xl`}>
        <h2 className="text-2xl font-bold mb-6">{t.newHabit}</h2>
        <div className="flex flex-col gap-6">
          <div>
            <label className={`text-xs font-bold ${textMuted} uppercase tracking-wider mb-2 block`}>{t.name}</label>
            <input type="text" value={newHabit.name} onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })} className={`w-full ${isDarkMode ? "bg-black/20 border-gray-600" : "bg-gray-50 border-gray-300"} border-2 rounded-xl p-3 outline-none focus:border-blue-500`} placeholder={t.namePlaceholder} />
          </div>
          <div>
            <label className={`text-xs font-bold ${textMuted} uppercase tracking-wider mb-2 block`}>{t.descOpt}</label>
            <input type="text" value={newHabit.description} onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })} className={`w-full ${isDarkMode ? "bg-black/20 border-gray-600" : "bg-gray-50 border-gray-300"} border-2 rounded-xl p-3 outline-none focus:border-blue-500`} placeholder={t.descPlaceholder} />
          </div>
          <div>
            <label className={`text-xs font-bold ${textMuted} uppercase tracking-wider mb-2 block`}>{t.icon}</label>
            <div className="flex gap-2 flex-wrap bg-black/5 p-3 rounded-xl">
              {ICON_OPTIONS.map((icon) => (
                <button key={icon} onClick={() => setNewHabit({ ...newHabit, icon })} className={`text-2xl p-2 rounded-xl transition-all ${newHabit.icon === icon ? "bg-blue-500/20 scale-110" : "hover:bg-gray-500/20"}`}>{icon}</button>
              ))}
            </div>
          </div>
          <div>
            <label className={`text-xs font-bold ${textMuted} uppercase tracking-wider mb-2 block`}>{t.color}</label>
            <div className="flex gap-3 flex-wrap p-2">
              {Object.keys(THEME_COLORS).map((colorKey) => (
                <button key={colorKey} onClick={() => setNewHabit({ ...newHabit, colorKey })} className={`w-10 h-10 rounded-full ${THEME_COLORS[colorKey].active} ${newHabit.colorKey === colorKey ? "ring-4 ring-offset-4 ring-blue-500" : "hover:scale-110"} ${isDarkMode ? "ring-offset-[#1F2937]" : "ring-offset-white"} transition-all`} />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-700/50">
            <button onClick={() => setIsAddModalOpen(false)} className={`px-5 py-3 rounded-xl font-bold ${textMuted} hover:bg-gray-500/10`}>{t.cancel}</button>
            <button onClick={handleAddHabit} className={`px-6 py-3 ${isDarkMode ? "bg-white text-black" : "bg-blue-600 text-white"} rounded-xl font-bold shadow-lg hover:opacity-90`}>{t.saveHabit}</button>
          </div>
        </div>
      </div>
    </div>
  );
}