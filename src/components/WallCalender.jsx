import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Sun,
  Moon,
  CloudRain,
  Cloud,
  ChevronLeft,
  ChevronRight,
  X,
  Settings,
  Download,
  Bell,
  Trash2,
  Calendar as CalendarIcon,
  Edit3,
} from "lucide-react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const THEMES = [
  {
    name: "JANUARY",
    image:
      "https://res.cloudinary.com/dustrkqlj/image/upload/v1775668401/january_isc3uu.webp",
    accent: "#3b82f6",
  },
  {
    name: "FEBRUARY",
    image:
      "https://res.cloudinary.com/dustrkqlj/image/upload/v1775668400/february_ccvxwi.webp",
    accent: "#ec4899",
  },
  {
    name: "MARCH",
    image:
      "https://res.cloudinary.com/dustrkqlj/image/upload/v1775668399/march_oaamxt.webp",
    accent: "#22c55e",
  },
  {
    name: "APRIL",
    image:
      "https://res.cloudinary.com/dustrkqlj/image/upload/v1775668399/april_lijis4.webp",
    accent: "#a855f7",
  },
  {
    name: "MAY",
    image:
      "https://res.cloudinary.com/dustrkqlj/image/upload/v1775668398/may_ya4n3l.webp",
    accent: "#06b6d4",
  },
  {
    name: "JUNE",
    image:
      "https://res.cloudinary.com/dustrkqlj/image/upload/v1775668425/june_tie11r.webp",
    accent: "#f59e0b",
  },
  {
    name: "JULY",
    image:
      "https://res.cloudinary.com/dustrkqlj/image/upload/v1775668425/july_z5kqiw.webp",
    accent: "#ef4444",
  },
  {
    name: "AUGUST",
    image:
      "https://res.cloudinary.com/dustrkqlj/image/upload/v1775668394/august_ocmgob.webp",
    accent: "#f97316",
  },
  {
    name: "SEPTEMBER",
    image:
      "https://res.cloudinary.com/dustrkqlj/image/upload/v1775668396/september_mnwhhu.webp",
    accent: "#eab308",
  },
  {
    name: "OCTOBER",
    image:
      "https://res.cloudinary.com/dustrkqlj/image/upload/v1775668396/october_vvuo3n.webp",
    accent: "#ea580c",
  },
  {
    name: "NOVEMBER",
    image:
      "https://res.cloudinary.com/dustrkqlj/image/upload/v1775668409/november_gymm4v.webp",
    accent: "#78716c",
  },
  {
    name: "DECEMBER",
    image:
      "https://res.cloudinary.com/dustrkqlj/image/upload/v1775668408/december_gytqqi.webp",
    accent: "#6366f1",
  },
];

const HOLIDAYS = {
  "0-1": { label: "New Year's Day", emoji: "🎉", type: "national" },
  "0-14": { label: "Makar Sankranti", emoji: "🪁", type: "festival" },
  "0-15": { label: "Magh Bihu", emoji: "🌾", type: "regional" },
  "0-26": { label: "Republic Day", emoji: "🇮🇳", type: "national" },
  "1-15": { label: "Maha Shivaratri", emoji: "🔱", type: "festival" },
  "2-3": { label: "Holi", emoji: "🎨", type: "festival" },
  "2-20": { label: "Eid-ul-Fitr", emoji: "🌙", type: "festival" },
  "3-3": { label: "Good Friday", emoji: "✝️", type: "festival" },
  "3-14": { label: "Ambedkar Jayanti", emoji: "⚖️", type: "national" },
  "3-15": { label: "Rongali Bihu", emoji: "🌺", type: "regional" },
  "4-1": { label: "Labour Day", emoji: "👷", type: "national" },
  "4-27": { label: "Eid-ul-Adha", emoji: "🐐", type: "festival" },
  "7-15": { label: "Independence Day", emoji: "🇮🇳", type: "national" },
  "7-28": { label: "Raksha Bandhan", emoji: "🪢", type: "festival" },
  "8-4": { label: "Janmashtami", emoji: "🪈", type: "festival" },
  "8-14": { label: "Ganesh Chaturthi", emoji: "🐘", type: "festival" },
  "9-2": { label: "Gandhi Jayanti", emoji: "👓", type: "national" },
  "9-18": { label: "Kati Bihu", emoji: "🪔", type: "regional" },
  "9-19": { label: "Dussehra", emoji: "🏹", type: "festival" },
  "10-8": { label: "Diwali", emoji: "🪔", type: "festival" },
  "10-10": { label: "Bhai Dooj", emoji: "✨", type: "festival" },
  "10-24": { label: "Guru Nanak Jayanti", emoji: "ੴ", type: "festival" },
  "11-25": { label: "Christmas", emoji: "🎄", type: "festival" },
};

const FONTS = {
  sans: "system-ui, -apple-system, sans-serif",
  arial: "Arial, Helvetica, sans-serif",
  verdana: "Verdana, Geneva, sans-serif",
  tahoma: "Tahoma, Geneva, sans-serif",
  trebuchet: "'Trebuchet MS', Helvetica, sans-serif",
  helvetica: "Helvetica, Arial, sans-serif",
  futura: "Futura, 'Trebuchet MS', Arial, sans-serif",
  century: "'Century Gothic', sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  times: "'Times New Roman', Times, serif",
  garamond: "Garamond, serif",
  palatino: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
  mono: "'Fira Code', 'Courier New', monospace",
  courier: "'Courier New', Courier, monospace",
  consolas: "Consolas, monaco, monospace",
  monaco: "Monaco, consolas, monospace",
  lucida: "'Lucida Console', Monaco, monospace",
  comic: "'Comic Sans MS', cursive, sans-serif",
  impact: "Impact, Charcoal, sans-serif",
  brush: "'Brush Script MT', cursive",
};

