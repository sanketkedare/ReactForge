"use client";

import React from "react";
import { IoIosStar } from "react-icons/io";

interface ShowStarsProps {
  rate: number;
  setRate: React.Dispatch<React.SetStateAction<number>>;
}

export const ShowStars: React.FC<ShowStarsProps> = ({ rate, setRate }) => {
  const totalStars = 5;

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length: totalStars }, (_, index) => (
        <IoIosStar
          key={index}
          className="text-[50px] cursor-pointer transition-transform hover:scale-110"
          style={{ color: rate > index ? "#ffff00" : "#cccccc" }}
          onClick={() => setRate(index + 1)}
          aria-label={`Rate ${index + 1} stars`}
        />
      ))}
    </div>
  );
};

export default ShowStars;
