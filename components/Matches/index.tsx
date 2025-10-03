"use client";
import React, { useEffect, useState } from "react";
import LatestResults1 from "./MatchesLine";
import SectionHeader from "../Common/SectionHeader";
import { supabase } from "@/utils/supbase/client";

type Match = {
  id: string;
  date: any;
  location: string;
  opponent: string;
}[];

const Matches = () => {
  const [matches, setMatches] = useState<Match | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .order("date");
      if (error) console.error(error);
      else setMatches(data);
    };

    fetchMatches();
  }, []);

  return (
    <>
      {/* <!-- ===== Features Start ===== --> */}
      <section id="matches" className="py-20 lg:py-25 xl:py-30">
        <div className="max-w-c-1315 mx-auto px-4 md:px-8 xl:px-0">
          {/* <!-- Section Title Start --> */}
          <SectionHeader
            headerInfo={{
              title: "Mérkőzések",
              subtitle: '',
              description: `Az alábbi szekcióban a csapathoz tartozó összes mérkőzést lehet megtekinteni.`,
            }}
          />
          {/* <!-- Section Title End --> */}

          <div className="mt-12.5 lg:mt-15">
            {/* <!-- Features item Start --> */}
            <LatestResults1 matches={matches} />
          </div>
        </div>
      </section>

      {/* <!-- ===== Features End ===== --> */}
    </>
  );
};

export default Matches;
