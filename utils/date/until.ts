export const timeUntilMatch = (isoString: string) => {
    const now = new Date();
    const matchDate = new Date(isoString);
  
    const diffMs = matchDate.getTime() - now.getTime();
    if (diffMs <= 0) return ""; // múlt vagy most kezdődik
  
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays >= 1) return `${diffDays} nap`;
  
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours >= 1) return `${diffHours} óra`;
  
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    if (diffMinutes >= 1) return `${diffMinutes} perc`;
  
    return null; // már nagyon közel van vagy már elkezdődött
  };
  