"use client";

import React, { useContext } from "react";
import { MdRestartAlt } from "react-icons/md";
import { TicTacContext } from "./TicTacContextComponent";

export const HeadingComponent: React.FC = () => {
  const { turn, restartGame } = useContext(TicTacContext);

  return (
    <div className="text-center">
      <h1 className="font-bold lg:text-2xl text-lg my-5 flex justify-center items-center gap-4 flex-wrap">
        <span
          className={`font-bold transition-all duration-200 ${
            !turn ? "bg-white text-black scale-105 shadow" : "opacity-60"
          } rounded-xl p-3 min-w-[120px]`}
        >
          🐅 Tiger
        </span>
        <span className="text-yellow-400">VS</span>
        <span
          className={`font-bold transition-all duration-200 ${
            turn ? "bg-white text-black scale-105 shadow" : "opacity-60"
          } rounded-xl p-3 min-w-[120px]`}
        >
          🦅 Eagle
        </span>
      </h1>
      <button
        onClick={restartGame}
        className="bg-red-600 p-2 my-2 rounded-xl text-white flex items-center justify-center gap-2 hover:bg-red-700 m-auto border transition-colors font-semibold"
      >
        <MdRestartAlt className="text-xl" />
        Restart Game
      </button>
    </div>
  );
};

export default HeadingComponent;
