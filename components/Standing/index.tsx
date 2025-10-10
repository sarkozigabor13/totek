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

const Standing = () => {
  const [standings, setStandings] = useState<TeamType[]>([]);
  const [stats, setStats] = useState<PlayerStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStandings = async () => {
      const { data, error } = await supabase
        .from("league_table")
        .select("*")
        .order("rank", { ascending: true });

      if (error) console.error(error);
      else setStandings(data as TeamType[]);
    };

    fetchStandings();
  }, []);
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: players, error: playersError } = await supabase
          .from("players")
          .select("id, name");

        const { data: goals, error: goalsError } = await supabase
          .from("goals")
          .select("scorer_id, assist_id, match_id");

        // csak a múltban lejátszott meccseket kérjük le
        const today = new Date().toISOString().split("T")[0];

        const { data: attendance, error: attendanceError } = await supabase
          .from("match_attendance")
          .select("player_id, match_id, attending_match, matches!inner(date)")
          .eq("attending_match", true)
          .lt("matches.date", today); // csak múltbeli meccsek

        if (playersError || goalsError || attendanceError) {
          console.error(playersError || goalsError || attendanceError);
          return;
        }

        const stats = players!.map((player) => {
          const goalsScored = goals!.filter(
            (g) => g.scorer_id === player.id,
          ).length;

          const assistsGiven = goals!.filter(
            (g) => g.assist_id === player.id,
          ).length;

          const total = goalsScored + assistsGiven;

          // hány meccsen vett részt (csak múltbeli)
          const matchesPlayed = attendance!.filter(
            (a) => a.player_id === player.id,
          ).length;

          const avgGoals =
            matchesPlayed > 0 ? (goalsScored / matchesPlayed).toFixed(2) : "—";

          const avgAssist =
            matchesPlayed > 0 ? (assistsGiven / matchesPlayed).toFixed(2) : "—";

          const minutesPerGoal =
            goalsScored > 0 && matchesPlayed > 0
              ? ((matchesPlayed * 40) / goalsScored).toFixed(0)
              : "—";

          return {
            id: player.id,
            name: player.name,
            goals: goalsScored,
            assists: assistsGiven,
            total,
            avgGoals,
            avgAssist,
            minutesPerGoal,
            matchesPlayed: matchesPlayed,
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
  }, []);
  return (
    <>
      {/* <!-- ===== About Start ===== --> */}
      <section
        id="standing"
        className="overflow-hidden pt-20 pb-10 lg:pb-25 xl:pb-30"
      >
        <SectionHeader
          headerInfo={{
            title: "Tabellák",
            subtitle: "",
            description: `Az alábbi szekcióban a csapattal kapcsolatos tabellák megtekinthetőek.`,
          }}
        />
        <div className="max-w-c-1235 mx-auto px-4 pt-10 md:px-8 xl:px-0">
          <div className="flex flex-col items-center gap-4 lg:flex-row lg:gap-16">
            <Standings1 standings={standings} />
            <StatsPanelAdvanced standings={standings} />
          </div>
        </div>
      </section>
      {/* <!-- ===== About End ===== --> */}

      {/* <!-- ===== About Two Start ===== --> */}
      <section   className="overflow-hidden pb-10 lg:pb-25 xl:pb-30">
        <div className="max-w-c-1235 mx-auto overflow-hidden px-4 md:px-8 2xl:px-0">
        <div className="flex flex-col-reverse lg:flex-col items-center gap-4 lg:flex-row lg:gap-16">
            <GoalsStatsPanel stats={stats} />
            <PlayerStatsTable loading={loading} stats={stats} />
          </div>
        </div>
      </section>
      {/* <!-- ===== About Two End ===== --> */}
    </>
  );
};

export default Standing;
