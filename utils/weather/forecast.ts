const latitude = 47.474422;
const longitude = 19.057098;

export const getWeatherForMatch = async (
  isoDate: string,
) => {
  const matchDate = new Date(isoDate);

  // Open-Meteo API: óránkénti előrejelzés
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode&timezone=Europe/Budapest&start=${matchDate.toISOString()}&end=${matchDate.toISOString()}`,
  );

  const data = await response.json();

  if (!data.hourly) return null;

  // Kiválasztjuk a match órájához tartozó indexet
  const matchHour = matchDate.getHours();
  const timeIndex = data.hourly.time.findIndex((t: string) =>
    t.startsWith(matchDate.toISOString().slice(0, 13)),
  );

  if (timeIndex === -1) return null;

  const temperature = data.hourly.temperature_2m[timeIndex];
  const weatherCode = data.hourly.weathercode[timeIndex];

  return { temperature, weatherCode };
};
