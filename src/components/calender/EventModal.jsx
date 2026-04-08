import React, { useState } from "react";
import { X, Clock, AlignLeft } from "lucide-react";
import { getDateKey } from "../../utils/helpers";

export default function EventModal({
  date,
  data,
  updateData,
  onClose,
  isDarkMode,
}) {
  const dateKey = getDateKey(date);
  const existingEvents = data.events[dateKey] || [];
  const [newEvent, setNewEvent] = useState({
    title: "",
    time: "",
    type: "meeting",
  });

  const handleSave = () => {
    if (!newEvent.title) return;
    const updatedEvents = {
      ...data.events,
      [dateKey]: [...existingEvents, { ...newEvent, id: Date.now() }],
    };
    updateData("events", updatedEvents);
    setNewEvent({ title: "", time: "", type: "meeting" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 no-print">
      <div
        className={`w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
      >
        <div className="flex justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="font-bold text-lg">{date.toDateString()}</h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {existingEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-2 bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 rounded text-sm flex justify-between"
              >
                <span className="font-semibold">{ev.title}</span>
                <span className="opacity-70 flex items-center gap-1">
                  <Clock size={12} />
                  {ev.time || "All day"}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-2">
            <input
              type="text"
              placeholder="Event/Meeting title..."
              value={newEvent.title}
              onChange={(e) =>
                setNewEvent({ ...newEvent, title: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 outline-none"
            />
            <div className="flex gap-2">
              <input
                type="time"
                value={newEvent.time}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, time: e.target.value })
                }
                className="w-1/2 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 outline-none"
              />
              <button
                onClick={handleSave}
                className="w-1/2 bg-sky-500 text-white rounded font-bold hover:bg-sky-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
