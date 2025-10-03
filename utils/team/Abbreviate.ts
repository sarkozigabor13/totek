export const abbreviateTeamName = (name: string): string => {
  if (!name) return "";
  return name.slice(0, 3).toUpperCase();
};
