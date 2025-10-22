import React from "react";
import { motion } from "framer-motion";
import PlayerRating from "./PlayerRating";

const SinglePlayer = ({ player }: { player: any }) => {
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
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="animate_top shadow-solid-3 hover:shadow-solid-4 z-40 transition-all"
      >
        <div className="mx-auto">
          <div className="bg-blacksection border-custom-gray-200 bg-custom-gray-100 dark:border-custom-gray-600 dark:bg-custom-gray-700 rounded-3xl border">
            <div className="ring-custom-gray-200 dark:bg-custom-gray-800 dark:ring-custom-gray-600 rounded-3xl pt-4">
              <div className="relative overflow-hidden pb-3">
                <div className="overflow-hidden [filter:url('#rounded')]">
                  <div className="from-custom-orange to-custom-yellow relative h-[400px] bg-linear-to-b [clip-path:polygon(0_0,_100%_0,_100%_95%,_50%_100%,_0_95%)]">
                    <div className="pointer-events-none absolute start-1/2 top-10 -z-10 -translate-x-1/2 text-center text-9xl/[0.8em] font-extrabold tracking-tighter text-white uppercase italic opacity-40 mix-blend-overlay">
                    <div className="pointer-events-none absolute start-1/2 top-10 -z-10 -translate-x-1/2 text-center text-9xl/[0.8em] font-extrabold tracking-tighter text-white uppercase italic opacity-40 mix-blend-overlay flex flex-col items-center">
                      <motion.div
                        initial={{ x: -100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        viewport={{ once: true }}
                      >
                      {name.split(" ")[0]}
                      </motion.div>
                      <motion.div
                        initial={{ x: 100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                        viewport={{ once: true }}
                      >
                      {name.split(" ")[1]}
                      </motion.div>
                    </div>
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
                <div className="text-lg">{position}</div>
              </div>
            </div>
            <div className="mx-auto w-fit px-2 py-5 text-slate-800 dark:text-white">
              <div className="divide-custom-gray-200 dark:divide-custom-gray-600 grid grid-cols-3 divide-x border-y py-2">
                {stats.slice(0, 3).map((statistic) => (
                  <div key={statistic.label} className="px-7 text-center">
                    <div className="mb-2 text-lg/tight font-bold">
                      {statistic.value}
                    </div>
                    <div className="text-2xs/tight uppercase">
                      {statistic.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* második sor - 2 elem középen, elválasztóval */}
              <div className="divide-custom-gray-200 dark:divide-custom-gray-600 grid grid-cols-3 divide-x border-b py-2">
                {stats.slice(3, 6).map((statistic) => (
                  <div key={statistic.label} className="px-7 text-center">
                    <div className="mb-2 text-lg/tight font-bold">
                      {statistic.value}
                    </div>
                    <div className="text-lg/tight uppercase">
                      {statistic.label}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-4">
                {skills.map((skill, i) => (
                  <PlayerRating
                    key={i}
                    skill={skill.label}
                    value={skill.value}
                  />
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
