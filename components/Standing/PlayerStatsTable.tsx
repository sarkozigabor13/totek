"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PlayerStat } from ".";

type SortConfig = {
  key: keyof PlayerStat;
  direction: "asc" | "desc";
};

export default function PlayerStatsTable({
  stats,
  loading,
}: {
  stats: PlayerStat[];
  loading: any;
}) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "goals",
    direction: "desc",
  });

  const requestSort = (key: keyof PlayerStat) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof PlayerStat) => {
    if (sortConfig.key === key)
      return sortConfig.direction === "asc" ? "↑" : "↓";
    return "";
  };

  const sortedStats = [...stats].sort((a, b) => {
    const key = sortConfig.key;
    const dir = sortConfig.direction === "asc" ? 1 : -1;
  
    let aValue = a[key];
    let bValue = b[key];
  
    // minutesPerGoal esetén számként kezeljük
    if (key === "minutesPerGoal") {
      aValue = Number(String(aValue).replace(/\D/g, ""));
      bValue = Number(String(bValue).replace(/\D/g, ""));
    }
  
    if (typeof aValue === "number" && typeof bValue === "number") {
      return (aValue - bValue) * dir;
    } else {
      return String(aValue).localeCompare(String(bValue)) * dir;
    }
  });
  

  if (loading) return <p className="text-center text-white">Betöltés...</p>;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
      }}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.5, delay: 0.1 }}
      viewport={{ once: true }}
      className="animate_top mx-auto w-full max-w-4xl lg:w-2/3"
    >
      <div className="rounded-3xl bg-black lg:px-6 py-5">
        <h4 className="mb-4 text-lg font-bold text-white">
          Gól és gólpassz táblázat
        </h4>
        <div className="overflow-x-auto rounded-3xl shadow-2xl">
          <table className="min-w-full border-collapse text-sm text-white">
            <thead className="bg-blacksection text-xs text-gray-400 uppercase">
              <tr>
                {(
                  [
                    ["name", "Játékos"],
                    ["matchesPlayed", "Lejátszott meccsek"],
                    ["goals", "Gól"],
                    ["assists", "Gólpassz"],
                    ["total", "Összesen"],
                    ["avgGoals", "Gól / meccs"],
                    ["avgAssist", "Gólpassz / meccs"],
                    ["minutesPerGoal", "Perc / gól"],
                  ] as [keyof PlayerStat, string][]
                ).map(([key, label]) => (
                  <th
                    key={key}
                    className="cursor-pointer px-3 py-2 text-center select-none"
                    onClick={() => requestSort(key)}
                  >
                    <div
                      className={`flex items-center ${label === "Játékos" ? "justify-left" : "justify-center"} gap-1`}
                    >
                      {label} <span>{getSortIndicator(key)}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedStats.map((player, i) => (
                <tr
                  key={player.id}
                  className={`${
                    i !== sortedStats.length - 1
                      ? "border-b border-gray-500"
                      : ""
                  } hover:bg-blacksection`}
                >
                  <td className="px-3 py-2 text-start">{player.name}</td>
                  <td className="px-3 py-2 text-center">
                    {player.matchesPlayed}
                  </td>
                  <td className="px-3 py-2 text-center">{player.goals}</td>
                  <td className="px-3 py-2 text-center">{player.assists}</td>
                  <td className="px-3 py-2 text-center">{player.total}</td>
                  <td className="px-3 py-2 text-center">{player.avgGoals}</td>
                  <td className="px-3 py-2 text-center">{player.avgAssist}</td>
                  <td className="px-3 py-2 text-center">
                    {player.minutesPerGoal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
