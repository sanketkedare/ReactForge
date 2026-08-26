"use client";

import React, { useContext } from "react";
import { BsTrophy } from "react-icons/bs";
import { TicTacContext } from "./TicTacContextComponent";

export const ResultComponent: React.FC = () => {
  const { setEndGame, endGame } = useContext(TicTacContext);

  if (!endGame) return null;

  return (
    <div
      className="w-[90%] max-w-[500px] h-[300px] top-20 left-1/2 -translate-x-1/2 bg-gray-900 border-2 border-yellow-400 rounded-2xl fixed z-50 flex justify-center items-center shadow-2xl cursor-pointer"
      onClick={() => setEndGame(false)}
    >
      <div className="m-auto w-full text-center p-6">
        <span className="text-3xl lg:text-4xl font-extrabold text-white">
          {endGame}
        </span>
        <BsTrophy className="text-6xl text-center m-auto text-yellow-400 my-4 animate-bounce" />
        <p className="text-sm text-gray-400">Click anywhere to dismiss</p>
      </div>
    </div>
  );
};

export default ResultComponent;
