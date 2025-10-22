"use client";

import { motion } from "framer-motion";

type Attendance = {
  [playerId: string]: {
    attendingMatch: boolean | null;
    attendingProgram: boolean | null;
  };
};

type StatusBarProps = {
  players: { id: string; name: string }[];
  attendance: Attendance;
};

const StatusBar = ({ players, attendance }: StatusBarProps) => {
  // Szűrt lista — Ágoston kikerül a játékosok statjából
  const filteredPlayers = players.filter(
    (p) => p.name.toLowerCase() !== "vértesaljai ágoston"
  );

  // --- MECCS rész ---
  const totalPlayers = filteredPlayers.length;

  const votedMatchCount = filteredPlayers.filter(
    (p) => attendance[p.id]?.attendingMatch === true
  ).length;

  let matchStatusMessage = "";
  let matchStatusType = "";

  if (votedMatchCount < 5) {
    matchStatusType = "red";
    const missing = 5 - votedMatchCount;
    matchStatusMessage = `Nem vagyunk meg! (${missing} ember hiányzik)`;
  } else if (votedMatchCount === 5) {
    matchStatusType = "yellow";
    matchStatusMessage = "Megvagyunk! (Nincs csere)";
  } else {
    matchStatusType = "green";
    const extra = votedMatchCount - 5;
    matchStatusMessage = `Megvagyunk! (${extra} csere van)`;
  }

  const matchProgress = Math.min((votedMatchCount / totalPlayers) * 100, 100);

  // --- KÖZÖS PROGRAM rész ---
  // ide Ágoston is beleszámít!
  const totalProgramPlayers = players.length;

  const votedProgramCount = players.filter(
    (p) => attendance[p.id]?.attendingProgram === true
  ).length;

  let programStatusMessage = "";

  if (votedProgramCount < 3) {
    programStatusMessage = `Alakul a dolog 🍷`;
  } else if (votedProgramCount < 9) {
    programStatusMessage = "Szép számmal megyünk 🍻🍻";
  } else {
    programStatusMessage = `Full csapat 🍾🍾🍾`;
  }

  const programProgress = Math.min(
    (votedProgramCount / totalProgramPlayers) * 100,
    100
  );

  return (
    <div className="flex flex-col gap-6">
      {/* --- Meccs rész --- */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between flex-col lg:flex-row gap-2 text-2xl">
          <p>
            <b>Játékosok száma:</b> {votedMatchCount}/{totalPlayers}
          </p>
          <div className="text-right">
            <div
              className={`dark:bg-blacksection mb-2 lg:mb-4 flex items-center rounded-lg p-2.5 text-lg ${
                matchStatusType === "red"
                  ? "bg-red-50 text-red-800 dark:text-red-400"
                  : matchStatusType === "yellow"
                    ? "bg-yellow-50 text-yellow-800 dark:text-yellow-300"
                    : "bg-green-50 text-green-800 dark:text-green-400"
              }`}
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
              <div>{matchStatusMessage}</div>
            </div>
          </div>
        </div>

        <div className="bg-blacksection h-3 w-full overflow-hidden rounded-full">
          <motion.div
            className="bg-primary h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${matchProgress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* --- Közös program rész --- */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between flex-col lg:flex-row gap-2 ">
          <p>
            <b>Közös program</b> {votedProgramCount}/{totalProgramPlayers}
          </p>
          <div className="text-right">
            <div
              className="dark:bg-blacksection mb-2 lg:mb-4 flex items-center rounded-lg p-2.5 text-lg"
              role="alert"
            >
              <span>{programStatusMessage}</span>
            </div>
          </div>
        </div>

        <div className="bg-blacksection h-3 w-full overflow-hidden rounded-full">
          <motion.div
            className="bg-primary h-3 rounded-full text-2xl"
            initial={{ width: 0 }}
            animate={{ width: `${programProgress}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};

export { StatusBar };