const TYPE_COLOR = {
  meeting: "#3b82f6",
  personal: "#22c55e",
  reminder: "#f59e0b",
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const getDateKey = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const getHolKey = (d) => `${d.getMonth()}-${d.getDate()}`;
const isSameDay = (a, b) => a && b && a.toDateString() === b.toDateString();

const getAllSelectedDates = (selections) => {
  const dates = [];
  selections.forEach((s) => {
    if (!s.end) {
      if (!dates.some((d) => isSameDay(d, s.start))) dates.push(s.start);
    } else {
      const [start, end] =
        s.start < s.end ? [s.start, s.end] : [s.end, s.start];
      let curr = new Date(start);
      while (curr <= end) {
        if (!dates.some((d) => isSameDay(d, curr))) dates.push(new Date(curr));
        curr.setDate(curr.getDate() + 1);
      }
    }
  });
  return dates.sort((a, b) => a - b);
};

const extractColor = (src, fallback) =>
  new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const cv = Object.assign(document.createElement("canvas"), {
          width: 60,
          height: 60,
        });
        const ctx = cv.getContext("2d");
        ctx.drawImage(img, 0, 0, 60, 60);
        const d = ctx.getImageData(0, 0, 60, 60).data;
        let r = 0,
          g = 0,
          b = 0,
          n = 0;
        for (let i = 0; i < d.length; i += 24) {
          r += d[i];
          g += d[i + 1];
          b += d[i + 2];
          n++;
        }
        resolve(`rgb(${~~(r / n)},${~~(g / n)},${~~(b / n)})`);
      } catch {
        resolve(fallback);
      }
    };
    img.onerror = () => resolve(fallback);
    img.src = src;
  });

const exportICS = (sels, note) => {
  if (!sels.length) return alert("Select a date range first!");
  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").split("T")[0];
  const evts = sels
    .map((s, i) => {
      const e = s.end || s.start;
      return [
        "BEGIN:VEVENT",
        `DTSTART;VALUE=DATE:${fmt(s.start)}`,
        `DTEND;VALUE=DATE:${fmt(new Date(e.getTime() + 86400000))}`,
        `SUMMARY:Event ${i + 1}`,
        `DESCRIPTION:${note || "Wall Calendar"}`,
        "END:VEVENT",
      ].join("\n");
    })
    .join("\n");
  const blob = new Blob(
    [`BEGIN:VCALENDAR\nVERSION:2.0\n${evts}\nEND:VCALENDAR`],
    { type: "text/calendar" },
  );
  Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(blob),
    download: "calendar.ics",
  }).click();
};

// ─── CONFETTI ─────────────────────────────────────────────────────────────────

function Confetti({ active }) {
  const cvRef = useRef();
  useEffect(() => {
    if (!active) return;
    const cv = cvRef.current;
    const ctx = cv.getContext("2d");
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;
    let pts = Array.from({ length: 180 }, () => ({
      x: Math.random() * cv.width,
      y: -10,
      r: Math.random() * 5 + 3,
      tilt: Math.random() * 10 - 5,
      ts: Math.random() * 0.12 + 0.04,
      sp: Math.random() * 3 + 2,
      c: `hsl(${~~(Math.random() * 360)},80%,60%)`,
    }));
    let fr = 0,
      raf;
    const draw = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      pts.forEach((p) => {
        ctx.beginPath();
        ctx.fillStyle = p.c;
        ctx.ellipse(p.x, p.y, p.r, p.r * 0.5, p.tilt, 0, Math.PI * 2);
        ctx.fill();
        p.y += p.sp;
        p.tilt += p.ts;
        p.x += Math.sin(fr * 0.025) * 1.5;
      });
      pts = pts.filter((p) => p.y < cv.height);
      if (pts.length) raf = requestAnimationFrame(draw);
      fr++;
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [active]);
  if (!active) return null;
  return (
    <canvas
      ref={cvRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}

// ─── WEATHER BAR ──────────────────────────────────────────────────────────────

function WeatherBar({ isDark }) {
  const [fc, setFc] = useState([]);
  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=26.14&longitude=91.73&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Asia/Kolkata&forecast_days=7",
    )
      .then((r) => r.json())
      .then((d) => {
        if (d.daily)
          setFc(
            d.daily.time.slice(0, 7).map((t, i) => ({
              date: new Date(t),
              max: ~~d.daily.temperature_2m_max[i],
              min: ~~d.daily.temperature_2m_min[i],
              code: d.daily.weathercode[i],
            })),
          );
      })
      .catch(() => {});
  }, []);

  const icon = (c) =>
    c >= 61 ? (
      <CloudRain size={13} />
    ) : c >= 3 ? (
      <Cloud size={13} />
    ) : (
      <Sun size={13} />
    );
  const S = isDark;
  if (!fc.length) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "8px 20px",
        background: S ? "rgba(0,0,0,0.25)" : "rgba(248,250,255,0.9)",
        borderBottom: `0.5px solid ${S ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}`,
        overflowX: "auto",
      }}
    >
      <span
        style={{
          fontSize: 9,
          fontWeight: 700,
          opacity: 0.4,
          letterSpacing: 2,
          whiteSpace: "nowrap",
          color: S ? "white" : "black",
          textTransform: "uppercase",
        }}
      >
        7-DAY
      </span>
      <div style={{ display: "flex", gap: 14 }}>
        {fc.map((d, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              minWidth: 28,
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 600,
                opacity: 0.5,
                color: S ? "white" : "black",
              }}
            >
              {d.date.toLocaleDateString("en", { weekday: "short" })}
            </span>
            <span
              style={{
                color:
                  d.code >= 61
                    ? "#60a5fa"
                    : d.code >= 3
                      ? "#94a3b8"
                      : "#fbbf24",
              }}
            >
              {icon(d.code)}
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: S ? "rgba(255,255,255,.85)" : "rgba(0,0,0,.8)",
              }}
            >
              {d.max}°
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CALENDAR HERO ────────────────────────────────────────────────────────────

