import React, { useEffect } from "react";
import { useCalendarStore } from "../../hooks/useCalendarStore";
import { MONTH_THEMES } from "../../utils/themeData";
import { exportToICS } from "../../utils/helpers";
import WeatherBar from "./WeatherBar";
import CalendarGrid from "./CalendarGrid";
import EventModal from "./EventModal";
import { ChevronLeft, ChevronRight, Download, Settings } from "lucide-react";

export default function WallCalendar() {
  const store = useCalendarStore();
  const theme = MONTH_THEMES[store.currentDate.getMonth()];
  const noteKey = `${store.currentDate.getFullYear()}-${store.currentDate.getMonth()}`;

  // Keyboard Navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (["TEXTAREA", "INPUT"].includes(e.target.tagName)) return;
      if (e.key === "ArrowRight") store.navigateMonth("next");
      if (e.key === "ArrowLeft") store.navigateMonth("prev");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [store]);

  return (
    <>
      <style>{`
        /* 3D Flip Animation */
        .perspective-container { perspective: 1500px; }
        .calendar-flip { transform-style: preserve-3d; transform-origin: top center; transition: transform 0.5s ease-in-out, opacity 0.5s; }
        .flip-next { animation: pageFlipUp 0.5s forwards; }
        .flip-prev { animation: pageFlipDown 0.5s forwards; }
        
        @keyframes pageFlipUp {
          0% { transform: rotateX(0deg); opacity: 1; }
          100% { transform: rotateX(-90deg) translateY(-50px) scale(0.9); opacity: 0; }
        }
        @keyframes pageFlipDown {
          0% { transform: rotateX(90deg) translateY(-50px) scale(0.9); opacity: 0; }
          100% { transform: rotateX(0deg) translateY(0); opacity: 1; }
        }

        /* Print Optimized View */
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .perspective-container { box-shadow: none !important; margin: 0; padding: 0; }
        }
      `}</style>

      <div
        className={`min-h-screen flex items-center justify-center p-4 sm:p-8 transition-colors duration-500 ${store.isDarkMode ? "bg-gray-900 text-white" : "bg-[#f0f0f0]"} ${store.data.font}`}
      >
        <div className="perspective-container w-full max-w-4xl">
          <div
            className={`calendar-flip relative bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden ${store.flipDirection}`}
          >
            {/* Top Toolbar (Non-printable) */}
            <div className="absolute top-4 right-4 z-50 flex gap-2 no-print">
              <button
                onClick={() =>
                  exportToICS(
                    store.selection.start,
                    store.selection.end,
                    store.data.monthlyNotes[noteKey],
                  )
                }
                className="p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/40"
                title="Export to ICS"
              >
                <Download size={16} />
              </button>
              <button
                onClick={() => store.setIsDarkMode(!store.isDarkMode)}
                className="p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/40"
                title="Toggle Theme"
              >
                <Settings size={16} />
              </button>
            </div>

            {/* HERO SECTION */}
            <div className="relative h-[250px] sm:h-[350px] overflow-hidden group">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                style={{ backgroundImage: `url(${theme.image})` }}
              />
              <div className="absolute inset-0 bg-black/30" />

              {/* Fake Spiral Binding */}
              <div className="absolute top-0 w-full flex justify-around px-10 py-2 z-10">
                {[...Array(16)].map((_, i) => (
                  <div
                    key={i}
                    className="w-3 h-6 rounded-full border-2 border-gray-400 bg-gray-200 shadow-inner"
                  />
                ))}
              </div>

              <div className="absolute bottom-6 right-8 text-right">
                <div className="text-xl font-medium tracking-widest text-white/90">
                  {store.currentDate.getFullYear()}
                </div>
                <div
                  className="text-4xl sm:text-5xl font-black tracking-tighter"
                  style={{ color: theme.textOnImage }}
                >
                  {theme.name}
                </div>
              </div>
            </div>

            {/* WEATHER BAR */}
            <WeatherBar isDarkMode={store.isDarkMode} />

            {/* BODY: Notes & Grid */}
            <div className="flex flex-col md:flex-row">
              {/* Notes Panel */}
              <div className="w-full md:w-1/3 p-6 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700 flex flex-col">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Monthly Memo
                </h3>
                <textarea
                  value={store.data.monthlyNotes[noteKey] || ""}
                  onChange={(e) =>
                    store.updateData("monthlyNotes", {
                      ...store.data.monthlyNotes,
                      [noteKey]: e.target.value,
                    })
                  }
                  placeholder="Goals, targets, reminders..."
                  className="flex-1 min-h-[200px] bg-transparent resize-none outline-none text-sm leading-8"
                  style={{
                    backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, ${store.isDarkMode ? "#374151" : "#e5e7eb"} 31px, ${store.isDarkMode ? "#374151" : "#e5e7eb"} 32px)`,
                    backgroundAttachment: "local",
                  }}
                />
              </div>

              {/* Grid Section */}
              <div className="w-full md:w-2/3 flex flex-col">
                <div className="flex justify-between items-center p-6 pb-0 no-print">
                  <button
                    onClick={() => store.navigateMonth("prev")}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <ChevronLeft size={20} style={{ color: theme.accent }} />
                  </button>
                  <span className="text-sm font-bold opacity-60">
                    Double-click a day for events
                  </span>
                  <button
                    onClick={() => store.navigateMonth("next")}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  >
                    <ChevronRight size={20} style={{ color: theme.accent }} />
                  </button>
                </div>

                <CalendarGrid store={store} theme={theme} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {store.activeDateModal && (
        <EventModal
          date={store.activeDateModal}
          data={store.data}
          updateData={store.updateData}
          onClose={() => store.setActiveDateModal(null)}
          isDarkMode={store.isDarkMode}
        />
      )}
    </>
  );
}
