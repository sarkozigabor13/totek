import Image from "next/image";
import { JSX } from "react";

interface PlayerRatingProps {
  skill: string;
  value: number;
}

const PlayerRating = ({ skill, value }: PlayerRatingProps) => {
  const max = 5;
  const stars: JSX.Element[] = [];

  for (let i = 1; i <= max; i++) {
    stars.push(
      <Image
        key={i}
        src={i <= value ? "/images/team/star-yellow.png" : "/images/team/star-gray.png"}
        alt="star"
        width={20}
        height={20}
        className="inline-block"
      />
    );
  }

  return (
    <div className="flex flex-row gap-4 items-center text-center px-7 justify-between">
      <div className="text-lg font-semibold mb-1">{skill}</div>
      <div className="flex gap-1">{stars}</div>
    </div>
  );
};

export default PlayerRating;
