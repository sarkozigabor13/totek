export const getWeatherDescription = (code: number): string => {
    // Open-Meteo weather codes alapján
    // Forrás: https://open-meteo.com/en/docs
    switch (code) {
      case 0:
        return "☀️ Tiszta ég";
      case 1:
      case 2:
      case 3:
        return "🌤️ Részben felhős";
      case 45:
      case 48:
        return "🌫️ Köd";
      case 51:
      case 53:
      case 55:
        return "🌦️ Enyhe esőcseppek";
      case 56:
      case 57:
        return "🌨️ Fagyott eső";
      case 61:
      case 63:
      case 65:
        return "🌧️ Eső";
      case 66:
      case 67:
        return "❄️ Fagyott eső / havas eső";
      case 71:
      case 73:
      case 75:
        return "🌨️ Hó";
      case 77:
        return "🌨️ Hópehely";
      case 80:
      case 81:
      case 82:
        return "🌧️ Zápor";
      case 85:
      case 86:
        return "❄️ Hó zápor";
      case 95:
        return "⛈️ Vihar";
      case 96:
      case 99:
        return "⛈️ Vihar, villámlás";
      default:
        return "🌈 Nincs adat";
    }
  };