"use client";
import React, { useEffect, useState } from "react";
import LatestResults1 from "./MatchesLine";
import SectionHeader from "../Common/SectionHeader";
import { supabase } from "@/utils/supbase/client";
import Image from "next/image";
import { motion } from "framer-motion";
import LeagueSelector from "../LeagueSelector/LeagueSelector";

type Match = {
  id: string;
  date: any;
  location: string;
  opponent: string;
}[];

const Matches = () => {
  const [matches, setMatches] = useState<Match | null>(null);
  const [matchStats, setMatchStats] = useState({
    total: 0,
    played: 0,
    remaining: 0,
    progress: 0,
  });
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null | 'all'>(null);

  useEffect(() => {
    if (!selectedLeagueId) return;
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select(
          `
          id,
          date,
          location,
          result,
          wld,
          opponent,
          goals (
            id,
            scorer:scorer_id (
              id,
              name
            ),
            assist:assist_id (
              id,
              name
            )
          )
        `,
        )
        .eq("league_id", selectedLeagueId)
        .order("date");

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        const now = new Date();
        const played = data.filter(
          (match) => new Date(match.date) <= now,
        ).length;
        const remaining = data.filter(
          (match) => new Date(match.date) > now,
        ).length;
        const total = data.length;
        const progress = total > 0 ? Math.round((played / total) * 100) : 0;

        setMatches(data);
        setMatchStats({ total, played, remaining, progress });
      }
    };

    fetchMatches();
  }, [selectedLeagueId]);
  return (
    <div className="relative">
      {/* <!-- ===== Features Start ===== --> */}
      <section
        id="matches"
        className="relative py-20 lg:py-25 xl:py-30"
        style={{ zIndex: 2 }}
      >
        <div className="max-w-c-1315 mx-auto px-4 md:px-8 xl:px-0">
          {/* <!-- Section Title Start --> */}
          <SectionHeader
            headerInfo={{
              title: "Mérkőzések",
              subtitle: "",
              description: `Az alábbi szekcióban a csapathoz tartozó összes mérkőzést lehet megtekinteni.`,
            }}
          />
          {/* <!-- Section Title End --> */}
          <div className="max-w-c-1315 mx-auto mt-4 px-4 md:px-8 xl:px-0">
            <LeagueSelector
              selectedLeagueId={selectedLeagueId}
              onLeagueChange={(leagueId) => setSelectedLeagueId(leagueId)}
            />
          </div>

          {/* Meccs rész */}
          <div className="mt-10 flex flex-col gap-2">
            <div className="flex flex-col justify-between gap-2 text-lg lg:flex-row">
              <p className="text-md">
                <b>Meccsek száma:</b> {matchStats.played} / {matchStats.total}
              </p>
              <div className="text-right">
                <div
                  className="dark:bg-blacksection text-md mb-2 flex items-center rounded-lg bg-green-50 p-2.5 text-green-800 lg:mb-4 dark:text-green-400"
                  role="alert"
                >
                  <svg
                    className="me-3 inline h-4 w-4 shrink-0"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                  </svg>
                  <span className="sr-only">Info</span>
                  <div>
                    Jelenelg {matchStats.played} mérkőzést játszottunk le. ami a
                    teljes bajnokság {matchStats.progress}%-a. Még hátrva van{" "}
                    {matchStats.remaining} meccs.
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blacksection h-3 w-full overflow-hidden rounded-full">
              <motion.div
                className="bg-primary h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${matchStats.progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="mt-12.5 lg:mt-15">
            {/* <!-- Features item Start --> */}
            <LatestResults1 matches={matches} />
          </div>
        </div>
      </section>
      <div className="absolute bottom-0 w-full" style={{ zIndex: 1 }}>
        <div className="relative h-400">
          <Image
            className="h-400 w-full rounded-md object-cover grayscale-100"
            src="/images/footer/palya.png"
            alt="palya"
            fill
          />
          <div className="to-blacksection absolute inset-0 rounded-md bg-gradient-to-b from-black opacity-90"></div>
        </div>
      </div>
      {/* <!-- ===== Features End ===== --> */}
    </div>
  );
};

export default Matches;
