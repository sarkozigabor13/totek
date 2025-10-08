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
import toast from "react-hot-toast";
import playersData from "../Players/playersData";


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
  const voteMatch = async (
    playerId: string,
    value: boolean,
    player: string,
  ) => {
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

    value
      ? toast.success(`Remek hír, ${player} jön a meccsre!`)
      : toast.error(`${player}, köszi a visszajelzést!`);

    setAttendance((prev) => ({
      ...prev,
      [playerId]: { ...prev[playerId], attendingMatch: value },
    }));
  };

  // Közös program voksolás
  const voteProgram = async (
    playerId: string,
    value: boolean,
    player: string,
  ) => {
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

    value
      ? toast.success(`Remek hír, ${player} jön a közös progira!`)
      : toast.error(`${player}, köszi a visszajelzést!`);

    setAttendance((prev) => ({
      ...prev,
      [playerId]: { ...prev[playerId], attendingProgram: value },
    }));
  };

  // Szavazat törlése (meccsre)
  const deleteVote = async (playerId: string, player: string) => {
    if (!match) return;

    const { error } = await supabase
      .from("match_attendance")
      .delete()
      .eq("match_id", match.id)
      .eq("player_id", playerId);

    if (error) return console.error(error);

    toast.success(`${player} most már újra szavazhatsz!`);

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

  useEffect(() => {
    if (!match || !players) return;

    const subscription = supabase
      .channel("attendance_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "match_attendance",
          filter: `match_id=eq.${match.id}`,
        },
        (payload) => {
          const record = payload.new as {
            player_id: string;
            attending_match: boolean | null;
            attending_program: boolean | null;
          };

          setAttendance((prev) => ({
            ...prev,
            [record.player_id]: {
              attendingMatch: record.attending_match,
              attendingProgram: record.attending_program,
            },
          }));

          const player = players.find((p) => p.id === record.player_id);
          const playerName = player ? player.name : record.player_id;

          toast.custom((t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } bg-blacksection shadow-3xl flex items-center gap-3 rounded-lg px-4 py-3 text-white`}
            >
              <Image
                src="/images/icon/info.png"
                alt="info"
                width={20}
                height={20}
              />
              <span>{playerName} új szavazatot adott le!</span>
            </div>
          ));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [match, players]);

  return (
    <>
      <section
        id="hero"
        className="overflow-hidden pt-25 pb-20 md:pt-40 lg:pt-35 xl:pt-46 xl:pb-25"
      >
        <div className="max-w-c-1390 mx-auto px-4 md:px-8 2xl:px-0">
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-8 xl:gap-32.5">
            <div className="lg:w-1/2">
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
                <h1 className="mb-5 text-center text-5xl font-bold text-black md:pr-16 md:text-left dark:text-white">
                  <span className="hidden md:inline-flex">🔥</span>{" "}
                  <span className="md:hidden">🔥</span> TótÉk{" "}
                  <span className="md:hidden">🔥</span>{" "}
                  <span className="hidden md:inline-flex">&nbsp;</span>{" "}
                  <br className="md:hidden" /> x <br className="md:hidden" />{" "}
                  <span className="hidden md:inline-flex">&nbsp;</span>{" "}
                  {match?.opponent}{" "}
                  <span className="hidden md:inline-flex">🔥</span>
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

            <div className="animate_right mt-10 lg:mt-0 lg:w-1/2">
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
                            {(() => {
                             const found = playersData.find(
                              (p) => String(p.id) === String(player.id)
                            );
                              return (
                                <div className="flex items-center gap-3">
                                  {found?.img && (
                                    <Image
                                      src={found.img}
                                      alt={found.name}
                                      width={32}
                                      height={32}
                                      className="rounded-full"
                                    />
                                  )}
                                  <span>{player.name}</span>
                                </div>
                              );
                            })()}
                          </th>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex justify-center gap-2">
                              {attendance[player.id]?.attendingMatch ===
                              null ? (
                                <>
                                  <button
                                    className="hover:opacity-100"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      voteMatch(player.id, true, player.name)
                                    }
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
                                      voteMatch(player.id, false, player.name)
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
                                    onClick={() =>
                                      voteProgram(player.id, true, player.name)
                                    }
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
                                      voteProgram(player.id, false, player.name)
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
                                onClick={() =>
                                  deleteVote(player.id, player.name)
                                }
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
