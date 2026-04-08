import React from "react";
import { X } from "lucide-react";

export default function SettingsModal({ store, onClose }) {
  const handleFontChange = (e) => {
    store.updateData("font", e.target.value);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6 ${store.isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
      >
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-lg">Calendar Settings</h3>
          <button onClick={onClose} className="hover:opacity-70">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Typography Style
            </label>
            <select
              value={store.data.font}
              onChange={handleFontChange}
              className="w-full p-2 border rounded outline-none bg-transparent border-gray-300 dark:border-gray-600"
            >
              <option value="font-sans">Modern (Sans Serif)</option>
              <option value="font-serif">Classic (Serif)</option>
              <option value="font-mono">Developer (Monospace)</option>
            </select>
          </div>

          <button
            onClick={() => store.updateData("stickyNotes", [])}
            className="w-full p-2 text-red-500 border border-red-500 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            Clear All Sticky Notes
          </button>
        </div>
      </div>
    </div>
  );
}
