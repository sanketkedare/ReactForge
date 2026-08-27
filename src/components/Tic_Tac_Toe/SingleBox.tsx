"use client";

import React, { useContext, useState } from "react";
import { GiEagleHead, GiTigerHead } from "react-icons/gi";
import { TicTacContext } from "./TicTacContextComponent";

interface SingleBoxProps {
  i: number;
}

export const SingleBox: React.FC<SingleBoxProps> = ({ i }) => {
  const { turn, setTurn, handelerChoices } = useContext(TicTacContext);
  const [clickedBy, setClickedBy] = useState<"tiger" | "eagle" | false>(false);

  const handlerClick = () => {
    if (clickedBy) return;

    const player = turn ? "eagle" : "tiger";
    setTurn(!turn);
    setClickedBy(player);
    handelerChoices(player, i + 1);
  };

  return (
    <div
      className="border-2 border-gray-600 rounded-xl flex justify-center items-center cursor-pointer lg:w-[130px] lg:h-[130px] w-[90px] h-[90px] bg-gray-800 bg-opacity-40 hover:bg-opacity-70 transition-all active:scale-95"
      onClick={handlerClick}
    >
      {clickedBy === "eagle" && <GiEagleHead className="text-5xl text-sky-400" />}
      {clickedBy === "tiger" && (
        <GiTigerHead className="text-5xl text-yellow-500" />
      )}
    </div>
  );
};

export default SingleBox;
