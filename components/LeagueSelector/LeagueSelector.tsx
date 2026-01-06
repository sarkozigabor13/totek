"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/utils/supbase/client";

export type League = {
  id: number;
  name: string;
  season: string;
};

type LeagueSelectorProps = {
  selectedLeagueId: number | "all" | null;
  onLeagueChange: (leagueId: number | "all") => void;
  allowAllOption?: boolean; // <-- ez az új prop
};

const LeagueSelector: React.FC<LeagueSelectorProps> = ({
  selectedLeagueId: defaultLeagueId,
  onLeagueChange,
  allowAllOption = false,
}) => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | "all" | null>(
    defaultLeagueId
  );

  useEffect(() => {
    const fetchLeagues = async () => {
      const { data, error } = await supabase
        .from("leagues")
        .select("id, name, season")
        .order("id", { ascending: false }); // legújabb előre

      if (error) return console.error(error);

      if (data && data.length > 0) {
        setLeagues(data);

        // Alapértelmezett: legújabb liga
        const firstLeagueId = defaultLeagueId ?? data[0].id;
        setSelectedLeagueId(firstLeagueId);
        onLeagueChange(firstLeagueId);
      }
    };

    fetchLeagues();
  }, [defaultLeagueId, onLeagueChange]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const leagueId = allowAllOption && e.target.value === "all" ? "all" : Number(e.target.value);
    setSelectedLeagueId(leagueId);
    onLeagueChange(leagueId);
  };

  return (
    <form className="mx-auto max-w-sm">
      <label htmlFor="league" className="mb-2.5 block text-lg font-medium text-white">
        Válassz ligát
      </label>
      <select
        id="league"
        value={selectedLeagueId ?? ""}
        onChange={handleChange}
        className="bg-blacksection border-default-medium rounded-base focus:ring-brand focus:border-brand placeholder:text-body block w-full rounded border p-2 px-3 py-2.5 text-lg text-white shadow-xs"
      >
        {allowAllOption && <option value="all">Minden mutatás</option>}
        {leagues.map((league) => (
          <option key={league.id} value={league.id}>
            {league.season} {league.name}
          </option>
        ))}
      </select>
    </form>
  );
};

export default LeagueSelector;