function Hero({
  theme,
  currentDate,
  navigate,
  jumpToDate,
  isDark,
  setIsDark,
  accent,
  setAccent,
}) {
  const [mp, setMp] = useState({ x: 50, y: 50 });

  useEffect(() => {
    extractColor(theme.image, theme.accent).then(setAccent);
  }, [theme, setAccent]);

  const onMM = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setMp({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  }, []);

  return (
    <div
      className="hero-wrap"
      style={{
        position: "relative",
        minHeight: 260,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseMove={onMM}
    >
      <div
        style={{
          position: "absolute",
          inset: "-5%",
          backgroundImage: `url(${theme.image})`,
          backgroundSize: "cover",
          backgroundPosition: `calc(50% + ${(mp.x - 50) * 0.05}%) calc(50% + ${(mp.y - 50) * 0.05}%)`,
          transition: "background-position .1s ease-out",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(160deg,rgba(0,0,0,.15) 0%,rgba(0,0,0,.65) 100%)",
        }}
      />

      <button onClick={() => navigate("prev")} style={arrowBtn("left")}>
        <ChevronLeft size={17} />
      </button>
      <button onClick={() => navigate("next")} style={arrowBtn("right")}>
        <ChevronRight size={17} />
      </button>

      <div
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          zIndex: 20,
          display: "flex",
          gap: 6,
        }}
      >
        {/* New Jump Icon with hidden input over it */}
        <div
          style={{
            position: "relative",
            ...glassBtn,
            width: 30,
            height: 30,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
          }}
        >
          <CalendarIcon size={13} />
          <input
            type="month"
            onChange={(e) => {
              const [y, m] = e.target.value.split("-");
              if (y && m) jumpToDate(+y, +m - 1);
            }}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              cursor: "pointer",
              width: "100%",
            }}
          />
        </div>

        <button
          onClick={() =>
            jumpToDate(new Date().getFullYear(), new Date().getMonth())
          }
          style={glassBtn}
        >
          Today
        </button>
        <button
          onClick={() => setIsDark((v) => !v)}
          style={{
            ...glassBtn,
            width: 30,
            height: 30,
            padding: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 999,
          }}
        >
          {isDark ? <Sun size={13} /> : <Moon size={13} />}
        </button>
      </div>

      <div style={{ position: "absolute", bottom: 20, left: 26, zIndex: 10 }}>
        <div
          style={{
            color: "rgba(255,255,255,.6)",
            fontSize: 11,
            letterSpacing: 5,
            marginBottom: 2,
            fontWeight: 600,
          }}
        >
          {currentDate.getFullYear()}
        </div>
        <div
          style={{
            color: accent,
            fontSize: 46,
            fontWeight: 900,
            letterSpacing: -2,
            lineHeight: 1,
            textShadow: "0 2px 24px rgba(0,0,0,.5)",
          }}
        >
          {theme.name}
        </div>
      </div>
    </div>
  );
}

const glassBtn = {
  background: "rgba(255,255,255,.18)",
  backdropFilter: "blur(8px)",
  border: "none",
  borderRadius: 6,
  padding: "5px 10px",
  color: "white",
  cursor: "pointer",
  fontSize: 11,
  fontWeight: 600,
};
const arrowBtn = (side) => ({
  position: "absolute",
  [side]: 14,
  top: "50%",
  transform: "translateY(-50%)",
  background: "rgba(255,255,255,.18)",
  backdropFilter: "blur(8px)",
  border: "none",
  borderRadius: 999,
  width: 34,
  height: 34,
  color: "white",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10,
  ...(side === "right" ? { right: 54 } : {}),
});

// ─── PER-DAY / BULK MODAL ─────────────────────────────────────────────────────

