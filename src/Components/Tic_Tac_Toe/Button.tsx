"use client";

import React, { useContext } from "react";
import { TicTacContext } from "./TicTacContextComponent";

export const Button: React.FC = () => {
  const { start, setStart } = useContext(TicTacContext);

  return (
    <div className="lg:my-4 my-6 text-center">
      <button
        className="bg-yellow-400 hover:bg-sky-500 text-black p-3 lg:w-[200px] w-[140px] font-bold rounded-xl shadow-md transition-colors"
        onClick={() => setStart(!start)}
      >
        {start ? "Exit Game" : "Start Game"}
      </button>
    </div>
  );
};

export default Button;
