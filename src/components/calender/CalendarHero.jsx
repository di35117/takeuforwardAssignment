import React, { useEffect, useState } from "react";
import ColorThief from "colorthief/dist/color-thief.mjs";
import { Sun, Moon, Calendar as CalIcon, FastForward } from "lucide-react";

export default function CalendarHero({ theme, currentDate, store }) {
  const [dynamicAccent, setDynamicAccent] = useState(theme.accent);

  // Dynamic Color Extraction
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = theme.image;
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const color = colorThief.getColor(img);
        setDynamicAccent(`rgb(${color[0]}, ${color[1]}, ${color[2]})`);
      } catch (e) {
        setDynamicAccent(theme.accent); // Fallback
      }
    };
  }, [theme.image]);

  const handleQuickJump = (e) => {
    const [year, month] = e.target.value.split("-");
    store.jumpToDate(parseInt(year), parseInt(month) - 1);
  };

  return (
    <div className="relative h-[250px] sm:h-[350px] overflow-hidden group">
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
        style={{ backgroundImage: `url(${theme.image})` }}
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* Quick Jump & Controls */}
      <div className="absolute top-4 right-4 z-50 flex gap-2 no-print">
        {store.showQuickJump ? (
          <input
            type="month"
            onChange={handleQuickJump}
            className="p-1 rounded bg-white text-black outline-none"
          />
        ) : (
          <button
            onClick={() => store.setShowQuickJump(true)}
            className="p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/40"
          >
            <FastForward size={16} />
          </button>
        )}
        <button
          onClick={() =>
            store.jumpToDate(new Date().getFullYear(), new Date().getMonth())
          }
          className="p-2 bg-white/20 backdrop-blur rounded-full text-white hover:bg-white/40"
        >
          <CalIcon size={16} />
        </button>
      </div>

      <div className="absolute bottom-6 right-8 text-right z-20">
        <div className="text-xl font-medium tracking-widest text-white/90">
          {currentDate.getFullYear()}
        </div>
        <div
          className="text-4xl sm:text-5xl font-black tracking-tighter"
          style={{ color: dynamicAccent }}
        >
          {theme.name}
        </div>
      </div>

      {/* Expose dynamic accent to CSS variables for downstream components */}
      <style>{`:root { --dynamic-accent: ${dynamicAccent}; }`}</style>
    </div>
  );
}
