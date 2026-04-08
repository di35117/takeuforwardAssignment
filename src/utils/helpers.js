export const isSameDay = (a, b) =>
  a && b && a.toDateString() === b.toDateString();
export const getDateKey = (date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

export const exportToICS = (selectionStart, selectionEnd, notes) => {
  if (!selectionStart) return alert("Select dates to export!");

  const end = selectionEnd || selectionStart;
  // Format to YYYYMMDD
  const formatIcsDate = (d) =>
    d.toISOString().replace(/[-:]/g, "").split("T")[0];

  const icsData = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART;VALUE=DATE:${formatIcsDate(selectionStart)}
DTEND;VALUE=DATE:${formatIcsDate(new Date(end.getTime() + 86400000))}
SUMMARY:Calendar Selection
DESCRIPTION:${notes || "Exported from Wall Calendar"}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsData], { type: "text/calendar" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "calendar-events.ics";
  a.click();
  window.URL.revokeObjectURL(url);
};
