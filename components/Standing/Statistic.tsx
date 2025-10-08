"use client";

import { motion } from "framer-motion";
import { TeamType } from ".";

type StatsPanelProps = {
  standings: TeamType[];
};

export default function StatsPanelAdvanced({ standings }: StatsPanelProps) {
  if (!standings || standings.length === 0) return null;

  const myTeam = standings.find((team) => team.team.toLowerCase() === "tóték");

  const topWinRatioTeam = standings.reduce((prev, curr) => {
    const prevRatio = prev.won / prev.played;
    const currRatio = curr.won / curr.played;
    return currRatio > prevRatio ? curr : prev;
  });

  const topGoalsTeam = standings.reduce((prev, curr) =>
    curr.goalsfor > prev.goalsfor ? curr : prev,
  );

  const bestDefenseTeam = standings.reduce((prev, curr) =>
    curr.goalsagainst < prev.goalsagainst ? curr : prev,
  );

  const bestGKTeam = standings.reduce((prev, curr) =>
    curr.goaldiff > prev.goaldiff ? curr : prev,
  );

  // --- Összehasonlítás előző / következő csapattal ---
  let prevTeam, nextTeam;
  let pointDiffPrev, pointDiffNext;
  let gkDiffPrev, gkDiffNext;
  let avgGoalsFor, avgGoalsAgainst, avgTotalGoals;

  if (myTeam) {
    avgGoalsFor = (myTeam.goalsfor / myTeam.played).toFixed(2);
    avgGoalsAgainst = (myTeam.goalsagainst / myTeam.played).toFixed(2);
    avgTotalGoals = (
      (myTeam.goalsfor + myTeam.goalsagainst) /
      myTeam.played
    ).toFixed(2);

    const sorted = [...standings].sort((a, b) => a.rank - b.rank);
    const myIndex = sorted.findIndex((t) => t.team === myTeam.team);

    prevTeam = myIndex > 0 ? sorted[myIndex - 1] : null;
    nextTeam = myIndex < sorted.length - 1 ? sorted[myIndex + 1] : null;

    if (prevTeam) {
      pointDiffPrev = prevTeam.points - myTeam.points;
      gkDiffPrev = prevTeam.goaldiff - myTeam.goaldiff;
    }
    if (nextTeam) {
      pointDiffNext = myTeam.points - nextTeam.points;
      gkDiffNext = myTeam.goaldiff - nextTeam.goaldiff;
    }
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
      }}
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 0.5, delay: 0.1 }}
      viewport={{ once: true }}
      className="animate_right bg-blacksection rounded-3xl p-6 text-white shadow-2xl w-full lg:w-1/3"
    >
      {/* --- LIGA STATISZTIKÁK --- */}
      <div className="mb-6">
        <h5 className="mb-2 font-bold text-blue-400">Liga Érdekességek</h5>
        <ul className="list-inside list-disc text-sm">
          <li>
            A liga legjobb győzelmi aránya:{" "}
            {Math.round((topWinRatioTeam.won / topWinRatioTeam.played) * 100)}%{" "}
            ({topWinRatioTeam.team}: {topWinRatioTeam.won}/
            {topWinRatioTeam.played} győzelem)
          </li>
          <li>
            Legtöbb gólt szerző csapat: {topGoalsTeam.team} (
            {topGoalsTeam.goalsfor} gól)
          </li>
          <li>
            Legjobb védelem: {bestDefenseTeam.team} (
            {bestDefenseTeam.goalsagainst} kapott gól)
          </li>
          <li>
            Legnagyobb GK: {bestGKTeam.team} (
            {bestGKTeam.goaldiff > 0 ? "+" : ""}
            {bestGKTeam.goaldiff})
          </li>
        </ul>
      </div>

      {/* --- TÓTÉK ADATOK --- */}
      {myTeam && (
        <>
          <div className="mb-6">
            <h5 className="mb-2 font-bold text-yellow-400">
              TótÉk Statisztika
            </h5>
            <ul className="list-inside list-disc text-sm">
              <li>
                Helyezés és pontszám: jelenleg a {myTeam.team} a {myTeam.rank}.
                helyen, {myTeam.points} ponttal
              </li>
              <li>
                Gólkülönbség: {myTeam.goaldiff > 0 ? "+" : ""}
                {myTeam.goaldiff} ({myTeam.goalsfor} lőtt /{" "}
                {myTeam.goalsagainst} kapott)
              </li>
              <li>
                Mérleg: {myTeam.won} győzelem, {myTeam.draw} döntetlen,{" "}
                {myTeam.lost} vereség ({myTeam.played} meccs)
              </li>
              <li>
                Átlagosan {avgTotalGoals} gól esik a meccseinken ({avgGoalsFor}{" "}
                rúgott /{avgGoalsAgainst} kapott)
              </li>
            </ul>
          </div>

          {/* --- ÖSSZEHASONLÍTÁS MÁS CSAPATOKKAL --- */}
          <div>
            <h5 className="mb-2 font-bold text-green-400">
              Összehasonlítás más csapatokkal
            </h5>
            <ul className="list-inside list-disc text-sm">
              {prevTeam && (
                <>
                  <li>
                    {myTeam.team}{" "}
                    {pointDiffPrev === 0
                      ? "azonos ponton van"
                      : `${Math.abs(pointDiffPrev)} ponttal marad el`}{" "}
                    a {prevTeam.team} csapattól
                  </li>
                  <li>
                    Gólkülönbség alapján {Math.abs(gkDiffPrev)} gólra van a{" "}
                    {prevTeam.team} csapatától
                  </li>
                </>
              )}

              {nextTeam && (
                <>
                  <li>
                    {myTeam.team}{" "}
                    {pointDiffNext === 0
                      ? "azonos ponton van"
                      : `${Math.abs(pointDiffNext)} ponttal előzi meg`}{" "}
                    a {nextTeam.team} csapatát
                  </li>
                  <li>
                    Gólkülönbség alapján {Math.abs(gkDiffNext)} góllal jobb a{" "}
                    {nextTeam.team} csapatánál
                  </li>
                </>
              )}
            </ul>
          </div>
        </>
      )}
    </motion.div>
  );
}
