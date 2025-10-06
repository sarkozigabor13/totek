"use client";
import React from "react";
import SingleFeature from "./Player";
import SectionHeader from "../Common/SectionHeader";
import players from "./playersData";


const Players = () => {
  return (
    <>
      {/* <!-- ===== Features Start ===== --> */}
      <section id="players" className="py-20 lg:py-25 xl:py-30">
        <div className="max-w-c-1315 mx-auto px-4 md:px-8 xl:px-0">
          {/* <!-- Section Title Start --> */}
          <SectionHeader
            headerInfo={{
              title: "TótÉk kerettagoke",
              subtitle: "",
              description: `Az alábbi szekcióban a csapattagok és a hozzájuk tartozó statisztikákat lehet megtekinteni.`,
            }}
          />
          {/* <!-- Section Title End --> */}

          <div className="mt-12.5 grid grid-cols-1 gap-7.5 md:grid-cols-2 lg:mt-15 lg:grid-cols-3 xl:mt-20 xl:gap-12.5">
            {/* <!-- Features item Start --> */}

            {players.map((player, key) => (
              <SingleFeature player={player} delay={key} key={key} />
            ))}
            {/* <!-- Features item End --> */}
          </div>
        </div>
      </section>

      {/* <!-- ===== Features End ===== --> */}
    </>
  );
};

export default Players;
