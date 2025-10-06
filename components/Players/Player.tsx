import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import PlayerRating from "./PlayerRating";


const SinglePlayer = ({ player, delay }: { player: any, delay: any }) => {
  const { img, stats, name, position, skills } = player;

  return (
    <>
      <motion.div
        variants={{
          hidden: {
            opacity: 0,
            y: -10,
          },

          visible: {
            opacity: 1,
            y: 0,
          },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.5, delay: delay * 0.3 }}
        viewport={{ once: true }}
        className="animate_top shadow-solid-3 hover:shadow-solid-4 z-40 transition-all"
      >
        <div className="mx-auto">
          <div className="bg-blacksection border-custom-gray-200 bg-custom-gray-100 dark:border-custom-gray-600 dark:bg-custom-gray-700 rounded-3xl border">
            <div className="ring-custom-gray-200 dark:bg-custom-gray-800 dark:ring-custom-gray-600 rounded-3xl py-4 ring-1">
              <div className="relative overflow-hidden pb-3">
                <div className="overflow-hidden [filter:url('#rounded')]">
                  <div className="from-custom-orange to-custom-yellow relative h-[400px] bg-linear-to-b [clip-path:polygon(0_0,_100%_0,_100%_95%,_50%_100%,_0_95%)]">
                    <div className="pointer-events-none absolute start-1/2 top-10 -z-10 -translate-x-1/2 text-center text-9xl/[0.8em] font-extrabold tracking-tighter text-white uppercase italic opacity-40 mix-blend-overlay">
                      <div>{name.split(" ")[0]}</div>
                      <div>{name.split(" ")[1]}</div>
                    </div>
                    <img
                      src={img}
                      alt="Player"
                      className="absolute start-1/2 top-2 h-100 max-w-[calc(100%+60px)] -translate-x-1/2"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 pb-1 text-center text-slate-800 dark:text-white">
                <h2 className="mt-0! text-[22px]/tight font-bold tracking-tight">
                  {name}
                </h2>
                <div className="text-sm">{position}</div>
              </div>
            </div>
            <div className="mx-auto w-fit py-5 text-slate-800 dark:text-white">
              <div className="divide-custom-gray-200 dark:divide-custom-gray-600 grid grid-cols-3 divide-x">
                {stats.slice(0, 3).map((statistic) => (
                  <div key={statistic.label} className="px-7 text-center">
                    <div className="mb-2 text-sm/tight font-bold">
                      {statistic.value}
                    </div>
                    <div className="text-2xs/tight uppercase">
                      {statistic.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* második sor - 2 elem középen, elválasztóval */}
              <div className="divide-custom-gray-200 dark:divide-custom-gray-600 mx-auto mt-5 grid w-fit grid-cols-2 justify-center divide-x">
                {stats.slice(3, 5).map((statistic) => (
                  <div key={statistic.label} className="px-7 text-center">
                    <div className="mb-2 text-sm/tight font-bold">
                      {statistic.value}
                    </div>
                    <div className="text-2xs/tight uppercase">
                      {statistic.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4">
              {skills.map((skill, i) => (
                  <PlayerRating key={i} skill={skill.label} value={skill.value} />
                ))}
              </div>
            </div>
          </div>

          <svg
            className="invisible absolute"
            width="0"
            height="0"
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
          >
            <defs>
              <filter id="rounded-sm">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="9"
                  result="blur-sm"
                />
                <feColorMatrix
                  in="blur-sm"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                  result="goo"
                />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
            </defs>
          </svg>
        </div>
      </motion.div>
    </>
  );
};

export default SinglePlayer;
