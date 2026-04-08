import React, { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import { HOLIDAYS } from "../../utils/themeData";
import { getDateKey, isSameDay } from "../../utils/helpers";

export default function CalendarGrid({ store }) {
  const {
    currentDate,
    selections,
    setSelections,
    isDragging,
    setIsDragging,
    data,
    isDarkMode,
  } = store;

  const days = useMemo(() => {
    // ... (Keep existing day generation logic)
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

  // Multi-Range Selection Logic
  const handleMouseDown = (e, date) => {
    if (!date) return;
    if (e.ctrlKey || e.metaKey) {
      setSelections([...selections, { start: date, end: null }]);
    } else {
      setSelections([{ start: date, end: null }]);
    }
    setIsDragging(true);
  };

  const handleMouseEnter = (date) => {
    if (!isDragging || !date || selections.length === 0) return;
    const newSelections = [...selections];
    newSelections[newSelections.length - 1].end = date;
    setSelections(newSelections);
  };

  const checkStatus = (date) => {
    if (!date) return "";
    for (const range of selections) {
      if (isSameDay(date, range.start)) return "start";
      if (range.end && isSameDay(date, range.end)) return "end";
      if (range.end) {
        const min = range.start < range.end ? range.start : range.end;
        const max = range.start > range.end ? range.start : range.end;
        if (date > min && date < max) return "in-range";
      }
    }
    return "";
  };

  return (
    <div
      className="grid grid-cols-7 gap-y-2 gap-x-1 p-6 flex-1 relative"
      onMouseLeave={() => setIsDragging(false)}
      onMouseUp={() => setIsDragging(false)}
    >
      {/* ... (Keep Weekday mapping) */}

      {days.map((date, i) => {
        const status = checkStatus(date);

        // Define Drop Zone for DND-kit
        const { setNodeRef } = useDroppable({
          id: date ? getDateKey(date) : `empty-${i}`,
          data: { date },
        });

        return (
          <div
            ref={setNodeRef}
            key={i}
            className="relative flex justify-center items-center h-12 w-full"
          >
            {status === "in-range" && (
              <div className="absolute inset-0 w-full h-full opacity-20 bg-[var(--dynamic-accent)]" />
            )}

            {date && (
              <button
                onMouseDown={(e) => handleMouseDown(e, date)}
                onMouseEnter={() => handleMouseEnter(date)}
                onDoubleClick={() => store.setActiveDateModal(date)}
                className={`relative z-10 w-8 h-8 rounded-full transition-all ${status === "start" || status === "end" ? "text-white scale-110 shadow-lg bg-[var(--dynamic-accent)]" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
              >
                {date.getDate()}
              </button>
            )}

            {/* Render Sticky Notes that belong to this date */}
            {date &&
              data.stickyNotes
                .filter((n) => n.dateKey === getDateKey(date))
                .map((note) => (
                  <div
                    key={note.id}
                    className="absolute bottom-0 w-full h-2 bg-yellow-300 rounded-sm shadow-sm z-20"
                    title={note.text}
                  />
                ))}
          </div>
        );
      })}
    </div>
  );
}
