import React, { useMemo } from "react";
import { HOLIDAYS } from "../../utils/themeData";
import { getDateKey, isSameDay } from "../../utils/helpers";

export default function CalendarGrid({ store, theme }) {
  const {
    currentDate,
    selection,
    setSelection,
    isDragging,
    setIsDragging,
    data,
    setActiveDateModal,
    isDarkMode,
  } = store;

  // Calendar Math
  const days = useMemo(() => {
    const total = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    ).getDate();
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    ).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    return [
      ...Array(offset).fill(null),
      ...Array.from(
        { length: total },
        (_, i) =>
          new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1),
      ),
    ];
  }, [currentDate]);

  // Drag-to-select interactions
  const handleMouseDown = (date) => {
    if (date) {
      setSelection({ start: date, end: null });
      setIsDragging(true);
    }
  };
  const handleMouseEnter = (date) => {
    if (isDragging && date) setSelection((prev) => ({ ...prev, end: date }));
  };
  const handleMouseUp = () => setIsDragging(false);

  const getStatus = (date) => {
    if (!date || !selection.start) return "";
    if (isSameDay(date, selection.start)) return "start";
    if (selection.end && isSameDay(date, selection.end)) return "end";

    if (selection.end) {
      const min =
        selection.start < selection.end ? selection.start : selection.end;
      const max =
        selection.start > selection.end ? selection.start : selection.end;
      if (date > min && date < max) return "in-range";
    }
    return "";
  };

  return (
    <div
      className="grid grid-cols-7 gap-y-2 gap-x-1 p-6 relative flex-1"
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
    >
      {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d, i) => (
        <div
          key={d}
          className={`text-center text-xs font-bold mb-2 ${i >= 5 ? "text-sky-500" : "text-gray-400"}`}
        >
          {d}
        </div>
      ))}

      {days.map((date, i) => {
        const status = getStatus(date);
        const hasEvents = date && data.events[getDateKey(date)]?.length > 0;
        const isHoliday =
          date && HOLIDAYS[`${date.getMonth()}-${date.getDate()}`];

        return (
          <div
            key={i}
            className="relative flex justify-center items-center h-10 w-full group"
          >
            {/* Range Backgrounds */}
            {status === "in-range" && (
              <div
                className="absolute inset-0 w-full h-full opacity-20"
                style={{ backgroundColor: theme.accent }}
              />
            )}
            {status === "start" && selection.end && (
              <div
                className="absolute right-0 w-1/2 h-full opacity-20"
                style={{ backgroundColor: theme.accent }}
              />
            )}
            {status === "end" && (
              <div
                className="absolute left-0 w-1/2 h-full opacity-20"
                style={{ backgroundColor: theme.accent }}
              />
            )}

            {date && (
              <button
                onMouseDown={() => handleMouseDown(date)}
                onMouseEnter={() => handleMouseEnter(date)}
                onDoubleClick={() => setActiveDateModal(date)}
                className={`relative z-10 w-8 h-8 rounded-full flex flex-col items-center justify-center text-sm transition-all
                  ${status === "start" || status === "end" ? "text-white scale-110 shadow-lg" : "hover:bg-gray-100 dark:hover:bg-gray-800"}
                  ${!status && isDarkMode ? "text-gray-300" : "text-gray-700"}
                `}
                style={
                  status === "start" || status === "end"
                    ? { backgroundColor: theme.accent }
                    : {}
                }
              >
                {date.getDate()}

                {/* Event & Holiday Indicators */}
                <div className="absolute bottom-0 flex gap-1 mb-1">
                  {isHoliday && (
                    <span className="w-1 h-1 rounded-full bg-red-400" />
                  )}
                  {hasEvents && (
                    <span
                      className="w-1 h-1 rounded-full"
                      style={{ backgroundColor: theme.accent }}
                    />
                  )}
                </div>

                {/* Hover Tooltip for Holidays */}
                {isHoliday && (
                  <span className="absolute bottom-full mb-2 w-max px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 pointer-events-none">
                    {isHoliday}
                  </span>
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
