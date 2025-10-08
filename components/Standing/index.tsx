"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import Standings1 from "./Standing01";
import StatsPanelAdvanced from "./Statistic";
import { supabase } from "@/utils/supbase/client";
import SectionHeader from "../Common/SectionHeader";

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

const Standing = () => {
  const [standings, setStandings] = useState<TeamType[]>([]);

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
  return (
    <>
      {/* <!-- ===== About Start ===== --> */}
      <section id="standing" className="overflow-hidden pt-20 pb-20 lg:pb-25 xl:pb-30">
        <SectionHeader
          headerInfo={{
            title: "Tabellák",
            subtitle: "",
            description: `Az alábbi szekcióban a csapattal kapcsolatos tabellák megtekinthetőek.`,
          }}
        />
        <div className="max-w-c-1235 mx-auto px-4 md:px-8 xl:px-0 pt-10">
          <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-16">
            <Standings1 standings={standings} />
            <StatsPanelAdvanced standings={standings} />
          </div>
        </div>
      </section>
      {/* <!-- ===== About End ===== --> */}

      {/* <!-- ===== About Two Start ===== --> */}
   {/*    <section>
        <div className="max-w-c-1235 mx-auto overflow-hidden px-4 md:px-8 2xl:px-0">
          <div className="flex items-center gap-8 lg:gap-32.5">
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  x: -20,
                },

                visible: {
                  opacity: 1,
                  x: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_left md:w-1/2"
            >
              <h4 className="font-medium text-black uppercase dark:text-white">
                Launch Your SaaS Fast
              </h4>
              <h2 className="xl:text-hero relative mb-6 text-3xl font-bold text-black dark:text-white">
                Packed with All Essential {"   "}
                <span className="before:bg-titlebg2 dark:before:bg-titlebgdark relative inline-block before:absolute before:bottom-2.5 before:left-0 before:-z-1 before:h-3 before:w-full">
                  Integrations
                </span>
              </h2>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                ultricies lacus non fermentum ultrices. Fusce consectetur le.
              </p>
              <div>
                <a
                  href="#"
                  className="group hover:text-primary dark:hover:text-primary mt-7.5 inline-flex items-center gap-2.5 text-black dark:text-white"
                >
                  <span className="duration-300 group-hover:pr-2">
                    Know More
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="currentColor"
                  >
                    <path d="M10.4767 6.16701L6.00668 1.69701L7.18501 0.518677L13.6667 7.00034L7.18501 13.482L6.00668 12.3037L10.4767 7.83368H0.333344V6.16701H10.4767Z" />
                  </svg>
                </a>
              </div>
            </motion.div>
            <motion.div
              variants={{
                hidden: {
                  opacity: 0,
                  x: 20,
                },

                visible: {
                  opacity: 1,
                  x: 0,
                },
              }}
              initial="hidden"
              whileInView="visible"
              transition={{ duration: 1, delay: 0.1 }}
              viewport={{ once: true }}
              className="animate_right relative mx-auto hidden aspect-[588/526.5] md:block md:w-1/2"
            >
              <Image
                src="./images/about/about-light-02.svg"
                alt="About"
                className="dark:hidden"
                fill
              />
              <Image
                src="./images/about/about-dark-02.svg"
                alt="About"
                className="hidden dark:block"
                fill
              />
            </motion.div>
          </div>
        </div>
      </section> */}
      {/* <!-- ===== About Two End ===== --> */}
    </>
  );
};

export default Standing;
