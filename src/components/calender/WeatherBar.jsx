import React, { useEffect, useState } from "react";
import { CloudRain, Sun, Cloud } from "lucide-react";

export default function WeatherBar({ isDarkMode }) {
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    // Open-Meteo free API (No key required). Defaulting to a central latitude/longitude.
    // Tip: Use the browser geolocation API here to make it hyper-local.
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=51.50&longitude=-0.12&daily=weathercode,temperature_2m_max&timezone=auto",
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.daily) {
          const days = data.daily.time.slice(0, 7).map((time, i) => ({
            date: new Date(time),
            temp: data.daily.temperature_2m_max[i],
            code: data.daily.weathercode[i],
          }));
          setForecast(days);
        }
      })
      .catch(console.error);
  }, []);

  const getWeatherIcon = (code) => {
    if (code > 50) return <CloudRain size={16} className="text-blue-400" />;
    if (code > 2) return <Cloud size={16} className="text-gray-400" />;
    return <Sun size={16} className="text-yellow-400" />;
  };

  if (!forecast.length) return null;

  return (
    <div
      className={`flex justify-between items-center px-6 py-3 border-b text-xs font-medium no-print ${isDarkMode ? "border-gray-800 bg-gray-900/50 text-gray-300" : "border-gray-100 bg-gray-50 text-gray-600"}`}
    >
      <span className="font-bold tracking-widest uppercase opacity-50">
        7-Day
      </span>
      <div className="flex gap-4">
        {forecast.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span>
              {day.date.toLocaleDateString("en-US", { weekday: "short" })}
            </span>
            {getWeatherIcon(day.code)}
            <span>{Math.round(day.temp)}°</span>
          </div>
        ))}
      </div>
    </div>
  );
}
