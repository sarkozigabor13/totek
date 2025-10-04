"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import SectionHeader from "../Common/SectionHeader";
import { motion } from "framer-motion";
import { supabase } from "@/utils/supbase/client";
import { formatDate } from "@/utils/date/format";
import { timeUntilMatch } from "@/utils/date/until";
import { getWeatherForMatch } from "@/utils/weather/forecast";
import { getWeatherDescription } from "@/utils/weather/codes";
import { StatusBar } from "./StatusBar";

type Match = {
  id: string;
  date: any;
  location: string;
  opponent: string;
};

type Players = {
  id: string;
  name: string;
}[];

type Attendance = {
  [playerId: string]: {
    attendingMatch: boolean | null;
    attendingProgram: boolean | null;
  };
};

const Hero = () => {
  const [match, setMatch] = useState<Match | null>(null);
  const [players, setPlayers] = useState<Players | null>(null);
  const [attendance, setAttendance] = useState<Attendance>({});
  const [weather, setWeather] = useState<{
    temperature: number;
    weatherCode: any;
  } | null>(null);

  // Meccsre voksolás
  const voteMatch = async (playerId: string, value: boolean) => {
    if (!match) return;

    const updated = {
      match_id: match.id,
      player_id: playerId,
      attending_match: value,
      attending_program: attendance[playerId]?.attendingProgram ?? null,
    };

    const { error } = await supabase
      .from("match_attendance")
      .upsert(updated, { onConflict: "match_id,player_id" });
    if (error) return console.error(error);

    setAttendance((prev) => ({
      ...prev,
      [playerId]: { ...prev[playerId], attendingMatch: value },
    }));
  };

  // Közös program voksolás
  const voteProgram = async (playerId: string, value: boolean) => {
    if (!match) return;

    const updated = {
      match_id: match.id,
      player_id: playerId,
      attending_program: value,
      attending_match: attendance[playerId]?.attendingMatch ?? null,
    };

    const { error } = await supabase
      .from("match_attendance")
      .upsert(updated, { onConflict: "match_id,player_id" });
    if (error) return console.error(error);

    setAttendance((prev) => ({
      ...prev,
      [playerId]: { ...prev[playerId], attendingProgram: value },
    }));
  };

  // Szavazat törlése (meccsre)
  const deleteVote = async (playerId: string) => {
    if (!match) return;

    const { error } = await supabase
      .from("match_attendance")
      .delete()
      .eq("match_id", match.id)
      .eq("player_id", playerId);

    if (error) return console.error(error);

    setAttendance((prev) => ({
      ...prev,
      [playerId]: { attendingMatch: null, attendingProgram: null },
    }));
  };

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from("matches")
        .select("*")
        .gte("date", new Date().toISOString()) // csak jövőbeli meccsek
        .order("date", { ascending: true })
        .limit(1)
        .single();

      if (error) console.error(error);
      else setMatch(data);
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .order("name");
      if (error) console.error(error);
      else setPlayers(data);
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    if (!match) return;

    const fetchWeather = async () => {
      const w = await getWeatherForMatch(match.date);
      setWeather(w);
    };

    fetchWeather();
  }, [match]);

  useEffect(() => {
    if (!match || !players) return;

    const fetchAttendance = async () => {
      const { data, error } = await supabase
        .from("match_attendance")
        .select("*")
        .eq("match_id", match.id);

      if (error) return console.error(error);

      const initial: Attendance = {};

      players.forEach((player) => {
        const record = data?.find((item) => item.player_id === player.id);
        initial[player.id] = {
          attendingMatch: record?.attending_match ?? null,
          attendingProgram: record?.attending_program ?? null,
        };
      });

      setAttendance(initial);
    };

    fetchAttendance();
  }, [match, players]);
  return (
    <>
      <section id="hero" className="overflow-hidden pt-35 pb-20 md:pt-40 xl:pt-46 xl:pb-25">
        <div className="max-w-c-1390 mx-auto px-4 md:px-8 2xl:px-0">
          <div className="flex lg:items-center lg:gap-8 xl:gap-32.5">
            <div className="md:w-1/2">
              <SectionHeader
                align="left"
                headerInfo={{
                  title: "Következő mérkőzés",
                  subtitle: "",
                  description: ``,
                }}
              />
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    y: -20,
                  },

                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 1, delay: 0.4 }}
                viewport={{ once: true }}
                className="animate_top text-left"
              >
                <h1 className="mb-5 pr-16 text-5xl font-bold text-black dark:text-white">
                  🔥 TótÉk - {match?.opponent} 🔥
                </h1>
              </motion.div>
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    y: -20,
                  },

                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 1, delay: 0.7 }}
                viewport={{ once: true }}
                className="animate_top text-left"
              >
                {" "}
                <p>
                  <b>Időpont:</b> {formatDate(match?.date)}
                  {timeUntilMatch(match?.date) &&
                    ` (${timeUntilMatch(match?.date)} múlva)`}
                </p>
              </motion.div>

              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    y: -20,
                  },

                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 1, delay: 1.0 }}
                viewport={{ once: true }}
                className="animate_top text-left"
              >
                <p>
                  <b>Helyszín:</b> {match?.location}
                </p>
              </motion.div>

              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    y: -20,
                  },

                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 1, delay: 1.3 }}
                viewport={{ once: true }}
                className="animate_top text-left"
              >
                {" "}
                <p>
                  <b>Várható időjárás:</b> {weather?.temperature}°C,{" "}
                  {getWeatherDescription(weather?.weatherCode)}
                </p>
              </motion.div>

              <div className="mt-10 flex flex-col gap-10">
                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: -20,
                    },

                    visible: {
                      opacity: 1,
                      y: 0,
                    },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 1, delay: 1.6 }}
                  viewport={{ once: true }}
                  className="animate_top text-left"
                >
                  <StatusBar players={players || []} attendance={attendance} />
                </motion.div>
              </div>
            </div>

            <div className="animate_right hidden md:w-1/2 lg:block">
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    y: -20,
                  },

                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 1, delay: 0.4 }}
                viewport={{ once: true }}
                className="animate_top text-left"
              >
                <div className="relative overflow-x-auto rounded-lg shadow-2xl">
                  <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-blacksection text-xs text-white uppercase">
                      <tr>
                        <th scope="col" className="w-full px-6 py-3">
                          Játékos
                        </th>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          Mérkőzés
                        </th>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          Közös program
                        </th>
                        <th scope="col" className="px-6 py-3 whitespace-nowrap">
                          Voks törlése
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {players?.map((player, index) => (
                        <tr
                          className={`border-primary bg-darksection ${
                            index !== players.length - 1 ? "border-b" : ""
                          } ${
                            attendance[player.id]?.attendingMatch === true
                              ? "voted-yes"
                              : attendance[player.id]?.attendingMatch === false
                                ? "voted-no"
                                : ""
                          }`}
                          key={index}
                        >
                          <th
                            scope="row"
                            className="w-full px-6 py-4 font-medium whitespace-nowrap text-white"
                          >
                            {player.name}
                          </th>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-center gap-2">
                              {attendance[player.id]?.attendingMatch ===
                              null ? (
                                <>
                                  <button
                                    className="hover:opacity-100"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => voteMatch(player.id, true)}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.nextElementSibling?.classList.add(
                                        "opacity-50",
                                      );
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.nextElementSibling?.classList.remove(
                                        "opacity-50",
                                      );
                                    }}
                                  >
                                    <Image
                                      src="/images/icon/tick.png"
                                      width={24}
                                      height={24}
                                      alt="igen"
                                    />
                                  </button>
                                  <button
                                    className="hover:opacity-100"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => voteMatch(player.id, false)}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.previousElementSibling?.classList.add(
                                        "opacity-50",
                                      );
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.previousElementSibling?.classList.remove(
                                        "opacity-50",
                                      );
                                    }}
                                  >
                                    <Image
                                      src="/images/icon/wrong.png"
                                      width={24}
                                      height={24}
                                      alt="nem"
                                    />
                                  </button>
                                </>
                              ) : (
                                <Image
                                  src={
                                    attendance[player.id]?.attendingMatch
                                      ? "/images/icon/tick.png"
                                      : "/images/icon/wrong.png"
                                  }
                                  width={24}
                                  height={24}
                                  alt="voksolt"
                                />
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-center gap-2">
                              {attendance[player.id]?.attendingProgram ===
                              null ? (
                                <>
                                  <button
                                    className="hover:opacity-100"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => voteProgram(player.id, true)}
                                    onMouseEnter={(e) => {
                                      e.currentTarget.nextElementSibling?.classList.add(
                                        "opacity-50",
                                      );
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.nextElementSibling?.classList.remove(
                                        "opacity-50",
                                      );
                                    }}
                                  >
                                    <Image
                                      src="/images/icon/tick.png"
                                      width={24}
                                      height={24}
                                      alt="igen"
                                    />
                                  </button>
                                  <button
                                    className="hover:opacity-100"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      voteProgram(player.id, false)
                                    }
                                    onMouseEnter={(e) => {
                                      e.currentTarget.previousElementSibling?.classList.add(
                                        "opacity-50",
                                      );
                                    }}
                                    onMouseLeave={(e) => {
                                      e.currentTarget.previousElementSibling?.classList.remove(
                                        "opacity-50",
                                      );
                                    }}
                                  >
                                    <Image
                                      src="/images/icon/wrong.png"
                                      width={24}
                                      height={24}
                                      alt="nem"
                                    />
                                  </button>
                                </>
                              ) : (
                                <Image
                                  src={
                                    attendance[player.id]?.attendingProgram
                                      ? "/images/icon/tick.png"
                                      : "/images/icon/wrong.png"
                                  }
                                  width={24}
                                  height={24}
                                  alt="voksolt"
                                />
                              )}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-center">
                              <button
                                style={{ cursor: "pointer" }}
                                onClick={() => deleteVote(player.id)}
                              >
                                <Image
                                  src="/images/icon/edit.png"
                                  width={24}
                                  height={24}
                                  alt="törlés"
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
