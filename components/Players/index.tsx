"use client";
import React, { useEffect, useState } from "react";
import SingleFeature from "./Player";
import SectionHeader from "../Common/SectionHeader";
import playersData from "./playersData";
import { supabase } from "@/utils/supbase/client";


type PlayerStat = {
  matchesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goals: number;
  assists: number;
};

const Players = () => {
  const [players, setPlayers] = useState<typeof playersData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayersStats = async () => {
      setLoading(true);
  
      const today = new Date().toISOString().split("T")[0];
  
      // Attendance lekérdezés (csak múltbeli meccsek)
      const { data: attendance, error: attError } = await supabase
        .from("match_attendance")
        .select(`
          player_id,
          attending_match,
          matches!inner(id, wld, date)
        `)
        .eq("attending_match", true)
        .lt("matches.date", today);
  
      if (attError) {
        console.error(attError);
        setLoading(false);
        return;
      }
  
      // Goals lekérdezés
      const { data: goals, error: goalsError } = await supabase
        .from("goals")
        .select("scorer_id, assist_id");
  
      if (goalsError) {
        console.error(goalsError);
        setLoading(false);
        return;
      }
  
      // Player stat map inicializálása minden playerhez
      const playerStatsMap: Record<number, PlayerStat> = {};
      playersData.forEach((player) => {
        playerStatsMap[player.id] = {
          matchesPlayed: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goals: 0,
          assists: 0,
        };
      });
  
      // Attendance feldolgozása
      attendance?.forEach((row) => {
        const playerId = row.player_id;
        if (!row.attending_match || !row.matches) return;
  
        playerStatsMap[playerId].matchesPlayed += 1;
  
        const match = row.matches as unknown as {
          id: number;
          wld: "win" | "draw" | "lose";
          date: string;
        };
  
        const wld = match.wld;
        if (wld === "win") playerStatsMap[playerId].wins += 1;
        else if (wld === "lose") playerStatsMap[playerId].losses += 1;
        else if (wld === "draw") playerStatsMap[playerId].draws += 1;
      });
  
      // Goals feldolgozása
      goals?.forEach((goal) => {
        if (goal.scorer_id && playerStatsMap[goal.scorer_id]) {
          playerStatsMap[goal.scorer_id].goals += 1;
        }
        if (goal.assist_id && playerStatsMap[goal.assist_id]) {
          playerStatsMap[goal.assist_id].assists += 1;
        }
      });
  
      // Összekapcsolás playersData-val
      const playersWithStats = playersData.map((player) => ({
        ...player,
        stats: [
          { label: "Mérkőzés", value: playerStatsMap[player.id]?.matchesPlayed || 0 },
          { label: "Győzelem", value: playerStatsMap[player.id]?.wins || 0 },
          { label: "Döntetlen", value: playerStatsMap[player.id]?.draws || 0 },
          { label: "Vereség", value: playerStatsMap[player.id]?.losses || 0 },
          { label: "Gól", value: playerStatsMap[player.id]?.goals || 0 },
          { label: "Gólpassz", value: playerStatsMap[player.id]?.assists || 0 },
        ],
      }));
  
      setPlayers(playersWithStats);
      setLoading(false);
    };
  
    fetchPlayersStats();
  }, []);
  

  if (loading) return <p className="text-center text-white">Betöltés...</p>;

  return (
    <section id="players" className="py-20 lg:py-25 xl:py-30">
      <div className="max-w-c-1315 mx-auto px-4 md:px-8 xl:px-0"> 
        <SectionHeader
          headerInfo={{
            title: "TótÉk kerettagoke",
            subtitle: "",
            description: `Az alábbi szekcióban a csapattagok és a hozzájuk tartozó statisztikákat lehet megtekinteni.`,
          }}
        />

        <div className="mt-12.5 grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:mt-15 lg:grid-cols-3 xl:mt-20 xl:gap-12.5">
          {players?.map((player, key) => (
            <SingleFeature player={player} delay={key} key={key} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Players;