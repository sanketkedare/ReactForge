"use client";

import React, { useState } from "react";
import ShowStars from "./ShowStarts";
import { colors, faces } from "./utils";

export const StartRating: React.FC = () => {
  const [rate, setRate] = useState<number>(0);

  const safeRate = Math.min(Math.max(rate, 0), 5);

  return (
    <div className="m-auto lg:w-[80%] mt-10">
      <h1 className="font-bold lg:text-3xl text-xl text-center">Star Rating</h1>

      {/* Rating Display */}
      <div
        style={{
          background: colors[safeRate]?.hex || "#8B0000",
          color: colors[safeRate]?.text || "#FFFFFF",
        }}
        className="relative m-auto lg:w-[400px] rounded-xl h-[200px] my-16 flex flex-col justify-center gap-6 items-center shadow-2xl transition-all duration-300"
      >
        <span className="text-5xl">{faces[safeRate]}</span>
        <ShowStars rate={rate} setRate={setRate} />
      </div>

      {/* Input Range */}
      <div className="lg:w-[500px] h-[100px] m-auto">
        <h1 className="text-center text-2xl font-bold p-3">Choose Input</h1>
        <input
          className="w-full cursor-pointer"
          type="range"
          max={5}
          min={0}
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
        />
        <h2 className="text-center text-xl font-semibold text-gray-400 mt-2">
          You Rate: {rate} / 5
        </h2>
      </div>
    </div>
  );
};

export default StartRating;
