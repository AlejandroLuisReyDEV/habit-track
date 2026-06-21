import React from "react";

export default function SettingsModal({ isDarkMode, setIsDarkMode, language, setLanguage, setIsSettingsOpen, t }) {
  const modalBg = isDarkMode ? "bg-[#1F2937] border-gray-700" : "bg-white border-gray-200";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`${modalBg} border rounded-3xl p-6 w-full max-w-sm shadow-2xl`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{t.settings}</h2>
          <button onClick={() => setIsSettingsOpen(false)} className="text-gray-400 hover:text-current text-2xl">✕</button>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center p-4 bg-black/5 rounded-xl">
            <span className="font-medium">{t.darkMode}</span>
            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-14 h-7 rounded-full relative transition-colors ${isDarkMode ? "bg-blue-600" : "bg-gray-300"}`}>
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all shadow-sm ${isDarkMode ? "left-8" : "left-1"}`} />
            </button>
          </div>

          <div className="flex justify-between items-center p-4 bg-black/5 rounded-xl mt-2">
            <span className="font-medium">{t.language}</span>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className={`rounded-lg p-1 outline-none ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}>
              <option value="es">Español</option>
              <option value="en">English</option>
            </select>
          </div>

          <button className="flex justify-between items-center p-4 hover:bg-black/5 rounded-xl transition-colors text-left">
            <span className="font-medium">{t.export}</span><span className="text-xl">📥</span>
          </button>
          <button className="flex justify-between items-center p-4 hover:bg-black/5 rounded-xl transition-colors text-left">
            <span className="font-medium">{t.import}</span><span className="text-xl">📤</span>
          </button>
        </div>
      </div>
    </div>
  );
}