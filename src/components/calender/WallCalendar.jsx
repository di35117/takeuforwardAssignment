import React from "react";
import { DndContext } from "@dnd-kit/core";
import Confetti from "react-confetti";
import { useCalendarStore } from "../../hooks/useCalendarStore";
import { MONTH_THEMES } from "../../utils/themeData";
import { exportToICS } from "../../utils/helpers";
import CalendarHero from "./CalendarHero";
import CalendarGrid from "./CalendarGrid";
import SettingsModal from "./SettingsModal";
import { Settings, Download } from "lucide-react";

export default function WallCalendar() {
  const store = useCalendarStore();
  const theme = MONTH_THEMES[store.currentDate.getMonth()];

  // Handle Sticky Note Drops
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id === "new-sticky") {
      const dateKey = over.id;
      const text = prompt("Enter note text:");
      if (text) {
        const newNote = { id: Date.now().toString(), text, dateKey };
        store.updateData("stickyNotes", [...store.data.stickyNotes, newNote]);

        // Trigger Confetti if they added a note!
        if (
          text.toLowerCase().includes("done") ||
          text.toLowerCase().includes("won")
        ) {
          store.triggerConfetti();
        }
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {store.showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      <div
        className={`min-h-screen flex items-center justify-center p-4 sm:p-8 transition-colors duration-500 ${store.isDarkMode ? "bg-gray-900 text-white" : "bg-[#f0f0f0]"} ${store.data.font}`}
      >
        <div className="perspective-container w-full max-w-4xl">
          <div
            className={`calendar-flip relative bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden ${store.flipDirection}`}
          >
            {/* Top Toolbar */}
            <div className="absolute top-16 right-4 z-50 flex gap-2 no-print">
              <button
                onClick={() =>
                  exportToICS(store.selections, store.data.monthlyNotes)
                }
                className="p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/40"
              >
                <Download size={16} />
              </button>
              <button
                onClick={() => store.setShowSettings(true)}
                className="p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/40"
              >
                <Settings size={16} />
              </button>
            </div>

            <CalendarHero
              theme={theme}
              currentDate={store.currentDate}
              store={store}
            />

            <div className="flex flex-col md:flex-row">
              {/* Draggable Source Area */}
              <div className="w-full md:w-1/3 p-6 border-r border-gray-100 dark:border-gray-700">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-4">
                  Drag to assign
                </h3>

                {/* A simplified draggable element representation */}
                <div
                  id="new-sticky"
                  draggable="true"
                  onDragStart={(e) => {
                    e.dataTransfer.setData("text/plain", "new-sticky");
                  }}
                  className="w-full p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded shadow-sm cursor-grab active:cursor-grabbing text-sm font-medium"
                >
                  + Drag New Sticky Note
                </div>
              </div>

              <div className="w-full md:w-2/3 flex flex-col">
                <CalendarGrid store={store} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {store.showSettings && (
        <SettingsModal
          store={store}
          onClose={() => store.setShowSettings(false)}
        />
      )}
    </DndContext>
  );
}
