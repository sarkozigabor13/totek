"use client";

import { motion } from "framer-motion";
import { PlayerStat } from "./index"; // <-- FONTOS! importáljuk onnan

type GoalsStatsPanelProps = {
  stats: PlayerStat[];
};

export default function GoalsStatsPanel({ stats }: GoalsStatsPanelProps) {
  if (!stats || stats.length === 0) return null;

  const topScorer = stats.reduce((prev, curr) =>
    curr.goals > prev.goals ? curr : prev,
  );

  const topAssist = stats.reduce((prev, curr) =>
    curr.assists > prev.assists ? curr : prev,
  );

  const bestEfficiency = stats
    .filter((p) => p.goals > 0 && p.minutesPerGoal !== "—")
    .reduce((prev, curr) =>
      Number(curr.minutesPerGoal) < Number(prev.minutesPerGoal) ? curr : prev,
    );

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
      className="animate_right bg-blacksection w-full rounded-3xl p-6 text-white shadow-2xl lg:w-1/3"
    >
      {/* --- MAGYARÁZAT --- */}
      <div className="mb-6">
        <h5 className="mb-2 font-bold text-blue-400">Táblázat magyarázat</h5>
        <ul className="list-inside list-disc text-md">
          <li>
            <span className="font-bold">Gól:</span> hányszor talált be az
            adott játékos
          </li>
          <li>
            <span className="font-bold">Gólpassz:</span> hány gólnál adta a
            döntő átadást
          </li>
          <li>
            <span className="font-bold">Összesen:</span> Hány gólt és
            gólpasszt jegyez összesen a játékos. Kanadai pontok.
          </li>
          <li>
            <span className="font-bold">Gól / meccs:</span> Hány gólt szerez
            átlagosan a játékos meccsenként.
          </li>
          <li>
            <span className="font-bold">Gólpassz / meccs:</span> Hány
            gólpasszt szerez átlagosan a játékos meccsenként.
          </li>
          <li>
            <span className="font-bold">Percenkénti gól:</span> átlagosan
            hány percenként rúg egy gólt (csak lejátszott meccseket számolva)
          </li>
        </ul>
      </div>

      {/* --- LEGJOBBAK --- */}
      <div>
        <h5 className="mb-2 font-bold text-green-400">
          Kiemelkedő teljesítmények
        </h5>
        <ul className="list-inside list-disc text-md">
          <li>
            <span className="font-semibold">Legtöbb gólt szerző:</span>{" "}
            {topScorer.name} ({topScorer.goals} gól)
          </li>
          <li>
            <span className="font-semibold">Legtöbb gólpassz:</span>{" "}
            {topAssist.name} ({topAssist.assists} gólpassz)
          </li>
          {bestEfficiency && (
            <li>
              <span className="font-semibold">Legjobb hatékonyság:</span>{" "}
              {bestEfficiency.name} – {bestEfficiency.minutesPerGoal} percenként
              rúg gólt
            </li>
          )}
        </ul>
      </div>
    </motion.div>
  );
}
