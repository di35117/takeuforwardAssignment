import { useState, useEffect, useCallback } from "react";

export function useCalendarStore() {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Persistence using Local Storage
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("cal_data");
    return saved
      ? JSON.parse(saved)
      : { monthlyNotes: {}, events: {}, font: "font-sans" };
  });

  useEffect(() => {
    localStorage.setItem("cal_data", JSON.stringify(data));
  }, [data]);

  const [selection, setSelection] = useState({ start: null, end: null });
  const [isDragging, setIsDragging] = useState(false);

  // Modal States
  const [activeDateModal, setActiveDateModal] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 3D Flip State
  const [flipDirection, setFlipDirection] = useState("");
  const [isFlipping, setIsFlipping] = useState(false);

  const navigateMonth = useCallback(
    (dir) => {
      if (isFlipping) return;
      setFlipDirection(dir === "next" ? "flip-next" : "flip-prev");
      setIsFlipping(true);

      // Vibrate for mobile haptic feedback (if supported)
      if (navigator.vibrate) navigator.vibrate(50);

      setTimeout(() => {
        setCurrentDate(
          (prev) =>
            new Date(
              prev.getFullYear(),
              prev.getMonth() + (dir === "next" ? 1 : -1),
              1,
            ),
        );
        setIsFlipping(false);
      }, 500); // Matches CSS animation
    },
    [isFlipping],
  );

  const updateData = (key, value) =>
    setData((prev) => ({ ...prev, [key]: value }));

  return {
    currentDate,
    setCurrentDate,
    navigateMonth,
    data,
    updateData,
    selection,
    setSelection,
    isDragging,
    setIsDragging,
    activeDateModal,
    setActiveDateModal,
    showSettings,
    setShowSettings,
    isDarkMode,
    setIsDarkMode,
    flipDirection,
    isFlipping,
  };
}
