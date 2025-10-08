"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TeamType } from ".";

type SortConfig = {
  key: keyof TeamType;
  direction: "asc" | "desc";
};

export default function Standings1({standings}: {standings:any}) {

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "rank",
    direction: "asc",
  });

  const sortedStandings = [...standings].sort((a, b) => {
    const key = sortConfig.key;
    const dir = sortConfig.direction === "asc" ? 1 : -1;

    // Számok szerint vagy stringként
    if (typeof a[key] === "number" && typeof b[key] === "number") {
      return ((a[key] as number) - (b[key] as number)) * dir;
    } else {
      return String(a[key]).localeCompare(String(b[key])) * dir;
    }
  });

  const requestSort = (key: keyof TeamType) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIndicator = (key: keyof TeamType) => {
    if (sortConfig.key === key)
      return sortConfig.direction === "asc" ? "↑" : "↓";
    return "";
  };

  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          x: -20,
        },

        visible: {
          opacity: 1,
          x: 0,
        },
      }}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.5, delay: 0.1 }}
      viewport={{ once: true }}
      className="animate_left relative mx-auto w-full lg:w-2/3"
    >
      <div className="mx-auto w-full max-w-4xl">
        <div className="rounded-3xl bg-black px-6 py-5">
          <div className="mb-4 px-2">
            <h4 className="text-custom-gray-900 text-lg font-bold dark:text-white">
              Kedd D liga - Lágymányosi Bajnokság
            </h4>
          </div>
          <div className="overflow-x-auto rounded-3xl shadow-2xl">
            <table className="text-md min-w-full table-auto border-collapse text-white">
              <thead className="bg-blacksection text-sm text-gray-400 uppercase">
                <tr>
                  {(
                    [
                      ["rank", "Helyezés"],
                      ["team", "Csapat"],
                      ["played", "M"],
                      ["won", "GY"],
                      ["draw", "D"],
                      ["lost", "V"],
                      ["goalsfor", "LG"],
                      ["goalsagainst", "KG"],
                      ["goaldiff", "GK"],
                      ["points", "P"],
                    ] as [keyof TeamType, string][]
                  ).map(([key, label]) => (
                    <th
                      key={key}
                      className="cursor-pointer px-3 py-2 text-center select-none"
                      onClick={() => requestSort(key)}
                    >
                      <div
                        className={`flex items-center ${label === "Helyezés" || label === "Csapat" ? "justify-left" : "justify-center"} gap-1`}
                      >
                        {label} <span>{getSortIndicator(key)}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedStandings.map((team, i) => {
                  const isMyTeam = team.team.toLowerCase() === "tóték";
                  return (
                    <tr
                      key={team.rank}
                      className={`${i !== sortedStandings.length - 1 ? "border-b" : ""} border-gray-500 ${
                        isMyTeam
                          ? "border-none bg-yellow-600 font-bold text-black shadow-2xl"
                          : ""
                      }`}
                    >
                      <td className="px-3 py-2 text-start">{team.rank}.</td>
                      <td className="px-3 py-2 text-start">{team.team}</td>
                      <td className="px-3 py-2 text-center">{team.played}</td>
                      <td className="px-3 py-2 text-center">{team.won}</td>
                      <td className="px-3 py-2 text-center">{team.draw}</td>
                      <td className="px-3 py-2 text-center">{team.lost}</td>
                      <td className="px-3 py-2 text-center">{team.goalsfor}</td>
                      <td className="px-3 py-2 text-center">
                        {team.goalsagainst}
                      </td>
                      <td className="px-3 py-2 text-center">{team.goaldiff}</td>
                      <td className="px-3 py-2 text-center">{team.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
