export const getGoogleCalendarUrl = (match) => {
  const base = "https://calendar.google.com/calendar/render?action=TEMPLATE";

  // Kezdő dátum (match.date-ből indulva)
  const startDate = new Date(match.date);
  // Vége dátum (mondjuk 2 órával később)
  const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

  const format = (date) => date.toISOString().replace(/-|:|\.\d+/g, "");

  const details = {
    text: `⚽️ TótÉk vs ${match.opponent} ⚽️`,
    dates: `${format(startDate)}/${format(endDate)}`,
    details: `Helyszín: ${match.location}. Hajrá TótÉk!`,
    location: match.location,
  };

  const query = Object.keys(details)
    .map((key) => `${key}=${encodeURIComponent(details[key])}`)
    .join("&");

  return `${base}&${query}`;
};
