"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import Standings1 from "./Standing01";
import StatsPanelAdvanced from "./Statistic";
import { supabase } from "@/utils/supbase/client";
import SectionHeader from "../Common/SectionHeader";
import PlayerStatsTable from "./PlayerStatsTable";
import GoalsStatsPanel from "./GoalsStatsPanel";
import LeagueSelector from "../LeagueSelector/LeagueSelector";

export type TeamType = {
  rank: number;
  team: string;
  played: number; // M
  won: number; // GY
  draw: number; // D
  lost: number; // V
  goalsfor: number; // LG
  goalsagainst: number; // KG
  goaldiff: number; // GK
  points: number; // P
};

export type PlayerStat = {
  id: number;
  name: string;
  goals: number;
  assists: number;
  total: number;
  avgGoals: string;
  avgAssist: string;
  minutesPerGoal: string;
  matchesPlayed: number;
};

export function Standing() {
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null | 'all'>(null);
  const [standings, setStandings] = useState<TeamType[]>([]);
  const [stats, setStats] = useState<PlayerStat[]>([]);
  const [loading, setLoading] = useState(true);

  // --- Tabella lekérése a kiválasztott league alapján ---
  useEffect(() => {
    if (!selectedLeagueId) return;

    const fetchStandings = async () => {
      const { data, error } = await supabase
        .from("league_table")
        .select("*")
        .eq("league_id", selectedLeagueId)
        .order("rank", { ascending: true });

      if (error) console.error(error);
      else setStandings(data as TeamType[]);
    };

    fetchStandings();
  }, [selectedLeagueId]);

  // --- Statisztikák lekérése ---
  useEffect(() => {
    if (!selectedLeagueId) return;

    const fetchStats = async () => {
      setLoading(true);
      try {
        const { data: players } = await supabase
          .from("players")
          .select("id, name");

        const { data: matches } = await supabase
          .from("matches")
          .select("id")
          .eq("league_id", selectedLeagueId);

        const matchIds = matches?.map((m) => m.id) || [];

        const { data: goals } = await supabase
          .from("goals")
          .select("scorer_id, assist_id, match_id")
          .in("match_id", matchIds);

        const { data: attendance } = await supabase
          .from("match_attendance")
          .select("player_id, match_id, attending_match, matches!inner(date)")
          .eq("attending_match", true)
          .in("match_id", matchIds);

        if (!players || !goals || !attendance) return;

        const stats = players.map((player) => {
          const goalsScored = goals.filter((g) => g.scorer_id === player.id).length;
          const assistsGiven = goals.filter((g) => g.assist_id === player.id).length;
          const total = goalsScored + assistsGiven;
          const matchesPlayed = attendance.filter((a) => a.player_id === player.id).length;

          return {
            id: player.id,
            name: player.name,
            goals: goalsScored,
            assists: assistsGiven,
            total,
            avgGoals: matchesPlayed > 0 ? (goalsScored / matchesPlayed).toFixed(2) : "—",
            avgAssist: matchesPlayed > 0 ? (assistsGiven / matchesPlayed).toFixed(2) : "—",
            minutesPerGoal:
              goalsScored > 0 && matchesPlayed > 0
                ? ((matchesPlayed * 40) / goalsScored).toFixed(0)
                : "—",
            matchesPlayed,
          };
        });

        setStats(stats);
      } catch (err) {
        console.error("Hiba a statisztikák lekérésekor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [selectedLeagueId]);

  return (
    <>
      <section className="overflow-hidden pt-20 pb-10 lg:pb-25 xl:pb-30">
        <SectionHeader
          headerInfo={{
            title: "Tabellák",
            subtitle: "",
            description:
              "Az alábbi szekcióban a csapattal kapcsolatos tabellák megtekinthetőek.",
          }}
        />

        <div className="max-w-c-1235 mx-auto px-4 pt-10 md:px-8 xl:px-0">
          {/* --- League selector --- */}
          <LeagueSelector
            selectedLeagueId={selectedLeagueId}
            onLeagueChange={setSelectedLeagueId}
          />

          {/* --- Standings + Stats --- */}
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-16">
            <Standings1 standings={standings} />
            <StatsPanelAdvanced standings={standings} />
          </div>
        </div>
      </section>

      <section className="overflow-hidden pb-10 lg:pb-25 xl:pb-30">
        <div className="max-w-c-1235 mx-auto overflow-hidden px-4 md:px-8 2xl:px-0">
          <div className="flex flex-col-reverse lg:flex-col items-center gap-4 lg:flex-row lg:gap-16">
            <GoalsStatsPanel stats={stats} />
            <PlayerStatsTable loading={loading} stats={stats} />
          </div>
        </div>
      </section>
    </>
  );
}

export default Standing;