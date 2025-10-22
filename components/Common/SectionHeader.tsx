"use client";
import { motion } from "framer-motion";

type HeaderInfo = {
  title: string;
  subtitle: string;
  description: string;
};

type SectionHeaderProps = {
  headerInfo: HeaderInfo;
  align?: "left" | "center";
};

const SectionHeader = ({
  headerInfo,
  align = "center",
}: SectionHeaderProps) => {
  const { title, subtitle, description } = headerInfo;

  return (
    <>
      {/* <!-- Section Title Start --> */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 1, delay: 0.1 }}
        viewport={{ once: true }}
        className={`animate_top mx-auto ${align === "left" ? "text-left" : "text-center"}`}
      >
        <div
          className={`bg-zumthor dark:border-strokedark dark:bg-blacksection mb-4 inline-block rounded-full px-4.5 py-1.5 dark:border ${
            align === "left" ? "" : "mx-auto"
          }`}
        >
          <span className="text-2xl  font-medium text-black dark:text-white">
            {title}
          </span>
        </div>
        <h2
          className={`xl:text-sectiontitle3 mb-4 text-4xl font-bold text-black md:w-4/5 xl:w-1/2 dark:text-white ${
            align === "left" ? "" : "mx-auto"
          }`}
        >
          {subtitle}
        </h2>
        <p
          className={`md:w-4/5 lg:w-3/5 xl:w-[46%] text-3xl  ${
            align === "left" ? "" : "mx-auto"
          }`}
        >
          {description}
        </p>
      </motion.div>
      {/* <!-- Section Title End --> */}
    </>
  );
};

export default SectionHeader;
