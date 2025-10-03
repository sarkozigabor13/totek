"use client";
import { getWeatherForMatch } from "@/utils/weather/forecast";
import { useEffect, useState } from "react";

type Match = {
  id: string;
  date: string;
  location: string;
  opponent: string;
};

const MatchWeather = ({ match }: { match: Match }) => {
  const [weather, setWeather] = useState<{
    temperature: number;
    weatherCode: number;
  } | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      const w = await getWeatherForMatch(match.date);
      setWeather(w);
    };
    fetchWeather();
  }, [match.date]);

  if (!weather) return <p>Időjárás lekérése...</p>;

  return (
    <div>
      <p>Hőmérséklet: {weather.temperature}°C</p>
      <p>Időjárás kód: {weather.weatherCode}</p>
    </div>
  );
};

export {MatchWeather}