import { useState, useEffect, useCallback } from "react";

export function useCalendarStore() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [data, setData] = useState(() => {
    const saved = localStorage.getItem("cal_data");
    return saved
      ? JSON.parse(saved)
      : {
          monthlyNotes: {},
          events: {},
          font: "font-sans",
          stickyNotes: [], // Array of { id, text, dateKey }
        };
  });

  useEffect(() => {
    localStorage.setItem("cal_data", JSON.stringify(data));
  }, [data]);

  // Updated for Multi-Range (Ctrl+Click)
  const [selections, setSelections] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  // Modals & UI State
  const [activeDateModal, setActiveDateModal] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showQuickJump, setShowQuickJump] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // 3D Flip State
  const [flipDirection, setFlipDirection] = useState("");
  const [isFlipping, setIsFlipping] = useState(false);

  const navigateMonth = useCallback(
    (dir) => {
      if (isFlipping) return;
      setFlipDirection(dir === "next" ? "flip-next" : "flip-prev");
      setIsFlipping(true);
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
      }, 500);
    },
    [isFlipping],
  );

  const jumpToDate = (year, month) => {
    setCurrentDate(new Date(year, month, 1));
    setShowQuickJump(false);
  };

  const updateData = (key, value) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  return {
    currentDate,
    setCurrentDate,
    navigateMonth,
    jumpToDate,
    data,
    updateData,
    selections,
    setSelections,
    isDragging,
    setIsDragging,
    activeDateModal,
    setActiveDateModal,
    showSettings,
    setShowSettings,
    showQuickJump,
    setShowQuickJump,
    isDarkMode,
    setIsDarkMode,
    showConfetti,
    triggerConfetti,
    flipDirection,
    isFlipping,
  };
}