function DayModal({
  dates,
  data,
  bulkUpdateData,
  updateData,
  isDark,
  triggerConfetti,
  onClose,
}) {
  const isBulk = dates.length > 1;
  const primaryDate = dates[0];
  const key = getDateKey(primaryDate);

  const hol = !isBulk ? HOLIDAYS[getHolKey(primaryDate)] : null;
  const events = !isBulk ? data.events?.[key] || [] : [];
  const reminders = !isBulk ? data.reminders?.[key] || [] : [];
  const stickyNotes = !isBulk
    ? (data.stickyNotes || []).filter((n) => n.dateKey === key)
    : [];

  const [tab, setTab] = useState("events");
  const [ef, setEf] = useState({ title: "", time: "", type: "meeting" });
  const [rf, setRf] = useState({ text: "", time: "" });
  const [note, setNote] = useState(!isBulk ? data.dayNotes?.[key] || "" : "");

  const S = isDark;
  const bg = S ? "#1e293b" : "white";
  const tx = S ? "white" : "#0f172a";
  const brd = S ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)";
  const inp = {
    padding: "8px 12px",
    borderRadius: 8,
    border: `0.5px solid ${S ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.2)"}`,
    background: S ? "rgba(255,255,255,.06)" : "white",
    color: tx,
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  const saveEvent = () => {
    if (!ef.title) return;
    bulkUpdateData("events", dates, ef);
    if (ef.title.toLowerCase().match(/done|won|complete/)) triggerConfetti();
    setEf({ title: "", time: "", type: "meeting" });
    if (isBulk) onClose();
  };

  const delEvent = (id) =>
    updateData("events", {
      ...data.events,
      [key]: events.filter((e) => e.id !== id),
    });

  const saveRem = () => {
    if (!rf.text) return;
    bulkUpdateData("reminders", dates, rf);
    setRf({ text: "", time: "" });
    if (isBulk) onClose();
  };

  const delRem = (id) =>
    updateData("reminders", {
      ...data.reminders,
      [key]: reminders.filter((r) => r.id !== id),
    });

  const handleNoteChange = (val) => {
    setNote(val);
    if (!isBulk) updateData("dayNotes", { ...data.dayNotes, [key]: val });
  };

  const saveBulkNote = () => {
    if (!isBulk) return;
    bulkUpdateData("dayNotes", dates, note);
    onClose();
  };

  const delSticky = (id) =>
    updateData(
      "stickyNotes",
      (data.stickyNotes || []).filter((n) => n.id !== id),
    );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,.5)",
        backdropFilter: "blur(4px)",
        padding: 16,
      }}
    >
      <div
        style={{
          background: bg,
          color: tx,
          borderRadius: 16,
          width: "100%",
          maxWidth: 400,
          boxShadow: "0 24px 60px rgba(0,0,0,.35)",
          overflow: "hidden",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: `0.5px solid ${brd}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>
              {isBulk
                ? `Editing ${dates.length} Selected Dates`
                : primaryDate.toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
            </div>
            {hol && !isBulk && (
              <div style={{ fontSize: 10, opacity: 0.55, marginTop: 2 }}>
                {hol.emoji} {hol.label}
              </div>
            )}
            {isBulk && (
              <div style={{ fontSize: 10, opacity: 0.55, marginTop: 2 }}>
                Bulk actions apply to all highlighted days.
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: tx,
              opacity: 0.5,
            }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ display: "flex", borderBottom: `0.5px solid ${brd}` }}>
          {["events", "reminders", "notes"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                flex: 1,
                padding: "9px 0",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: tab === t ? 700 : 400,
                color:
                  tab === t
                    ? "var(--cal-accent)"
                    : S
                      ? "rgba(255,255,255,.45)"
                      : "#888",
                borderBottom:
                  tab === t
                    ? "2px solid var(--cal-accent)"
                    : "2px solid transparent",
                textTransform: "capitalize",
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: 16 }}>
          {tab === "events" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {!isBulk &&
                events.map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "9px 12px",
                      background: S ? "rgba(255,255,255,.05)" : "#f8faff",
                      borderRadius: 8,
                      borderLeft: `3px solid ${TYPE_COLOR[ev.type] || "#888"}`,
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 12 }}>
                        {ev.title}
                      </div>
                      <div style={{ fontSize: 10, opacity: 0.5, marginTop: 1 }}>
                        {ev.time || "All day"} · {ev.type}
                      </div>
                    </div>
                    <button
                      onClick={() => delEvent(ev.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        opacity: 0.35,
                        color: tx,
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              {!isBulk && !events.length && <Empty text="No events yet" />}
              <input
                style={inp}
                placeholder={
                  isBulk ? "Bulk Event Title…" : "Event or meeting title…"
                }
                value={ef.title}
                onChange={(e) => setEf({ ...ef, title: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && saveEvent()}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type="time"
                  style={{ ...inp, flex: 1 }}
                  value={ef.time}
                  onChange={(e) => setEf({ ...ef, time: e.target.value })}
                />
                <select
                  style={{ ...inp, flex: 1 }}
                  value={ef.type}
                  onChange={(e) => setEf({ ...ef, type: e.target.value })}
                >
                  <option value="meeting">Meeting</option>
                  <option value="personal">Personal</option>
                  <option value="reminder">Reminder</option>
                </select>
              </div>
              <ActionBtn onClick={saveEvent}>
                + Add {isBulk ? "to All" : "Event"}
              </ActionBtn>
            </div>
          )}

          {tab === "reminders" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {!isBulk &&
                reminders.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "9px 12px",
                      background: S ? "rgba(255,255,255,.05)" : "#fffbeb",
                      borderRadius: 8,
                      borderLeft: "3px solid #f59e0b",
                    }}
                  >
                    <Bell
                      size={12}
                      style={{ color: "#f59e0b", flexShrink: 0 }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 500 }}>
                        {r.text}
                      </div>
                      {r.time && (
                        <div style={{ fontSize: 10, opacity: 0.5 }}>
                          {r.time}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => delRem(r.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        opacity: 0.35,
                        color: tx,
                      }}
                    >
                      <X size={11} />
                    </button>
                  </div>
                ))}
              {!isBulk && !reminders.length && <Empty text="No reminders" />}
              <input
                style={inp}
                placeholder="Reminder…"
                value={rf.text}
                onChange={(e) => setRf({ ...rf, text: e.target.value })}
                onKeyDown={(e) => e.key === "Enter" && saveRem()}
              />
              <input
                type="time"
                style={inp}
                value={rf.time}
                onChange={(e) => setRf({ ...rf, time: e.target.value })}
              />
              <ActionBtn onClick={saveRem} color="#f59e0b">
                + Add {isBulk ? "to All" : "Reminder"}
              </ActionBtn>
            </div>
          )}

          {tab === "notes" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {!isBulk && stickyNotes.length > 0 && (
                <div>
                  <Label>Sticky Notes</Label>
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    {stickyNotes.map((sn) => (
                      <div
                        key={sn.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: "8px 10px",
                          background: "#fef08a",
                          color: "#713f12",
                          borderRadius: 6,
                          fontSize: 13,
                          border: "0.5px solid #fde047",
                        }}
                      >
                        <span>{sn.text}</span>
                        <button
                          onClick={() => delSticky(sn.id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#713f12",
                            opacity: 0.6,
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <Label>
                  {isBulk
                    ? "Apply Note to All Dates"
                    : "Day Notes (Auto-saves)"}
                </Label>
                <textarea
                  value={note}
                  onChange={(e) => handleNoteChange(e.target.value)}
                  placeholder={
                    isBulk
                      ? "Type note to apply to all selected days..."
                      : "Type notes here... they save automatically."
                  }
                  style={{
                    ...inp,
                    minHeight: 140,
                    resize: "vertical",
                    lineHeight: 1.6,
                    padding: "10px 12px",
                  }}
                />
                {isBulk && (
                  <div style={{ marginTop: 10 }}>
                    <ActionBtn onClick={saveBulkNote}>
                      Apply Note to All
                    </ActionBtn>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SETTINGS MODAL ───────────────────────────────────────────────────────────

function SettingsModal({ data, updateData, isDark, currentMonth, onClose }) {
  const [img, setImg] = useState(data.customImages?.[currentMonth] || "");
  const S = isDark;
  const bg = S ? "#1e293b" : "white";
  const tx = S ? "white" : "#0f172a";
  const inp = {
    padding: "8px 12px",
    borderRadius: 8,
    border: `0.5px solid ${S ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.2)"}`,
    background: S ? "rgba(255,255,255,.06)" : "white",
    color: tx,
    fontSize: 13,
    outline: "none",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,.5)",
        backdropFilter: "blur(4px)",
        padding: 16,
      }}
    >
      <div
        style={{
          background: bg,
          color: tx,
          borderRadius: 16,
          width: "100%",
          maxWidth: 360,
          boxShadow: "0 24px 60px rgba(0,0,0,.35)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 18px",
            borderBottom: `0.5px solid ${S ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 14 }}>
            Calendar Settings
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: tx,
              opacity: 0.5,
            }}
          >
            <X size={16} />
          </button>
        </div>
        <div
          style={{
            padding: 18,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div>
            <Label>Typography (20 Options)</Label>
            <select
              value={data.font || "sans"}
              onChange={(e) => updateData("font", e.target.value)}
              style={{ ...inp, fontFamily: FONTS[data.font || "sans"] }}
            >
              {Object.keys(FONTS).map((key) => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Custom hero image (this month)</Label>
            <input
              style={inp}
              placeholder="Paste any image URL…"
              value={img}
              onChange={(e) => setImg(e.target.value)}
            />
            <button
              onClick={() => {
                updateData("customImages", {
                  ...(data.customImages || {}),
                  [currentMonth]: img,
                });
                onClose();
              }}
              style={{
                marginTop: 8,
                padding: "8px",
                borderRadius: 8,
                background: "var(--cal-accent)",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontWeight: 700,
                fontSize: 12,
                width: "100%",
              }}
            >
              Apply Image
            </button>
          </div>
          <DangerBtn
            onClick={() => {
              updateData("stickyNotes", []);
              onClose();
            }}
          >
            Clear All Sticky Notes
          </DangerBtn>
          <DangerBtn
            onClick={() => {
              updateData("events", {});
              updateData("reminders", {});
              updateData("dayNotes", {});
              onClose();
            }}
          >
            Clear All Events & Notes
          </DangerBtn>
        </div>
      </div>
    </div>
  );
}

// ─── CALENDAR GRID ────────────────────────────────────────────────────────────

function Grid({
  currentDate,
  data,
  updateData,
  selections,
  setSelections,
  isDark,
  accent,
  setTargetDates,
  triggerConfetti,
}) {
  const [drag, setDrag] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const today = new Date();

  const days = useMemo(() => {
    const total = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    ).getDate();
    const first = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    ).getDay();
    const off = first === 0 ? 6 : first - 1;
    return [
      ...Array(off).fill(null),
      ...Array.from(
        { length: total },
        (_, i) =>
          new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1),
      ),
    ];
  }, [currentDate]);

  const chkStatus = (d) => {
    if (!d) return "";
    for (const r of selections) {
      if (isSameDay(d, r.start)) return "start";
      if (r.end && isSameDay(d, r.end)) return "end";
      if (r.end) {
        const [mn, mx] = r.start < r.end ? [r.start, r.end] : [r.end, r.start];
        if (d > mn && d < mx) return "in-range";
      }
    }
    return "";
  };

  const onMD = (e, d) => {
    if (!d) return;
    if (navigator.vibrate) navigator.vibrate(25);
    if (e.ctrlKey || e.metaKey)
      setSelections((s) => [...s, { start: d, end: null }]);
    else setSelections([{ start: d, end: null }]);
    setDrag(true);
  };

  const onME = (d) => {
    if (!drag || !d) return;
    setSelections((s) => {
      const n = [...s];
      n[n.length - 1] = { ...n[n.length - 1], end: d };
      return n;
    });
  };

  const onDrop = (e, d) => {
    e.preventDefault();
    if (!d) return;
    if (e.dataTransfer.getData("text/plain") === "sticky") {
      const txt = prompt("Sticky note text:");
      if (txt) {
        updateData("stickyNotes", [
          ...(data.stickyNotes || []),
          { id: Date.now() + "", text: txt, dateKey: getDateKey(d) },
        ]);
        if (txt.toLowerCase().match(/done|won|🎉/)) triggerConfetti();
      }
    }
  };

  const S = isDark;

  return (
    <div
      onMouseLeave={() => setDrag(false)}
      onMouseUp={() => setDrag(false)}
      style={{ flex: 1 }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 1,
          padding: "10px 14px 4px",
        }}
      >
        {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 9,
              fontWeight: 700,
              opacity: S ? 0.45 : 0.6,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: S ? "white" : "#0f172a",
              padding: "4px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 1,
          padding: "2px 14px 14px",
          position: "relative",
        }}
      >
        {days.map((date, i) => {
          const st = chkStatus(date);
          const isToday = date && isSameDay(date, today);
          const hol = date && HOLIDAYS[getHolKey(date)];
          const evts = date ? data.events?.[getDateKey(date)] || [] : [];
          const rems = date ? data.reminders?.[getDateKey(date)] || [] : [];
          const stks = date
            ? (data.stickyNotes || []).filter(
                (n) => n.dateKey === getDateKey(date),
              )
            : [];
          const hasNote = date && data.dayNotes?.[getDateKey(date)];
          const isWknd = date && (date.getDay() === 0 || date.getDay() === 6);
          const isEdge = st === "start" || st === "end";

          return (
            <div
              key={i}
              className="cal-cell"
              style={{
                position: "relative",
                minHeight: 68,
                borderRadius: 8,
                background: st === "in-range" ? `${accent}1a` : "transparent",
                border: date
                  ? S
                    ? "1px solid rgba(255,255,255,0.03)"
                    : "1px solid rgba(0,0,0,0.08)"
                  : "transparent",
                transition: "background .1s",
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, date)}
              onMouseEnter={() => {
                if (date && hol)
                  setTooltip({ i, label: `${hol.emoji} ${hol.label}` });
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              {date && (
                <button
                  className="cal-date-btn"
                  onMouseDown={(e) => onMD(e, date)}
                  onMouseEnter={() => onME(date)}
                  onDoubleClick={() => setTargetDates([date])}
                  style={{
                    position: "absolute",
                    top: 8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    borderRadius: 999,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: isToday ? 700 : 400,
                    background: isToday
                      ? accent
                      : isEdge
                        ? accent
                        : "transparent",
                    color:
                      isToday || isEdge
                        ? "white"
                        : isWknd
                          ? S
                            ? "rgba(255,255,255,.4)"
                            : "rgba(0,0,0,.45)"
                          : S
                            ? "rgba(255,255,255,.8)"
                            : "rgba(0,0,0,.9)",
                    boxShadow: isToday
                      ? `0 0 0 3px ${accent}35,0 2px 10px ${accent}55`
                      : "none",
                    animation: isToday ? "calPulse 2s infinite" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.1s",
                  }}
                >
                  {date.getDate()}
                </button>
              )}

              {hol && date && (
                <div
                  title={hol.label}
                  style={{
                    position: "absolute",
                    bottom: evts.length || rems.length || stks.length ? 18 : 4,
                    left: "50%",
                    transform: "translateX(-50%)",
                    fontSize: 10,
                    lineHeight: 1,
                    cursor: "default",
                    animation:
                      hol.type === "festival"
                        ? "holBounce .6s ease-in-out infinite alternate"
                        : hol.type === "national"
                          ? "holPulse 1.5s ease-in-out infinite"
                          : "none",
                  }}
                >
                  {hol.emoji}
                </div>
              )}

              {tooltip?.i === i && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(0,0,0,.85)",
                    color: "white",
                    fontSize: 10,
                    padding: "4px 8px",
                    borderRadius: 6,
                    whiteSpace: "nowrap",
                    zIndex: 100,
                    pointerEvents: "none",
                    marginBottom: 4,
                  }}
                >
                  {tooltip.label}
                </div>
              )}

              {date &&
                (evts.length || rems.length || stks.length || hasNote) && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: hol ? 18 : 5,
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: 3,
                      flexWrap: "wrap",
                      justifyContent: "center",
                      maxWidth: 32,
                    }}
                  >
                    {evts.slice(0, 2).map((ev, j) => (
                      <div
                        key={j}
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: 999,
                          background: TYPE_COLOR[ev.type] || "#888",
                        }}
                      />
                    ))}
                    {rems.length > 0 && (
                      <div
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: 999,
                          background: "#f59e0b",
                        }}
                      />
                    )}
                    {stks.length > 0 && (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 1,
                          background: "#fde047",
                          border: "0.5px solid #ca8a04",
                          transform: "rotate(-5deg)",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                        }}
                      />
                    )}
                    {hasNote && (
                      <div
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: 999,
                          background: S
                            ? "rgba(255,255,255,.5)"
                            : "rgba(0,0,0,.35)",
                        }}
                      />
                    )}
                  </div>
                )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SMALL SHARED UI ──────────────────────────────────────────────────────────

const Empty = ({ text }) => (
  <div
    style={{
      textAlign: "center",
      opacity: 0.35,
      fontSize: 12,
      padding: "16px 0",
    }}
  >
    {text}
  </div>
);
const Label = ({ children }) => (
  <div
    style={{
      fontSize: 10,
      fontWeight: 700,
      opacity: 0.45,
      letterSpacing: 1,
      marginBottom: 6,
      textTransform: "uppercase",
    }}
  >
    {children}
  </div>
);
const ActionBtn = ({ onClick, children, color }) => (
  <button
    onClick={onClick}
    style={{
      padding: "9px",
      borderRadius: 8,
      background: color || "var(--cal-accent)",
      color: "white",
      border: "none",
      cursor: "pointer",
      fontWeight: 700,
      fontSize: 12,
      width: "100%",
    }}
  >
    {children}
  </button>
);
const DangerBtn = ({ onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      padding: "8px",
      borderRadius: 8,
      border: "1px solid #ef4444",
      color: "#ef4444",
      background: "none",
      cursor: "pointer",
      fontSize: 12,
      width: "100%",
    }}
  >
    {children}
  </button>
);

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────

const GlobalStyles = ({ accent }) => (
  <style>{`
    :root { --cal-accent: ${accent}; }
    @keyframes calPulse {
      0%,100% { box-shadow: 0 0 0 3px ${accent}35, 0 2px 10px ${accent}55; }
      50%      { box-shadow: 0 0 0 6px ${accent}18, 0 2px 10px ${accent}55; }
    }
    @keyframes holBounce {
      from { transform: translateX(-50%) translateY(0); }
      to   { transform: translateX(-50%) translateY(-3px); }
    }
    @keyframes holPulse {
      0%,100% { opacity: 1; }
      50%     { opacity: .4; }
    }
    
    /* Layout & Responsiveness */
    .cal-main-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-width: 1000px;
      margin: 0 auto;
    }
    .cal-left-col { width: 100%; }
    .cal-right-col { width: 100%; display: flex; flex-direction: column; }
    
    .cal-date-btn {
      width: 28px;
      height: 28px;
      font-size: 11px;
    }
    
    @media (min-width: 768px) {
      .cal-main-container { flex-direction: row; align-items: stretch; }
      .cal-left-col { width: 40%; display: flex; flex-direction: column; }
      .cal-right-col { width: 60%; }
      .hero-wrap { height: 100% !important; border-radius: 20px 0 0 20px; }
      .cal-right-col { border-radius: 0 20px 20px 0; }
      
      .cal-date-btn {
        width: 36px;
        height: 36px;
        font-size: 14px;
      }
      .cal-cell {
        min-height: 84px !important;
      }
    }
    @media print { .no-print { display: none !important; } body { background: white !important; } }
    * { box-sizing: border-box; }
  `}</style>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function WallCalendar() {
  const [cur, setCur] = useState(new Date());

  const [data, setData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wcal4")) || {};
    } catch {
      return {};
    }
  });

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("wcal4_theme") === "dark";
  });

  const [sels, setSels] = useState([]);
  const [targetDates, setTargetDates] = useState(null); // Replaced activeDate -> takes an array of Dates
  const [showSettings, setSS] = useState(false);
  const [confetti, setCf] = useState(false);
  const [accent, setAccent] = useState("#3b82f6");
  const [mNote, setMNote] = useState("");

  const month = cur.getMonth();
  const theme = useMemo(() => {
    const base = THEMES[month];
    const ci = data.customImages?.[month];
    return ci ? { ...base, image: ci } : base;
  }, [month, data.customImages]);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem("wcal4", JSON.stringify(data));
    } catch {}
  }, [data]);
  useEffect(() => {
    localStorage.setItem("wcal4_theme", isDark ? "dark" : "light");
  }, [isDark]);
  useEffect(() => {
    const k = `${cur.getFullYear()}-${month}`;
    setMNote(data.monthlyNotes?.[k] || "");
  }, [cur, data.monthlyNotes, month]);

  const updateData = useCallback(
    (k, v) =>
      setData((p) => ({ ...p, [k]: typeof v === "function" ? v(p[k]) : v })),
    [],
  );

  const bulkUpdateData = useCallback((type, dateObjArray, newItem) => {
    setData((prev) => {
      const nextTypeData = { ...(prev[type] || {}) };
      dateObjArray.forEach((d) => {
        const k = getDateKey(d);
        if (type === "dayNotes") {
          nextTypeData[k] = newItem;
        } else {
          nextTypeData[k] = [
            ...(nextTypeData[k] || []),
            { ...newItem, id: Date.now() + Math.random() },
          ];
        }
      });
      return { ...prev, [type]: nextTypeData };
    });
  }, []);

  const triggerConfetti = () => {
    setCf(true);
    setTimeout(() => setCf(false), 5000);
  };

  const navigate = useCallback((dir) => {
    if (navigator.vibrate) navigator.vibrate(35);
    setCur(
      (p) =>
        new Date(p.getFullYear(), p.getMonth() + (dir === "next" ? 1 : -1), 1),
    );
  }, []);

  const jumpToDate = (y, m) => setCur(new Date(y, m, 1));

  const handleMNoteChange = (e) => {
    setMNote(e.target.value);
    updateData("monthlyNotes", {
      ...data.monthlyNotes,
      [`${cur.getFullYear()}-${month}`]: e.target.value,
    });
  };

  const S = isDark;
  const font = FONTS[data.font || "sans"];
  const allSelectedDates = getAllSelectedDates(sels);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: S
          ? "radial-gradient(circle at top left, #1e293b 0%, #020617 100%)"
          : "radial-gradient(circle at top left, #f8fafc 0%, #cbd5e1 100%)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "20px 12px 40px",
        fontFamily: font,
      }}
    >
      <GlobalStyles accent={accent} />
      <Confetti active={confetti} />

      <div
        className="cal-main-container"
        style={{
          background: S ? "#1e293b" : "white",
          borderRadius: 20,
          boxShadow: S
            ? "0 24px 80px rgba(0,0,0,.6)"
            : "0 24px 80px rgba(0,0,0,.14)",
        }}
      >
        {/* LEFT COLUMN (HERO) */}
        <div className="cal-left-col">
          <Hero
            theme={theme}
            currentDate={cur}
            navigate={navigate}
            jumpToDate={jumpToDate}
            isDark={isDark}
            setIsDark={setIsDark}
            accent={accent}
            setAccent={setAccent}
          />
        </div>

        {/* RIGHT COLUMN (GRID & TOOLS) */}
        <div
          className="cal-right-col"
          style={{ background: S ? "#1e293b" : "white" }}
        >
          <WeatherBar isDark={isDark} />

          <div
            className="no-print"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 18px",
              borderBottom: `0.5px solid ${S ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.15)"}`,
              minHeight: 48,
            }}
          >
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("text/plain", "sticky")
                }
                style={{
                  padding: "5px 12px",
                  background: "#fef08a",
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#713f12",
                  cursor: "grab",
                  border: "0.5px solid #fde047",
                  userSelect: "none",
                }}
              >
                📌 Drag Sticky Note
              </div>

              {/* Bulk Action Button */}
              {allSelectedDates.length > 0 && (
                <button
                  onClick={() => setTargetDates(allSelectedDates)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 8,
                    background: accent,
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  <Edit3 size={12} /> Edit Selected ({allSelectedDates.length})
                </button>
              )}
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => exportICS(sels, mNote)}
                style={{
                  padding: "5px 10px",
                  borderRadius: 8,
                  border: `0.5px solid ${S ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.2)"}`,
                  background: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  color: S ? "rgba(255,255,255,.65)" : "rgba(0,0,0,.7)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontFamily: font,
                }}
              >
                <Download size={12} /> Export
              </button>
              <button
                onClick={() => setSS(true)}
                style={{
                  padding: "5px 10px",
                  borderRadius: 8,
                  border: `0.5px solid ${S ? "rgba(255,255,255,.18)" : "rgba(0,0,0,.2)"}`,
                  background: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  color: S ? "rgba(255,255,255,.65)" : "rgba(0,0,0,.7)",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontFamily: font,
                }}
              >
                <Settings size={12} /> Settings
              </button>
            </div>
          </div>

          <Grid
            currentDate={cur}
            data={data}
            updateData={updateData}
            selections={sels}
            setSelections={setSels}
            isDark={isDark}
            accent={accent}
            setTargetDates={setTargetDates}
            triggerConfetti={triggerConfetti}
          />

          <div
            style={{
              padding: "14px 18px 20px",
              borderTop: `0.5px solid ${S ? "rgba(255,255,255,.07)" : "rgba(0,0,0,.1)"}`,
            }}
          >
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                opacity: S ? 0.35 : 0.6,
                letterSpacing: 2,
                textTransform: "uppercase",
                marginBottom: 8,
                color: S ? "white" : "#0f172a",
              }}
            >
              Monthly Notes — {theme.name}
            </div>
            <textarea
              value={mNote}
              onChange={handleMNoteChange}
              placeholder={`What's happening in ${theme.name.charAt(0) + theme.name.slice(1).toLowerCase()}?`}
              style={{
                width: "100%",
                minHeight: 72,
                padding: "10px 12px",
                borderRadius: 8,
                border: `0.5px solid ${S ? "rgba(255,255,255,.12)" : "rgba(0,0,0,.15)"}`,
                background: S ? "rgba(255,255,255,.04)" : "#f8fafc",
                color: S ? "rgba(255,255,255,.85)" : "#0f172a",
                fontSize: 13,
                resize: "vertical",
                outline: "none",
                lineHeight: 1.65,
                fontFamily: font,
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="no-print"
        style={{
          position: "absolute",
          bottom: 10,
          textAlign: "center",
          width: "100%",
          fontSize: 10,
          opacity: S ? 0.4 : 0.6,
          color: S ? "white" : "#0f172a",
          pointerEvents: "none",
        }}
      >
        Double-click date · Drag for multi-select · Drag sticky note onto any
        date
      </div>

      {targetDates && (
        <DayModal
          dates={targetDates}
          data={data}
          updateData={updateData}
          bulkUpdateData={bulkUpdateData}
          isDark={isDark}
          triggerConfetti={triggerConfetti}
          onClose={() => setTargetDates(null)}
        />
      )}
      {showSettings && (
        <SettingsModal
          data={data}
          updateData={updateData}
          isDark={isDark}
          currentMonth={month}
          onClose={() => setSS(false)}
        />
      )}
    </div>
  );
}
